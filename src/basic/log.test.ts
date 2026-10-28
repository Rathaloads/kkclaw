import { describe, it } from "vitest";
import { Log } from "./log.js";

describe("log", () => {
  it("should log a message", () => {
    Log.initialize();
    Log.info("Hello, world! info");
    Log.warn("Hello, world! warn");
    Log.error("Hello, world! error");
    Log.debug("Hello, world! debug", { data: "test" });
    Log.warn("Hello, world! warn", { data: "test" });
    Log.error("Hello, world! error", { data: "test" });
    Log.debug("Hello, world! debug", { data: "test" });
    Log.warn("Hello, world! warn", { data: "test" });
    Log.error("Hello, world! error", { data: "test" });
    Log.debug("Hello, world! debug", { data: "test" });
    Log.warn("Hello, world! warn", { data: "test" });
    Log.error("Hello, world! error", { data: "test" });
  });
});
