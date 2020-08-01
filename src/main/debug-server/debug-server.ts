import WebSocket from "ws";
import { DebugCommands } from "./commands";
import { DATABASE } from "@blueprintjs/icons/lib/esm/generated/iconContents";

interface DebugProcessClient {
  PID: string;
  socket: WebSocket;
}

export class DebugServer {
  static wsServer: WebSocket.Server;
  static clients: DebugProcessClient[] = [];
  static async start() {
    if (this.wsServer) {
      this.wsServer.close();
    }

    this.wsServer = new WebSocket.Server({ port: 8080 });
    this.wsServer.on("connection", (socket: WebSocket) => {
      socket.on("message", (receivedData) => {
        console.log("received: %s", receivedData);

        const message = JSON.parse(receivedData.toString());

        const cmd = message.cmd;
        const data = message.data;

        if (!message || !message.cmd) {
          console.log("error: unknown command.");
          return;
        }

        this.handleMessage(socket, cmd, data);
      });
    });

    console.log("Debug server started");
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
        break;
    }
  }
}
