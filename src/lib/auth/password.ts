import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [scheme, salt, key] = passwordHash.split(":");

  if (scheme !== "scrypt" || !salt || !key) {
    return false;
  }

  const expectedKey = Buffer.from(key, "hex");
  const derivedKey = (await scrypt(password, salt, expectedKey.length)) as Buffer;

  return (
    expectedKey.length === derivedKey.length && timingSafeEqual(expectedKey, derivedKey)
  );
}
