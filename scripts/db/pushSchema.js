const { spawnSync } = require("node:child_process");

const env = {
  ...process.env,
  // Prisma 5.x can fail silently in some Windows SQLite schema-engine runs
  // unless engine logging is initialized. Keep setup deterministic for RC1.
  RUST_LOG: process.env.RUST_LOG || "debug",
};

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--schema", "packages/database/prisma/schema.prisma"],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: Object.fromEntries(
      Object.entries(env).filter((entry) => typeof entry[1] === "string"),
    ),
  },
);

process.exit(result.status ?? 1);
