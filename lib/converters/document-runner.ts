import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

async function findLibreOffice(): Promise<string | null> {
  const candidates = [
    "libreoffice",
    "soffice",
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    "/usr/bin/libreoffice",
    "/usr/lib/libreoffice/program/soffice",
  ];
  for (const bin of candidates) {
    const found = await checkBinary(bin);
    if (found) return found;
  }
  return null;
}

export async function runDocumentConversion(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<void> {
  const loBin = await findLibreOffice();
  if (!loBin) {
    throw new Error(
      "LibreOffice n'est pas installé. Installez-le avec: brew install --cask libreoffice"
    );
  }

  const outDir = path.dirname(outputPath);
  const outFmt = targetFormat.toLowerCase() === "docx" ? "docx" :
    targetFormat.toLowerCase() === "pdf" ? "pdf" :
    targetFormat.toLowerCase() === "txt" ? "txt" :
    targetFormat.toLowerCase() === "html" ? "html" :
    targetFormat.toLowerCase() === "odt" ? "odt" :
    targetFormat.toLowerCase() === "rtf" ? "rtf" :
    targetFormat.toLowerCase() === "xlsx" ? "xlsx" :
    targetFormat.toLowerCase() === "csv" ? "csv" :
    targetFormat.toLowerCase() === "ods" ? "ods" :
    targetFormat.toLowerCase() === "pptx" ? "pptx" :
    targetFormat.toLowerCase() === "odp" ? "odp" :
    targetFormat.toLowerCase();

  await execFileAsync(loBin, [
    "--headless",
    "--convert-to", outFmt,
    "--outdir", outDir,
    inputPath,
  ]);

  const inputBase = path.basename(inputPath, path.extname(inputPath));
  const generatedPath = path.join(outDir, inputBase + "." + outFmt);

  if (generatedPath !== outputPath) {
    try {
      await fs.rename(generatedPath, outputPath);
    } catch {
      // file might already be at outputPath if names matched
    }
  }
}
