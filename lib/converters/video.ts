import { execFile } from "child_process";
import { promisify } from "util";
import { checkBinary } from "./utils";

const execFileAsync = promisify(execFile);

const FFMPEG_VIDEO_FORMATS: Set<string> = new Set([
  "3G2","3GP","AVI","FLV","M4V","MKV","MOV","MP4","MPEG","MPG","OGV",
  "RM","TS","WEBM","WMV","GIF",
]);

export async function convertVideo(inputPath: string, outputPath: string, targetFormat: string): Promise<void> {
  const ffmpegPath = await checkBinary("ffmpeg");
  if (!ffmpegPath) {
    throw new Error("ffmpeg n'est pas installé. Installez-le avec: brew install ffmpeg");
  }

  const fmt = targetFormat.toLowerCase();
  const args = ["-y", "-i", inputPath];

  if (fmt === "mp4") {
    args.push("-codec:v", "libx264", "-crf", "23", "-preset", "medium");
    args.push("-codec:a", "aac", "-b:a", "128k");
  } else if (fmt === "webm") {
    args.push("-codec:v", "libvpx-vp9", "-crf", "30", "-b:v", "0");
    args.push("-codec:a", "libopus");
  } else if (fmt === "avi") {
    args.push("-codec:v", "mpeg4", "-vtag", "xvid");
    args.push("-codec:a", "mp3");
  } else if (fmt === "mov") {
    args.push("-codec:v", "libx264", "-crf", "23");
    args.push("-codec:a", "aac");
  } else if (fmt === "mkv") {
    args.push("-codec:v", "libx264", "-crf", "23");
    args.push("-codec:a", "aac");
  } else if (fmt === "gif") {
    args.push("-vf", "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse");
    args.push("-loop", "0");
  } else if (fmt === "flv") {
    args.push("-codec:v", "flv1");
    args.push("-codec:a", "mp3");
  } else if (fmt === "ts") {
    args.push("-codec:v", "libx264", "-codec:a", "aac");
    args.push("-f", "mpegts");
  } else if (fmt === "ogv") {
    args.push("-codec:v", "libtheora", "-codec:a", "libvorbis");
  } else if (fmt === "3gp") {
    args.push("-codec:v", "h263", "-codec:a", "aac");
    args.push("-ar", "8000", "-ac", "1", "-s", "176x144");
  }

  args.push(outputPath);
  await execFileAsync(ffmpegPath, args, { maxBuffer: 100 * 1024 * 1024 });
}

export function supportsVideoConversion(targetFormat: string): boolean {
  return FFMPEG_VIDEO_FORMATS.has(targetFormat.toUpperCase());
}
