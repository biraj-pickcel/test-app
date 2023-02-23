import { exec } from "child_process";
import fs from "node:fs/promises";
import dotenv from "dotenv";
import toEnv from "../util/toEnv.js";

export default function setup() {
  return new Promise((resolve, reject) => {
    exec("./setup/get-ip.sh", async (err, stdout, stderr) => {
      try {
        if (err) {
          if (stderr) {
            err.message += stdout;
          }

          throw err;
        }

        const ip = stdout.trim();
        if ((await fs.readdir("./")).includes(".env")) {
          const env = dotenv.parse(await fs.readFile(".env", "utf-8"));
          env["DEVICE_IP"] = ip;
          await toEnv(env);
        } else {
          await fs.writeFile(
            ".env",
            `ABC=default
XYZ=default
DEVICE_IP=${ip}`
          );
        }

        if (stderr) {
          console.log("error:", stdout);
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}
