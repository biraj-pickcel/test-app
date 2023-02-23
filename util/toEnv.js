import fs from "node:fs/promises";

export default async function toEnv(env) {
  try {
    let newEnv = [];
    for (const key in env) {
      newEnv.push(`${key}=${env[key]}`);
    }

    return await fs.writeFile(".env", newEnv.join("\n"));
  } catch (err) {
    throw err;
  }
}
