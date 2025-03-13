import CryptoJS from "crypto-js";
import { TOKEN_ENCRYPTION_KEY } from "./config";

/**
 * Encrypts a given text using AES encryption.
 * @param text - The text to encrypt (e.g., refresh token).
 * @returns Encrypted string (Base64 format).
 * @throws Error if encryption fails.
 */
export function encrypt(text: string): string {
  try {
    if (!text) {
      throw new Error("Encryption failed: Input text is empty or undefined.");
    }
    return CryptoJS.AES.encrypt(text, TOKEN_ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed. See console for details.");
  }
}

/**
 * Decrypts an AES-encrypted string.
 * @param encryptedText - The encrypted string to decrypt.
 * @returns The decrypted original string.
 * @throws Error if decryption fails.
 */
export function decrypt(encryptedText: string): string {
  try {
    if (!encryptedText) {
      throw new Error("Decryption failed: Input is empty or undefined.");
    }

    const bytes = CryptoJS.AES.decrypt(encryptedText, TOKEN_ENCRYPTION_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed: Invalid ciphertext or wrong key.");
    }

    return decryptedText;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Decryption failed. See console for details.");
  }
}