const { spawnSync } = require("node:child_process");

const env = {
  ...process.env,
  // Prisma 5.x can fail silently in some Windows SQLite schema-engine runs
  // unless engine logging is initialized. Keep setup deterministic for RC1.
  RUST_LOG: process.env.RUST_LOG || "debug",
};

const options = {
  stdio: "inherit",
  env,
};

const result =
  process.platform === "win32"
    ? spawnSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-ExecutionPolicy",
          "Bypass",
          "-Command",
          "$env:RUST_LOG='debug'; npx prisma db push --schema packages/database/prisma/schema.prisma",
        ],
        options,
      )
    : spawnSync(
        "npx",
        ["prisma", "db", "push", "--schema", "packages/database/prisma/schema.prisma"],
        options,
      );

process.exit(result.status ?? 1);
