import util from "util";
import winston from "winston";
import { TransformableInfo } from "logform";

import packageInfo from "../../../package.json";
import { Env } from "../env";

const {
  combine,
  timestamp,
  label,
  ms,
  splat,
  prettyPrint,
  colorize,
  printf
} = winston.format;

enum FormatedMode {
  Console,
  File
}

const combinedFormat = (mode: FormatedMode = FormatedMode.Console) => {
  // 格式化方法，用于支持可变参以及输出 JSON  对象
  const utilFormatter = () => {
    return {
      transform: (info: TransformableInfo, opts?: any) => {
        const args = info[Symbol.for("splat") as any];
        if (args) {
          info.message = util.format(info.message, ...args);
        }
        return info;
      }
    };
  };

  const formats = [
    label({ label: packageInfo.name }),
    ms(),
    // splat(),
    utilFormatter(),
    prettyPrint(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" })
  ];

  if (mode === FormatedMode.Console) {
    formats.push(colorize());
  }

  formats.push(
    printf(({ level, message, ms, label, timestamp }) => {
      return `${timestamp}${ms} [${label}] ${level}: ${message}`;
    })
  );

  return combine(...formats);
};

const ConsoleTransport = new winston.transports.Console({
  format: combinedFormat(FormatedMode.Console)
});

const FileTransports = [
  new winston.transports.File({
    filename: `${Env.getAppDataDir()}/logs/output.log}`,
    format: combinedFormat(FormatedMode.File)
  }),
  new winston.transports.File({
    filename: `${Env.getAppDataDir()}/logs/error.log}`,
    level: "error",
    format: combinedFormat(FormatedMode.File)
  })
];

let transports: winston.transport[] = [];

console.log("Current Env = ", process.env.NODE_ENV);

if (Env.isProduction()) {
  transports = [...FileTransports];
} else {
  transports = [ConsoleTransport, ...FileTransports];
}

export const logger = winston.createLogger({
  level: "debug",
  defaultMeta: { service: packageInfo.name },
  exitOnError: false,
  transports
});
