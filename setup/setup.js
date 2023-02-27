import { exec } from "child_process";
import fs from "node:fs/promises";
import dotenv from "dotenv";
import log from "../util/log.js";
import toEnv from "../util/toEnv.js";

export default function setup() {
  return new Promise((resolve, reject) => {
    exec("ifconfig | grep -oP 'inet \\K[0-9.]+'", async (err, stdout, stderr) => {
      try {
        if (err) {
          if (stderr) {
            err.message += stdout;
          }

          throw err;
        }

        const ips = stdout
          .trim()
          .split("\n")
          .map((ip) => ip.trim());

        // assuming that we'll always get at least 1 ip
        const ip = ips.length > 1 ? ips.find((ip) => ip.startsWith("192.168.")) : ips[0];

        if ((await fs.readdir("./")).includes(".env")) {
          const env = dotenv.parse(await fs.readFile(".env", "utf-8"));
          env["DEVICE_IP"] = ip;
          await toEnv(env);
        } else {
          log("a .env file is required for setup");
          process.exit(1);
        }

        if (stderr) {
          log("setup() error:", stderr);
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}
