#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import process from "node:process";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import kebabCase from "lodash.kebabcase";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ROOT = path.resolve(__dirname, "..");
const BLOG_RELATIVE_PATH = path.join("src", "data", "blog");

function log(message = "") {
  process.stdout.write(`${message}\n`);
}

function logError(message = "") {
  process.stderr.write(`${message}\n`);
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

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    const text = `${command} ${args.join(" ")}`;
    throw new Error(`Command failed: ${text}`);
  }
}

function runCapture(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    shell: false,
  });
  return {
    status: result.status ?? 1,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
  };
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

    if (token.startsWith("-") && token.length === 2) {
      const key = token.slice(1);
      const next = argv[i + 1];
      if (next && !next.startsWith("-")) {
        parsed[key] = next;
        i += 1;
      } else {
        parsed[key] = true;
      }
      continue;
    }

    parsed._.push(token);
  }

  return parsed;
}

function option(args, longKey, shortKey, fallback = undefined) {
  if (Object.hasOwn(args, longKey)) return args[longKey];
  if (shortKey && Object.hasOwn(args, shortKey)) return args[shortKey];
  return fallback;
}

function boolOption(args, longKey, shortKey, fallback) {
  const value = option(args, longKey, shortKey, fallback);
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (["1", "true", "yes", "y"].includes(normalized)) return true;
    if (["0", "false", "no", "n"].includes(normalized)) return false;
  }
  return Boolean(value);
}

