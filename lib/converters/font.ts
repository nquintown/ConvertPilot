import { execFile } from "child_process";
import { promisify } from "util";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

const FONTFORGE_FORMATS: Set<string> = new Set([
  "TTF","OTF","WOFF","WOFF2","SFD","PFA","PFB","PS","CFF","AFM","BIN","DFONT",
]);

export async function convertFont(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<void> {
  const fontforgeBin = await checkBinary("fontforge");
  if (!fontforgeBin) {
    throw new Error("FontForge n'est pas installé. Installez-le avec: brew install fontforge");
  }

  const script = `import fontforge; f=fontforge.open("${inputPath}"); f.generate("${outputPath}")`;
  await execFileAsync(fontforgeBin, ["-lang=py", "-c", script]);
}

export function supportsFontConversion(sourceFormat: string, targetFormat: string): boolean {
  return (
    FONTFORGE_FORMATS.has(sourceFormat.toUpperCase()) &&
    FONTFORGE_FORMATS.has(targetFormat.toUpperCase())
  );
}
