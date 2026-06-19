import type { Category } from "@/types";
import { convertImage, supportsImageConversion } from "./image";
import { convertAudio, supportsAudioConversion } from "./audio";
import { convertVideo, supportsVideoConversion } from "./video";
import { convertDocument, supportsDocumentConversion } from "./document";
import { convertEbook, supportsEbookConversion } from "./ebook";
import { convertArchive, supportsArchiveConversion } from "./archive";
import { convertFont, supportsFontConversion } from "./font";
import { convertVector, supportsVectorConversion } from "./vector";
import { convertCad, supportsCadConversion } from "./cad";

export async function convert(
  category: Category,
  inputPath: string,
  outputPath: string,
  sourceFormat: string,
  targetFormat: string
): Promise<void> {
  switch (category) {
    case "image":
      if (!supportsImageConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion image ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertImage(inputPath, outputPath, targetFormat);
      break;

    case "audio":
      if (!supportsAudioConversion(targetFormat)) {
        throw new Error(`Format audio cible ${targetFormat} non supporté`);
      }
      await convertAudio(inputPath, outputPath, targetFormat);
      break;

    case "video":
      if (!supportsVideoConversion(targetFormat)) {
        throw new Error(`Format vidéo cible ${targetFormat} non supporté`);
      }
      await convertVideo(inputPath, outputPath, targetFormat);
      break;

    case "document":
      if (!supportsDocumentConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion document ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertDocument(inputPath, outputPath, targetFormat);
      break;

    case "ebook":
      if (!supportsEbookConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion ebook ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertEbook(inputPath, outputPath);
      break;

    case "presentation":
      if (!supportsDocumentConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion présentation ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertDocument(inputPath, outputPath, targetFormat);
      break;

    case "archive":
      if (!supportsArchiveConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion archive ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertArchive(inputPath, outputPath, targetFormat);
      break;

    case "font":
      if (!supportsFontConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion police ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertFont(inputPath, outputPath, targetFormat);
      break;

    case "vector":
      if (!supportsVectorConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion vecteur ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertVector(inputPath, outputPath, targetFormat);
      break;

    case "cad":
      if (!supportsCadConversion(sourceFormat, targetFormat)) {
        throw new Error(`Conversion CAD ${sourceFormat} → ${targetFormat} non supportée`);
      }
      await convertCad(inputPath, outputPath, targetFormat);
      break;

    default:
      throw new Error(`Catégorie inconnue: ${category}`);
  }
}