function strOption(args, longKey, shortKey, fallback = "") {
  const value = option(args, longKey, shortKey, fallback);
  return String(value ?? fallback).trim();
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatLocalDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatLocalDatetimeWithOffset(date) {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hour = pad2(date.getHours());
  const minute = pad2(date.getMinutes());
  const second = pad2(date.getSeconds());

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHour = pad2(Math.floor(absOffset / 60));
  const offsetMinute = pad2(absOffset % 60);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
}

function escapeYamlString(text) {
  return text.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function sanitizeTag(tag) {
  return tag.trim();
}

function toSlug(title, fallbackDate) {
  const value = kebabCase(title).trim().replace(/^-+|-+$/g, "");
  if (value) return value;
  return `post-${fallbackDate.replaceAll("-", "")}-${Date.now()}`;
}

function uniqueFilePath(basePath, extension = ".md") {
  if (!existsSync(`${basePath}${extension}`)) return `${basePath}${extension}`;
  let count = 2;
  while (existsSync(`${basePath}-${count}${extension}`)) {
    count += 1;
  }
  return `${basePath}-${count}${extension}`;
}

async function ask(question, defaultValue = "") {
  const rl = readline.createInterface({ input, output });
  const suffix = defaultValue ? ` (${defaultValue})` : "";
  const response = (await rl.question(`${question}${suffix}: `)).trim();
  rl.close();
  return response || defaultValue;
}

function openEditorIfPossible(filePath, cwd) {
  const editor = process.env.EDITOR;
  if (editor) {
    const result = spawnSync(`${editor} "${filePath}"`, {
      cwd,
      stdio: "inherit",
      shell: true,
    });
    if (result.status !== 0) {
      throw new Error(`Failed to open file with EDITOR="${editor}".`);
    }
    return;
  }

  const hasCode = runCapture("which", ["code"], cwd).status === 0;
  if (hasCode) {
    run("code", [filePath], cwd);
    return;
  }

  if (process.platform === "darwin") {
    run("open", [filePath], cwd);
  }
}

async function commandNew(args, root) {
  const blogDir = path.join(root, BLOG_RELATIVE_PATH);
  mkdirSync(blogDir, { recursive: true });

  let title = strOption(args, "title", "t");
  if (!title) title = await ask("Post title");
  if (!title) throw new Error("Title is required.");

  const descriptionDefault = `${title}.`;
  let description = strOption(args, "description", "d", descriptionDefault);
  if (!description) {
    description = await ask("Description", descriptionDefault);
  }

  const now = new Date();
  const datePrefix = formatLocalDate(now);
  const datetime = formatLocalDatetimeWithOffset(now);
  const slug = toSlug(title, datePrefix);

  const tagsInput = strOption(args, "tags", "g", "blog");
  const tags = tagsInput
    .split(",")
    .map(sanitizeTag)
    .filter(Boolean);
  const draft = boolOption(args, "draft", null, false);
  const featured = boolOption(args, "featured", null, false);
  const autoOpen = boolOption(args, "open", "o", true);

  const basePath = path.join(blogDir, `${datePrefix}-${slug}`);
  const targetPath = uniqueFilePath(basePath);
  const yamlTags = tags
    .map(tag => `"${escapeYamlString(tag)}"`)
    .join(", ");

  const content = [
    "---",
    `title: "${escapeYamlString(title)}"`,
    `description: "${escapeYamlString(description)}"`,
    `pubDatetime: ${datetime}`,
    `tags: [${yamlTags}]`,
    `draft: ${draft}`,
    `featured: ${featured}`,
    "---",
    "",
    "Write your post here.",
    "",
    "## Key points",
    "",
    "- point 1",
    "",
  ].join("\n");

  writeFileSync(targetPath, content, "utf8");
  log(`Created: ${targetPath}`);

  if (autoOpen) {
    openEditorIfPossible(targetPath, root);
  }
}

function defaultCommitMessage() {
  const now = new Date();
  return `chore(blog): publish ${formatLocalDate(now)} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
}

function ensureGitRepo(root) {
  const result = runCapture("git", ["rev-parse", "--is-inside-work-tree"], root);
  if (result.status !== 0 || result.stdout !== "true") {
    throw new Error("Current directory is not a git repository.");
  }
}

function hasStagedChanges(root) {
  const result = runCapture("git", ["diff", "--cached", "--quiet"], root);
  return result.status !== 0;
}

function currentBranch(root) {
  const result = runCapture("git", ["rev-parse", "--abbrev-ref", "HEAD"], root);
  if (result.status !== 0 || !result.stdout) {
    throw new Error("Cannot detect current git branch.");
  }
  return result.stdout;
}

function commandPublish(args, root) {
  ensureGitRepo(root);

  const withBuild = boolOption(args, "build", null, true);
  const branch = strOption(args, "branch", "b", "main");
  const message = strOption(args, "message", "m", defaultCommitMessage());

  if (withBuild) {
    run("corepack", ["pnpm", "run", "build"], root);
  }

  run("git", ["add", "-A"], root);

  if (!hasStagedChanges(root)) {
    log("No changes to publish.");
    return;
  }

  run("git", ["commit", "-m", message], root);

  const sourceBranch = currentBranch(root);
  if (sourceBranch === branch) {
    run("git", ["push", "origin", branch], root);
  } else {
    run("git", ["push", "origin", `${sourceBranch}:${branch}`], root);
  }

  log(
    `Published from "${sourceBranch}" to "${branch}". GitHub Actions will deploy automatically.`
  );
}

function printHelp() {
  const help = `
Usage:
  node scripts/blog.mjs <command> [options]

Commands:
  new        Create a new markdown post template
  publish    Build + commit + push to trigger GitHub Pages deploy

new options:
  --title, -t         Post title
  --description, -d   Post description
  --tags, -g          Comma separated tags (default: blog)
  --draft             Mark as draft (default: false)
  --featured          Mark as featured (default: false)
  --no-open           Do not open editor after creating the file

publish options:
  --message, -m       Commit message
  --branch, -b        Target remote branch (default: main)
  --no-build          Skip build before publish

Examples:
  node scripts/blog.mjs new -t "My first post" -g "frontend,astro"
  node scripts/blog.mjs publish -m "feat(blog): add post about Astro"
`.trim();
  log(help);
}

async function main() {
  const root = resolveRoot();
  const [command = "help", ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (["help", "--help", "-h"].includes(command)) {
    printHelp();
    return;
  }

  if (command === "new") {
    await commandNew(args, root);
    return;
  }

  if (command === "publish") {
    commandPublish(args, root);
    return;
  }

  printHelp();
  process.exitCode = 1;
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  logError(`Error: ${message}`);
  process.exit(1);
});
