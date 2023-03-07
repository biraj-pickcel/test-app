import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => log("redis client error", err));

await client.connect();

await client.set("number", 1234);
await client.set("string", "hello world");

export default client;
