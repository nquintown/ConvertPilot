import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

const LIBREOFFICE_INPUT_FORMATS: Set<string> = new Set([
  "DOC","DOCX","DOCM","DOT","DOTM","DOTX","ODT","RTF","TXT","HTML",
  "WPS","SXW","ABW","AW","KWD","DBK","XLS","XLSX","CSV","ODS","ODP",
  "PPT","PPTX","ODP","PDF",
]);

const LIBREOFFICE_OUTPUT_FORMATS: Set<string> = new Set([
  "PDF","DOC","DOCX","ODT","RTF","TXT","HTML","XLSX","CSV","ODS",
  "PPTX","ODP",
]);

export async function convertDocument(
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
  const generatedPath = path.join(outDir, `${inputBase}.${outFmt}`);

  if (generatedPath !== outputPath) {
    try {
      await fs.rename(generatedPath, outputPath);
    } catch {
      // file might already be at outputPath if names matched
    }
  }
}

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

export function supportsDocumentConversion(sourceFormat: string, targetFormat: string): boolean {
  return (
    LIBREOFFICE_INPUT_FORMATS.has(sourceFormat.toUpperCase()) &&
    LIBREOFFICE_OUTPUT_FORMATS.has(targetFormat.toUpperCase())
  );
}
