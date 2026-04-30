import "server-only";
import { createHash, randomBytes } from "crypto";

const slugAlphabet =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function createPublicSlug(length = 10) {
  const bytes = randomBytes(length);
  return Array.from(bytes)
    .map((byte) => slugAlphabet[byte % slugAlphabet.length])
    .join("");
}

export function createEditToken() {
  return randomBytes(32).toString("base64url");
}

export function hashEditToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

