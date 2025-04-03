import { convertIv, convertKey, loadFile } from "./utils";
import { Encryption } from "../src/encryption";
import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";

describe("Encryption", () => {
  let encryption: Encryption;

  beforeAll(() => {
    const key = convertKey("Advent Of Craft");
    const iv = convertIv("2024");
    encryption = new Encryption(key, iv);
  });

  test("should encrypt a known string and match the expected Base64 result", () => {
    expect(encryption.encrypt("Unlock Your Potential with the Advent Of Craft Calendar!")).toBe(
      "L7wht/YddOoTvYvrc+wFcZhtXNvZ2cHFxq9ND27h1Ovv/aWLxN8lWv1xMsguM/R4Yodk3rn9cppI+YarggtPjA=="
    );
  });

  // It is a Property-Based test that checks the below property
  // I'm pretty sure we will talk about this concept during our Journey 🎅
  test("for all x (x: valid string) -> decrypt(encrypt(x)) == x", () => {
    fc.assert(
      fc.property(fc.string(), (originalText: string) => {
        return encryption.decrypt(encryption.encrypt(originalText)) === originalText;
      })
    );
  });

  test("should decrypt an encrypted string", () => {
    const originalText = "This is original Text!!";
    const encrypted = encryption.encrypt(originalText);

    const decrypted = encryption.decrypt(encrypted);

    expect(decrypted).toBe(originalText);
  });

  test("should decrypt an encrypted email", () => {
    const resourcesDir = path.resolve(__dirname, "resources");
    const encryptedFilePath = path.join(resourcesDir, "EncryptedEmail.txt");
    const decryptedFilePath = path.join(resourcesDir, "DecryptedEmail.txt");

    if (!fs.existsSync(resourcesDir)) {
      fs.mkdirSync(resourcesDir, { recursive: true });
    }

    const encryptedEmail = loadFile(encryptedFilePath);
    const result = encryption.decrypt(encryptedEmail);

    try {
      fs.writeFileSync(decryptedFilePath, result);

      const decryptedEmail = loadFile(decryptedFilePath);

      expect(decryptedEmail).toBe(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
