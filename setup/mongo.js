import { exec } from "node:child_process";
import fs from "node:fs/promises";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { parse, stringify } from "yaml";
import log from "../util/log.js";

export default async function mongoSetup() {
  dotenv.config();
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
  const client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  try {
    await client.connect();
    log("mongo-setup > connected to mongodb server");

    const db = client.db(DB_NAME);
    const existingUser = (await db.command({ usersInfo: { user: DB_USER, db: DB_NAME } })).users[0];
    if (existingUser) {
      log(`mongo-setup > user ${DB_USER} already exists in database ${DB_NAME}`);
      return;
    }

    // create mongodb user
    await db.addUser(DB_USER, DB_PASS, { roles: ["dbOwner"] });
    log(`mongo-setup > user ${DB_USER} has been created in db ${DB_NAME}`);

    // enable mongodb authorization
    const mongoConfYaml = await fs.readFile("/etc/mongod.conf", "utf8");
    const mongoConf = parse(mongoConfYaml);
    mongoConf.security = { authorization: "enabled" };
    await fs.writeFile("/etc/mongod.conf", stringify(mongoConf));

    // restart mongodb server
    exec("systemctl restart mongod.service", (err, stdout, stderr) => {
      if (err) {
        log(`mongo-setup > restart > ${err.message}`);
        return;
      }

      if (stdout) {
        log(`mongo-setup > restart > stdout: ${stdout}`);
      }

      if (stderr) {
        log(`mongo-setup > restart > stderr: ${stderr}`);
      }
    });
  } catch (err) {
    log(`mongo-setup > ${err.message}`);
  } finally {
    client.close();
  }
}
