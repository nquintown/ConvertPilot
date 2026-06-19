import path from "path";

const SHARP_FORMATS: Record<string, string> = {
  JPEG: "jpeg", JPG: "jpeg", JPE: "jpeg", JFIF: "jpeg", JFI: "jpeg", JIF: "jpeg",
  PNG: "png",
  WEBP: "webp",
  AVIF: "avif",
  TIFF: "tiff",
  GIF: "gif",
  BMP: "bmp",
  ICO: "ico",
  HEIF: "heif", HEIC: "heif",
  SVG: "svg",
  JP2: "jp2",
  TGA: "tga",
  RAW: "raw",
};

export async function convertImage(inputPath: string, outputPath: string, targetFormat: string): Promise<void> {
  let sharp: typeof import("sharp");
  try {
    sharp = (await import("sharp")).default as unknown as typeof import("sharp");
  } catch {
    throw new Error("sharp n'est pas disponible. Installez-le avec: pnpm add sharp");
  }

  const fmt = SHARP_FORMATS[targetFormat.toUpperCase()];
  if (!fmt) {
    throw new Error(`Format image non supporté par sharp: ${targetFormat}`);
  }

  const ext = path.extname(outputPath).slice(1).toLowerCase();

  let pipeline = (sharp as unknown as (p: string) => import("sharp").Sharp)(inputPath);

  switch (fmt) {
    case "jpeg":
      pipeline = pipeline.jpeg({ quality: 90 });
      break;
    case "png":
      pipeline = pipeline.png({ compressionLevel: 6 });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality: 85 });
      break;
    case "avif":
      pipeline = pipeline.avif({ quality: 80 });
      break;
    case "tiff":
      pipeline = pipeline.tiff({ quality: 90 });
      break;
    case "gif":
      pipeline = pipeline.gif();
      break;
    case "bmp":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pipeline = (pipeline as any).bmp();
      break;
    case "ico":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pipeline = (pipeline as any).ico();
      break;
    case "heif":
      pipeline = pipeline.heif({ quality: 80 });
      break;
    case "jp2":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pipeline = (pipeline as any).jp2({ quality: 80 });
      break;
    default:
      // use toFormat generically
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pipeline = pipeline.toFormat(fmt as any);
  }

  await pipeline.toFile(outputPath);
}

export function supportsImageConversion(sourceFormat: string, targetFormat: string): boolean {
  const src = SHARP_FORMATS[sourceFormat.toUpperCase()];
  const tgt = SHARP_FORMATS[targetFormat.toUpperCase()];
  return !!src && !!tgt;
}
