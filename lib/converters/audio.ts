import { execFile } from "child_process";
import { promisify } from "util";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

const FFMPEG_AUDIO_FORMATS: Set<string> = new Set([
  "AAC","AC3","AIFF","AMR","APE","AU","FLAC","GSM","M4A","M4R","MP2","MP3",
  "OGA","OGG","OPUS","RA","SND","SPX","TTA","VOC","WAV","WMA",
]);

export async function convertAudio(inputPath: string, outputPath: string, targetFormat: string): Promise<void> {
  const ffmpegPath = await checkBinary("ffmpeg");
  if (!ffmpegPath) {
    throw new Error("ffmpeg n'est pas installé. Installez-le avec: brew install ffmpeg");
  }

  const fmt = targetFormat.toLowerCase();
  const args = ["-y", "-i", inputPath];

  if (fmt === "mp3") {
    args.push("-codec:a", "libmp3lame", "-q:a", "2");
  } else if (fmt === "aac" || fmt === "m4a") {
    args.push("-codec:a", "aac", "-b:a", "192k");
  } else if (fmt === "flac") {
    args.push("-codec:a", "flac");
  } else if (fmt === "ogg" || fmt === "oga") {
    args.push("-codec:a", "libvorbis", "-q:a", "4");
  } else if (fmt === "opus") {
    args.push("-codec:a", "libopus", "-b:a", "128k");
  } else if (fmt === "wav") {
    args.push("-codec:a", "pcm_s16le");
  } else if (fmt === "aiff") {
    args.push("-codec:a", "pcm_s16be");
  } else if (fmt === "ac3") {
    args.push("-codec:a", "ac3");
  } else if (fmt === "amr") {
    args.push("-codec:a", "libopencore_amrnb", "-ar", "8000", "-ac", "1");
  }

  args.push(outputPath);
  await execFileAsync(ffmpegPath, args);
}

export function supportsAudioConversion(targetFormat: string): boolean {
  return FFMPEG_AUDIO_FORMATS.has(targetFormat.toUpperCase());
}
