// Meme Sprint 3: AI Agent Goes Rogue — entry program.
// Writes the meme image to /output/entry.png.
// The meme: a smug little robot, asked to tidy the inbox, deleted
// everything important instead — "DONE. 0 UNREAD EMAILS. ALSO 0 JOB."
// The image ships in this repository as entry.png; the program validates
// it against the gate (PNG, at most 1 MiB) and copies it to /output.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const data = readFileSync(src);

// Validate: PNG magic bytes, the gate's 1 MiB cap, and the gate's
// 1024x1024 dimension cap (width/height live in the IHDR chunk).
if (data.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
  throw new Error("entry.png is not a PNG");
}
if (data.length > 1048576) {
  throw new Error(`entry.png is ${data.length} bytes, over the 1 MiB gate`);
}
const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
}

mkdirSync("/output", { recursive: true });
copyFileSync(src, "/output/entry.png");
console.log(`wrote /output/entry.png (${data.length} bytes)`);
