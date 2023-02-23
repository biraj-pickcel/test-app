import { exec } from "child_process";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import setup from "./setup/setup.js";
import log from "./util/log.js";
import toEnv from "./util/toEnv.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/admin/config", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.post("/admin/config", async (req, res) => {
  const env = dotenv.parse(await fs.readFile(".env", "utf-8"));
  for (const key in req.body) {
    env[key] = req.body[key];
  }

  await toEnv(env);
  res.json("{data: '.env file updated! server restarting'}");
  exec("pm2 reload all", (err, stdout, stderr) => {
    if (err) {
      log(err);
      return;
    }

    if (stdout) {
      log(stdout);
    }

    if (stderr) {
      log(stderr);
    }
  });
});

app.get("/", (req, res) => {
  res.json({
    data: "biraj's server is working\n",
    variables: [process.env.DEVICE_IP, process.env.ABC, process.env.XYZ],
  });
});

app.get("/api/test", (req, res) => {
  res.json({ data: "test successful\n", variables: [process.env.DEVICE_IP, process.env.ABC, process.env.XYZ] });
});

try {
  await setup();
  dotenv.config({ override: true });
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => log(`server running on port ${PORT}...`));
} catch (err) {
  log("error(s) occured during setup");
  log(err.message.trim());
}
