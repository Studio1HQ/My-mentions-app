type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000; // Keep last 1000 logs in memory

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // In development, also log to console
    if (process.env.NODE_ENV === "development") {
      const consoleMethod =
        entry.level === "error"
          ? "error"
          : entry.level === "warn"
          ? "warn"
          : entry.level === "debug"
          ? "debug"
          : "log";
      console[consoleMethod](
        `[${entry.level.toUpperCase()}] ${entry.message}`,
        entry.data || ""
      );
    }

    // TODO: In production, send logs to a logging service
    // if (process.env.NODE_ENV === "production") {
    //   // Send to logging service (e.g., Sentry, LogRocket, etc.)
    // }
  }

  info(message: string, data?: unknown) {
    this.addLog(this.formatMessage("info", message, data));
  }

  warn(message: string, data?: unknown) {
    this.addLog(this.formatMessage("warn", message, data));
  }

  error(message: string, error?: Error | unknown) {
    this.addLog(this.formatMessage("error", message, error));
  }

  debug(message: string, data?: unknown) {
    if (process.env.NODE_ENV === "development") {
      this.addLog(this.formatMessage("debug", message, data));
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
