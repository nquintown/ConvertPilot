import { execFile } from "child_process";
import { promisify } from "util";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

const CALIBRE_FORMATS: Set<string> = new Set([
  "AZW3","EPUB","FB2","LRF","MOBI","PDB","RB","SNB","TCR","PDF","DOCX","TXT","HTML","RTF",
]);

export async function convertEbook(
  inputPath: string,
  outputPath: string
): Promise<void> {
  const convertBin = await checkBinary("ebook-convert");
  if (!convertBin) {
    throw new Error(
      "Calibre n'est pas installé. Installez-le avec: brew install --cask calibre"
    );
  }

  await execFileAsync(convertBin, [inputPath, outputPath]);
}

export function supportsEbookConversion(sourceFormat: string, targetFormat: string): boolean {
  return (
    CALIBRE_FORMATS.has(sourceFormat.toUpperCase()) &&
    CALIBRE_FORMATS.has(targetFormat.toUpperCase())
  );
}
