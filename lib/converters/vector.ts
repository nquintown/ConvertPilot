import { execFile } from "child_process";
import { promisify } from "util";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

const INKSCAPE_FORMATS: Set<string> = new Set([
  "SVG","EPS","PDF","PS","EMF","WMF","PNG","AI",
]);

export async function convertVector(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<void> {
  const inkscapeBin = await checkBinary("inkscape");
  if (!inkscapeBin) {
    throw new Error("Inkscape n'est pas installé. Installez-le avec: brew install --cask inkscape");
  }

  const fmt = targetFormat.toLowerCase();
  const args: string[] = [inputPath];

  if (fmt === "svg") {
    args.push("--export-filename", outputPath, "--export-type=svg");
  } else if (fmt === "pdf") {
    args.push("--export-filename", outputPath, "--export-type=pdf");
  } else if (fmt === "eps") {
    args.push("--export-filename", outputPath, "--export-type=eps");
  } else if (fmt === "png") {
    args.push("--export-filename", outputPath, "--export-type=png", "--export-dpi=150");
  } else if (fmt === "emf") {
    args.push("--export-filename", outputPath, "--export-type=emf");
  } else if (fmt === "wmf") {
    args.push("--export-filename", outputPath, "--export-type=wmf");
  } else {
    args.push("--export-filename", outputPath);
  }

  await execFileAsync(inkscapeBin, args);
}

export function supportsVectorConversion(sourceFormat: string, targetFormat: string): boolean {
  return (
    INKSCAPE_FORMATS.has(sourceFormat.toUpperCase()) &&
    INKSCAPE_FORMATS.has(targetFormat.toUpperCase())
  );
}
