import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

const client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

try {
  await client.connect();
  console.log("Connected successfully to server");

  const db = client.db(DB_NAME);

  const existingUser = (await db.command({ usersInfo: { user: DB_USER, db: DB_NAME } })).users[0];
  if (existingUser) {
    console.log(`user ${DB_USER} already exists in database ${DB_NAME}`);
  } else {
    await db.addUser(DB_USER, DB_PASS, { roles: ["readWrite"] });
    console.log(`User ${DB_USER} has been created in ${DB_NAME}`);
  }
} catch (err) {
  console.error(err);
} finally {
  client.close();
}
