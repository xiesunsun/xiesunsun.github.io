#!/usr/bin/env node

import http from "node:http";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ROOT = path.resolve(__dirname, "..");
const BLOG_RELATIVE_PATH = path.join("src", "data", "blog");
const BLOG_SCRIPT_RELATIVE_PATH = path.join("scripts", "blog.mjs");

function log(message = "") {
  process.stdout.write(`${message}\n`);
}

function logError(message = "") {
  process.stderr.write(`${message}\n`);
}

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token) continue;

    if (token.startsWith("--no-")) {
      parsed[token.slice(5)] = false;
      continue;
    }

    if (token.startsWith("--")) {
      const raw = token.slice(2);
      const eqIndex = raw.indexOf("=");
      if (eqIndex !== -1) {
        parsed[raw.slice(0, eqIndex)] = raw.slice(eqIndex + 1);
        continue;
      }
      const next = argv[i + 1];
      if (next && !next.startsWith("-")) {
        parsed[raw] = next;
        i += 1;
      } else {
        parsed[raw] = true;
      }
      continue;
    }

    parsed._.push(token);
  }

  return parsed;
}

function resolveRoot() {
  const cwdRoot = path.resolve(process.cwd());
  const cwdBlogPath = path.join(cwdRoot, BLOG_RELATIVE_PATH);
  if (existsSync(cwdBlogPath)) return cwdRoot;

  const fallbackBlogPath = path.join(DEFAULT_ROOT, BLOG_RELATIVE_PATH);
  if (existsSync(fallbackBlogPath)) return DEFAULT_ROOT;

  throw new Error(
    `Cannot find "${BLOG_RELATIVE_PATH}". Run this command in the repo root.`
  );
}

function toBool(value, defaultValue = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (["1", "true", "yes", "y"].includes(normalized)) return true;
    if (["0", "false", "no", "n"].includes(normalized)) return false;
  }
  return defaultValue;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function sendHtml(res, html) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(html),
  });
  res.end(html);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error("Payload too large."));
      }
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

function runBlogScript(root, args) {
  const scriptPath = path.join(root, BLOG_SCRIPT_RELATIVE_PATH);
  if (!existsSync(scriptPath)) {
    return {
      ok: false,
      output: `Missing script: ${scriptPath}`,
      status: 1,
    };
  }

  const result = spawnSync("node", [scriptPath, ...args], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    shell: false,
  });

  const output = [result.stdout, result.stderr].filter(Boolean).join("").trim();
  return {
    ok: result.status === 0,
    output,
    status: result.status ?? 1,
  };
}

function extractCreatedFilePath(output) {
  const match = output.match(/Created:\s*(.+)/);
  return match?.[1]?.trim() ?? "";
}

function tryOpenBrowser(url) {
  const platform = process.platform;
  if (platform === "darwin") {
    spawnSync("open", [url], { stdio: "ignore", shell: false });
  } else if (platform === "linux") {
    spawnSync("xdg-open", [url], { stdio: "ignore", shell: false });
  } else if (platform === "win32") {
    spawnSync("cmd", ["/c", "start", "", url], { stdio: "ignore", shell: false });
  }
}

