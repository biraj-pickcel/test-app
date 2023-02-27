import fs from "node:fs";
import path from "node:path";

export default async function log() {
  const now = new Date();
  const str = `${now.toDateString()} ${now.toLocaleTimeString()}: ${Array.from(arguments).join(" ")}\n`;
  fs.appendFileSync(path.join(process.cwd(), "server.log"), str);
}
