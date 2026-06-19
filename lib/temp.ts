import fs from "fs/promises";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

const TMP_DIR = path.join(os.tmpdir(), "convertpilot");

export async function ensureTmpDir(): Promise<string> {
  await fs.mkdir(TMP_DIR, { recursive: true });
  return TMP_DIR;
}

export async function createTempPath(ext: string): Promise<string> {
  await ensureTmpDir();
  return path.join(TMP_DIR, `${uuidv4()}.${ext.toLowerCase().replace(/^\./, "")}`);
}

export async function saveTempFile(buffer: Buffer, ext: string): Promise<string> {
  const filePath = await createTempPath(ext);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

export async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore
  }
}

export async function cleanupOldFiles(maxAgeMs = 30 * 60 * 1000): Promise<void> {
  try {
    const dir = await ensureTmpDir();
    const entries = await fs.readdir(dir);
    const now = Date.now();
    await Promise.all(
      entries.map(async (name) => {
        const fp = path.join(dir, name);
        const stat = await fs.stat(fp).catch(() => null);
        if (stat && now - stat.mtimeMs > maxAgeMs) {
          await fs.unlink(fp).catch(() => null);
        }
      })
    );
  } catch {
    // ignore
  }
}

export function getTmpDir(): string {
  return TMP_DIR;
}