function pageHtml() {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blog Control Panel</title>
    <style>
      :root {
        --bg: #f3f6f9;
        --card: #ffffff;
        --border: #dbe3ee;
        --text: #0f1a2a;
        --muted: #5f6e85;
        --primary: #1459c7;
        --primary-hover: #0f49a3;
        --danger: #a31f3b;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: "SF Pro Text", "PingFang SC", "Noto Sans CJK SC", sans-serif;
        background: linear-gradient(130deg, #eef3fb 0%, #f8f9fc 50%, #edf7f2 100%);
        color: var(--text);
      }
      .wrap {
        width: min(960px, calc(100% - 32px));
        margin: 28px auto 40px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 28px;
      }
      .subtitle {
        margin: 0 0 24px;
        color: var(--muted);
      }
      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 16px;
        box-shadow: 0 6px 16px rgba(26, 40, 66, 0.06);
      }
      .card h2 {
        margin: 0 0 14px;
        font-size: 20px;
      }
      .field {
        margin-bottom: 12px;
      }
      label {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        color: var(--muted);
      }
      input[type="text"] {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
      }
      .check-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 14px;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--muted);
        font-size: 14px;
      }
      .btn-row {
        display: flex;
        gap: 10px;
      }
      button {
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 14px;
        cursor: pointer;
      }
      button.primary {
        background: var(--primary);
        color: #fff;
      }
      button.primary:hover {
        background: var(--primary-hover);
      }
      button.danger {
        background: var(--danger);
        color: #fff;
      }
      .hint {
        margin-top: 12px;
        color: var(--muted);
        font-size: 13px;
      }
      .output {
        margin-top: 16px;
        background: #0f1724;
        color: #dde7fa;
        border-radius: 12px;
        padding: 12px;
        min-height: 150px;
        white-space: pre-wrap;
        font-family: "Google Sans Code", "SFMono-Regular", Menlo, monospace;
        font-size: 12px;
        line-height: 1.45;
      }
      .tag {
        display: inline-block;
        margin-left: 8px;
        padding: 2px 8px;
        border-radius: 999px;
        border: 1px solid var(--border);
        color: var(--muted);
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <h1>博客操作面板 <span class="tag">No Preview</span></h1>
      <p class="subtitle">在这里新建文章、直接发布到 GitHub Pages（通过 GitHub Action）。</p>

      <section class="grid">
        <form class="card" id="new-post-form">
          <h2>新建文章</h2>
          <div class="field">
            <label for="title">标题 *</label>
            <input id="title" name="title" type="text" required placeholder="例如：Astro 自动化工作流" />
          </div>
          <div class="field">
            <label for="description">描述</label>
            <input id="description" name="description" type="text" placeholder="一句话概述文章内容" />
          </div>
          <div class="field">
            <label for="tags">标签（英文逗号分隔）</label>
            <input id="tags" name="tags" type="text" value="blog" placeholder="frontend, astro, ai" />
          </div>
          <div class="check-row">
            <label class="check"><input id="draft" name="draft" type="checkbox" />草稿</label>
            <label class="check"><input id="featured" name="featured" type="checkbox" />精选</label>
          </div>
          <div class="btn-row">
            <button class="primary" type="submit">创建文章</button>
          </div>
          <p class="hint">创建后会生成 Markdown 文件，不会启动预览。</p>
        </form>

        <form class="card" id="publish-form">
          <h2>发布博客</h2>
          <div class="field">
            <label for="message">Commit Message</label>
            <input id="message" name="message" type="text" placeholder="feat(blog): add new post" />
          </div>
          <div class="check-row">
            <label class="check"><input id="skipBuild" name="skipBuild" type="checkbox" />跳过本地 build</label>
          </div>
          <div class="btn-row">
            <button class="danger" type="submit">立即发布</button>
          </div>
          <p class="hint">会执行 build + commit + push 到 main，随后 GitHub Action 自动部署。</p>
        </form>
      </section>

      <pre class="output" id="output">等待操作...</pre>
    </main>

    <script>
      const outputEl = document.getElementById("output");

      function setOutput(title, content) {
        outputEl.textContent = "[" + new Date().toLocaleString() + "] " + title + "\\n\\n" + content;
      }

      async function request(url, payload) {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Request failed");
        }
        return data;
      }

      document.getElementById("new-post-form").addEventListener("submit", async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const payload = {
          title: form.title.value.trim(),
          description: form.description.value.trim(),
          tags: form.tags.value.trim(),
          draft: form.draft.checked,
          featured: form.featured.checked,
        };
        if (!payload.title) {
          setOutput("新建失败", "标题不能为空。");
          return;
        }
        setOutput("处理中", "正在创建文章...");
        try {
          const data = await request("/api/new", payload);
          const fileLine = data.filePath ? "\\n\\n文件: " + data.filePath : "";
          setOutput("新建成功", (data.output || "完成") + fileLine);
          form.reset();
          form.tags.value = "blog";
        } catch (error) {
          setOutput("新建失败", String(error.message || error));
        }
      });

      document.getElementById("publish-form").addEventListener("submit", async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const payload = {
          message: form.message.value.trim(),
          skipBuild: form.skipBuild.checked,
        };
        setOutput("处理中", "正在发布，请稍候...");
        try {
          const data = await request("/api/publish", payload);
          setOutput("发布完成", data.output || "完成");
        } catch (error) {
          setOutput("发布失败", String(error.message || error));
        }
      });
    </script>
  </body>
</html>`;
}

function printHelp() {
  log(`Usage:
  node scripts/blog-ui.mjs [options]

Options:
  --port <number>   Server port (default: 4317)
  --no-open         Do not auto-open browser
  --help            Show this message`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const root = resolveRoot();
  const portRaw = Number(args.port ?? 4317);
  if (!Number.isInteger(portRaw) || portRaw < 1 || portRaw > 65535) {
    throw new Error("Port must be an integer between 1 and 65535.");
  }
  const port = portRaw;
  const shouldOpen = toBool(args.open, true);
  const html = pageHtml();

  const server = http.createServer(async (req, res) => {
    const method = req.method ?? "GET";
    const url = req.url ?? "/";

    try {
      if (method === "GET" && (url === "/" || url === "/index.html")) {
        sendHtml(res, html);
        return;
      }

      if (method === "POST" && url === "/api/new") {
        const body = await parseJsonBody(req);
        const title = String(body.title ?? "").trim();
        const description = String(body.description ?? "").trim();
        const tags = String(body.tags ?? "blog").trim() || "blog";

        if (!title) {
          sendJson(res, 400, { error: "title is required." });
          return;
        }

        const commandArgs = ["new", "--no-open", "-t", title, "-g", tags];
        if (description) commandArgs.push("-d", description);
        if (body.draft) commandArgs.push("--draft");
        if (body.featured) commandArgs.push("--featured");

        const result = runBlogScript(root, commandArgs);
        if (!result.ok) {
          sendJson(res, 500, {
            error: "Failed to create post.",
            output: result.output,
          });
          return;
        }

        sendJson(res, 200, {
          ok: true,
          output: result.output,
          filePath: extractCreatedFilePath(result.output),
        });
        return;
      }

      if (method === "POST" && url === "/api/publish") {
        const body = await parseJsonBody(req);
        const message = String(body.message ?? "").trim();
        const skipBuild = Boolean(body.skipBuild);

        const commandArgs = ["publish"];
        if (message) commandArgs.push("-m", message);
        if (skipBuild) commandArgs.push("--no-build");

        const result = runBlogScript(root, commandArgs);
        if (!result.ok) {
          sendJson(res, 500, {
            error: "Failed to publish.",
            output: result.output,
          });
          return;
        }

        sendJson(res, 200, {
          ok: true,
          output: result.output,
        });
        return;
      }

      sendJson(res, 404, { error: "Not found." });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 500, { error: message });
    }
  });

  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}`;
    log(`Blog UI is running at ${url}`);
    log("Press Ctrl+C to stop.");
    if (shouldOpen) {
      tryOpenBrowser(url);
    }
  });

  const shutdown = () => {
    server.close(() => {
      log("Blog UI stopped.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  logError(`Error: ${message}`);
  process.exit(1);
}
