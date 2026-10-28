// Tiny web server for the built site (folder "dist"). No extra packages needed.
// Render sets PORT automatically. /healthz is used by Render's health check.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("./dist", import.meta.url)));
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  if (urlPath === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok");
  }

  // Resolve the file safely inside dist; unknown paths fall back to index.html.
  let file = join(ROOT, normalize(urlPath));
  if (!file.startsWith(ROOT)) file = join(ROOT, "index.html");
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
  } catch {
    file = join(ROOT, "index.html");
  }

  try {
    const body = await readFile(file);
    const ext = extname(file);
    res.writeHead(200, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": file.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(body);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Site not built yet. Run: npm run build");
  }
}).listen(PORT, "0.0.0.0", () => console.log(`ADD site running on port ${PORT}`));
