#!/usr/bin/env node

import { startCli } from "./cli.js";

startCli(process.argv.slice(2));

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on("exit", () => {
    console.log("Exiting the application.");
    process.exit(0);
})