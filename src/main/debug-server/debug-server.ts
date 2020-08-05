import WebSocket from "ws";
import { DebugCommands } from "./commands";
import { logger } from "../../common/lib/logger";
import getPort from "get-port";

interface DebugProcessClient {
  PID: string;
  socket: WebSocket;
}

export enum WSServerStatus {
  Listening,
  Closed
}

export class DebugServer {
  static wsServer: WebSocket.Server;
  static clients: DebugProcessClient[] = [];
  static currentStatus: WSServerStatus = WSServerStatus.Closed;

  static async stop() {
    return await new Promise((resolve) => {
      const t = setTimeout(resolve, 1500);
      if (this.wsServer && this.currentStatus === WSServerStatus.Listening) {
        this.wsServer.close(() => {
          clearTimeout(t);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  static async start() {
    await this.stop();

    const port = await getPort({ port: getPort.makeRange(56100, 56200) });

    this.wsServer = new WebSocket.Server({ port });

    this.wsServer.on("connection", (socket: WebSocket) => {
      socket.on("message", (receivedData) => {
        logger.debug("received: %s", receivedData);

        const message = JSON.parse(receivedData.toString());

        const cmd = message.cmd;
        const data = message.data;

        if (!message || !message.cmd) {
          logger.debug("error: unknown command.");
          return;
        }

        this.handleMessage(socket, cmd, data);
      });
    });

    this.wsServer.on("listening", () => {
      this.onServerStatusChanged(WSServerStatus.Listening);
    });

    this.wsServer.on("close", () => {
      this.onServerStatusChanged(WSServerStatus.Closed);
    });

    this.wsServer.on("error", () => {
      this.onServerStatusChanged(WSServerStatus.Closed);
    });

    logger.debug("Debug server started");
  }

  private static onServerStatusChanged(status: WSServerStatus) {
    this.currentStatus = status;
  }

  static serverAddress() {
    if (!this.wsServer || this.currentStatus !== WSServerStatus.Listening) {
      return "";
    }

    const addressInfo = this.wsServer.address() as WebSocket.AddressInfo;
    if (!addressInfo) {
      return "";
    }

    let ip = addressInfo.address;
    if (ip === "0.0.0.0") {
      ip = "127.0.0.1";
    }

    return `http://${ip}:${addressInfo.port}`;
  }

  static async removeClient(PID: string) {
    this.clients = this.clients.filter((v) => {
      if (v.PID === PID) {
        v.socket.close();
        return false;
      }

      return v.PID !== PID;
    });
  }

  private static async handleMessage(
    socket: WebSocket,
    cmd: string,
    data: any
  ) {
    switch (cmd) {
      case DebugCommands.Register:
        this.removeClient(data.PID);
        this.clients.push({
          socket,
          PID: data.PID
        });

        // 尝试发送一个
        setTimeout(() => {
          this.sendMessage(socket, {
            cmd: "reload_player",
            data: {
              script: "particle.snow()"
            }
          });
        }, 3000);

        break;
    }
  }

  private static async sendMessage(socket: WebSocket, data: any) {
    socket.send(JSON.stringify(data));
  }
}
