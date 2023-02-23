import fs from "node:fs/promises";
import path from "node:path";

export default function log() {
  const now = new Date();
  const str = `${now.toDateString()} ${now.toLocaleTimeString()}: ${Array.from(arguments).join(" ")}\n`;
  fs.appendFile(path.join(process.cwd(), "server.log"), str);
}
