import winston from "winston";
import "winston-daily-rotate-file";

import path from "node:path";

function createConsoleTransport() {
  return new winston.transports.Console({
    level: "debug",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length > 0 ? JSON.stringify(meta) : ""}`;
      }),
    ),
  });
}

function createFileTransport() {
  return new winston.transports.DailyRotateFile({
    dirname: "logs/",
    filename: "log-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
  });
}

function createExceptionFileTransport() {
  return new winston.transports.DailyRotateFile({
    dirname: path.resolve(__dirname, "../logs"),
    filename: "error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
    format: winston.format.combine(
      winston.format((log) => (log.level === "error" ? log : false))(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length > 0 ? JSON.stringify(meta) : ""}`;
      }),
    ),
  });
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length > 0 ? JSON.stringify(meta) : ""}`;
  }),
);

export class Log {
  private static logger: winston.Logger;

  public static initialize() {
    Log.logger = winston.createLogger({
      format: customFormat,
      transports: [createConsoleTransport(), createFileTransport()],
    });
  }

  public static debug(message: string, data?: any) {
    this.logger.debug(message, data);
  }

  public static info(message: string, data?: any) {
    this.logger.info(message, data);
  }

  public static warn(message: string, data?: any) {
    this.logger.warn(message, data);
  }

  public static error(message: string, data?: any) {
    this.logger.error(message, data);
  }
}
