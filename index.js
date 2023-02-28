import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import apiRouter from "./api/index.js";
import setup from "./setup/index.js";
import log from "./util/log.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

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
