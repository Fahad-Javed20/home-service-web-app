import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SCRYPT_KEY_LENGTH = 64;

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const derivedHash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");

  const originalBuffer = Buffer.from(originalHash, "hex");
  const derivedBuffer = Buffer.from(derivedHash, "hex");

  if (originalBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(originalBuffer, derivedBuffer);
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function createTokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
