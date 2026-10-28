#!/usr/bin/env node

import { startAgent, initPrompt } from "./agent/index.js";
import { Log } from "./basic/log.js";

// import { startCli } from "./cli.js";

// startCli(process.argv.slice(2));

// process.on("uncaughtException", (err) => {
//     console.error("Uncaught Exception:", err);
//     process.exit(1);
// });

// process.on("exit", () => {
//     console.log("Exiting the application.");
//     process.exit(0);
// })

// console.log(process.env.APP_NAME);

function initialize() {
  Log.initialize();
}

await initPrompt();
await startAgent();
