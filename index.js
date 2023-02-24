import { exec } from "child_process";
import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import { default as mongoose, Schema } from "mongoose";
import setup from "./setup/setup.js";
import log from "./util/log.js";
import toEnv from "./util/toEnv.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/admin/config", (req, res) => {
  res.sendFile(path.join(process.cwd(), "config.html"));
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

app.get("/api/users", async (req, res, next) => {
  try {
    const Users = mongoose.model("users", new Schema({ name: String }));
    const users = await Users.find({}, { _id: 0 });
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

try {
  await setup();
  dotenv.config({ override: true });

  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
  await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  log("connected with mongo");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => log(`server running on port ${PORT}...`));
} catch (err) {
  log("error occured while starting the server");
  log(err.message.trim());
}
