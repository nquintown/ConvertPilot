import { NextRequest, NextResponse } from "next/server";
import { saveTempFile, createTempPath, cleanupFile } from "@/lib/temp";
import { convert } from "@/lib/converters";
import type { Category } from "@/types";
import fs from "fs/promises";
import mime from "mime-types";

export const runtime = "nodejs";
export const maxDuration = 300;

// Kept for backward compat with app/api/download/[id]/route.ts (unused but prevents compile error)
declare global {
  // eslint-disable-next-line no-var
  var __convertpilot_outputs: Map<string, { path: string; name: string; createdAt: number }> | undefined;
}
export function getOutputRegistry() {
  if (!global.__convertpilot_outputs) global.__convertpilot_outputs = new Map();
  return global.__convertpilot_outputs;
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const sourceFormat = (formData.get("sourceFormat") as string | null)?.trim();
  const targetFormat = (formData.get("targetFormat") as string | null)?.trim();
  const category = (formData.get("category") as string | null)?.trim();

  if (!file || !sourceFormat || !targetFormat || !category) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const inputExt = sourceFormat.toLowerCase().replace(/^\./, "");
  const outputExt = targetFormat.toLowerCase().replace(/^\./, "");

  const inputPath = await saveTempFile(Buffer.from(await file.arrayBuffer()), inputExt);
  const outputPath = await createTempPath(outputExt);

  try {
    await convert(category as Category, inputPath, outputPath, sourceFormat, targetFormat);

    const data = await fs.readFile(outputPath);

    const lastDot = file.name.lastIndexOf(".");
    const baseName = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
    const outputName = baseName + "." + outputExt;
    const mimeType = mime.lookup(outputName) || "application/octet-stream";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(outputName)}`,
        "Content-Length": data.length.toString(),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur de conversion inconnue";
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    await cleanupFile(inputPath);
    await cleanupFile(outputPath);
  }
}
