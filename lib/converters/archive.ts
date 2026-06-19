import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

const SUPPORTED_EXTRACT: Set<string> = new Set([
  "7Z","ZIP","TAR","TGZ","TAR.GZ","TAR.BZ2","TBZ2","TAR.XZ","TAR.7Z",
  "RAR","CAB","ARJ","LHA","CPIO","RPM","DEB",
]);

const SUPPORTED_CREATE: Set<string> = new Set([
  "7Z","ZIP","TAR","TGZ","TAR.GZ","TAR.BZ2","TBZ2","TAR.XZ",
]);

export async function convertArchive(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<void> {
  const bin7z = await checkBinary("7z");
  if (!bin7z) {
    throw new Error("7-Zip n'est pas installé. Installez-le avec: brew install sevenzip");
  }

  const extractDir = path.join(os.tmpdir(), `cp_arch_${uuidv4()}`);
  await fs.mkdir(extractDir, { recursive: true });

  try {
    // Extract source archive
    await execFileAsync(bin7z, ["x", inputPath, `-o${extractDir}`, "-y"]);

    const entries = await fs.readdir(extractDir);
    const fmt = targetFormat.toUpperCase();

    if (fmt === "ZIP") {
      await execFileAsync(bin7z, ["a", "-tzip", outputPath, path.join(extractDir, "*")]);
    } else if (fmt === "7Z") {
      await execFileAsync(bin7z, ["a", "-t7z", outputPath, path.join(extractDir, "*")]);
    } else if (fmt === "TAR" || fmt === "TGZ" || fmt === "TAR.GZ") {
      const tarBin = await checkBinary("tar");
      if (!tarBin) throw new Error("tar n'est pas disponible");
      const flags = fmt === "TAR" ? "-cf" : "-czf";
      await execFileAsync(tarBin, [flags, outputPath, "-C", extractDir, ...entries]);
    } else if (fmt === "TAR.BZ2" || fmt === "TBZ2") {
      const tarBin = await checkBinary("tar");
      if (!tarBin) throw new Error("tar n'est pas disponible");
      await execFileAsync(tarBin, ["-cjf", outputPath, "-C", extractDir, ...entries]);
    } else if (fmt === "TAR.XZ") {
      const tarBin = await checkBinary("tar");
      if (!tarBin) throw new Error("tar n'est pas disponible");
      await execFileAsync(tarBin, ["-cJf", outputPath, "-C", extractDir, ...entries]);
    } else {
      await execFileAsync(bin7z, ["a", outputPath, path.join(extractDir, "*")]);
    }
  } finally {
    await fs.rm(extractDir, { recursive: true, force: true });
  }
}

export function supportsArchiveConversion(sourceFormat: string, targetFormat: string): boolean {
  return (
    SUPPORTED_EXTRACT.has(sourceFormat.toUpperCase()) &&
    SUPPORTED_CREATE.has(targetFormat.toUpperCase())
  );
}
