import { execFile } from "child_process";
import { promisify } from "util";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

export async function convertCad(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<void> {
  // Try ODAFileConverter (Open Design Alliance)
  const odaBin = await checkBinary("ODAFileConverter");
  if (odaBin) {
    const { dirname, basename, extname } = await import("path");
    const outDir = dirname(outputPath);
    const outFmt = targetFormat.toUpperCase();
    const inFmt = extname(inputPath).slice(1).toUpperCase();
    await execFileAsync(odaBin, [dirname(inputPath), outDir, inFmt, outFmt, "0", "1", basename(inputPath)]);
    return;
  }

  // Fallback: if converting DWG/DXF to SVG or PDF, try LibreOffice with draw
  const loBin = await findLibreOffice();
  if (loBin && ["SVG","PDF"].includes(targetFormat.toUpperCase())) {
    const { dirname } = await import("path");
    await execFileAsync(loBin, [
      "--headless",
      "--convert-to", targetFormat.toLowerCase(),
      "--outdir", dirname(outputPath),
      inputPath,
    ]);
    return;
  }

  throw new Error(
    "Aucun convertisseur CAD disponible. Installez ODAFileConverter (https://www.opendesign.com/guestfiles/oda_file_converter) ou LibreOffice pour SVG/PDF."
  );
}

async function findLibreOffice(): Promise<string | null> {
  const candidates = [
    "libreoffice",
    "soffice",
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
  ];
  for (const bin of candidates) {
    const found = await checkBinary(bin);
    if (found) return found;
  }
  return null;
}

export function supportsCadConversion(sourceFormat: string, targetFormat: string): boolean {
  const validSrc = new Set(["DWG","DXF","DWF","SVG"]);
  const validTgt = new Set(["DWG","DXF","SVG","PDF"]);
  return validSrc.has(sourceFormat.toUpperCase()) && validTgt.has(targetFormat.toUpperCase());
}
