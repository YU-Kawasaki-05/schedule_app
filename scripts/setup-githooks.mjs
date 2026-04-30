import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const hooksPath = ".githooks";

if (!existsSync(join(process.cwd(), ".git"))) {
  console.log("Git repository not found. Skipping hooks setup.");
  process.exit(0);
}

if (!existsSync(join(process.cwd(), hooksPath))) {
  console.error(`${hooksPath} directory not found.`);
  process.exit(1);
}

execFileSync("git", ["config", "core.hooksPath", hooksPath], {
  stdio: "inherit"
});

console.log(`Git hooks enabled from ${hooksPath}.`);

