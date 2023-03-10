import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import { Schema } from "mongoose";
import redisClient from "../util/redis.js";
import toEnv from "../util/toEnv.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    data: "biraj's server is working\n",
    variables: [process.env.DEVICE_IP, process.env.DB_USER],
  });
});

router.get("/admin/config", (req, res) => {
  res.sendFile(path.join(process.cwd(), "config.html"));
});

router.post("/admin/config", async (req, res) => {
  const env = dotenv.parse(await fs.readFile(".env", "utf-8"));
  for (const key in req.body) {
    env[key] = req.body[key];
  }

  await toEnv(env);
  res.json("{data: '.env file updated! server restarting'}");
});

router.get("/redis", async (req, res) => {
  try {
    const keys = await redisClient.keys();
    const data = [];
    for (const key of keys) {
      data.push({ [key]: await redisClient.get(key) });
    }

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/test", (req, res) => {
  res.json({ data: "test successful\n", variables: [process.env.DEVICE_IP] });
});

router.get("/users", async (req, res, next) => {
  try {
    const Users = mongoose.model("users", new Schema({ name: String }));
    const users = await Users.find({}, { _id: 0 });
    res.json({ data: users });
  } catch (err) {
    log(err);
    next(err);
  }
});

export default router;
