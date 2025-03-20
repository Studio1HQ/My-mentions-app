import { logger } from "../logger";

describe("Logger", () => {
  const mockConsole = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
  };

  beforeEach(() => {
    // Clear logs before each test
    logger.clearLogs();
    // Mock console methods
    for (const [key, value] of Object.entries(mockConsole)) {
      jest
        .spyOn(
          console,
          key as keyof Pick<
            Console,
            "info" | "warn" | "error" | "debug" | "log"
          >
        )
        .mockImplementation(value);
    }
  });

  afterEach(() => {
    // Restore console mocks
    jest.restoreAllMocks();
  });

  it("logs info messages", () => {
    const message = "Test info message";
    const data = { test: true };

    logger.info(message, data);
    const logs = logger.getLogs();

    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      level: "info",
      message,
      data,
    });
  });

  it("logs warning messages", () => {
    const message = "Test warning message";
    logger.warn(message);
    const logs = logger.getLogs();

    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      level: "warn",
      message,
    });
  });

  it("logs error messages", () => {
    const message = "Test error message";
    const error = new Error("Test error");
    logger.error(message, error);
    const logs = logger.getLogs();

    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      level: "error",
      message,
      data: error,
    });
  });

  it("only logs debug messages in development", () => {
    const message = "Test debug message";
    const originalNodeEnv = process.env.NODE_ENV;

    // Test in development
    jest.replaceProperty(process.env, "NODE_ENV", "development");
    logger.debug(message);
    let logs = logger.getLogs();
    expect(logs).toHaveLength(1);

    // Clear logs
    logger.clearLogs();

    // Test in production
    jest.replaceProperty(process.env, "NODE_ENV", "production");
    logger.debug(message);
    logs = logger.getLogs();
    expect(logs).toHaveLength(0);

    // Restore original NODE_ENV
    jest.replaceProperty(process.env, "NODE_ENV", originalNodeEnv);
  });

  it("maintains max logs limit", () => {
    const maxLogs = 1000;
    const extraLogs = 10;

    // Add more logs than the limit
    for (let i = 0; i < maxLogs + extraLogs; i++) {
      logger.info(`Log ${i}`);
    }

    const logs = logger.getLogs();
    expect(logs).toHaveLength(maxLogs);
    // First log should be "Log 10" (the oldest logs were removed)
    expect(logs[0].message).toBe(`Log ${extraLogs}`);
  });

  it("clears logs", () => {
    logger.info("Test message");
    expect(logger.getLogs()).toHaveLength(1);

    logger.clearLogs();
    expect(logger.getLogs()).toHaveLength(0);
  });
});
