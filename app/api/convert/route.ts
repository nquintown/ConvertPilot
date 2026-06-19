import { NextRequest, NextResponse } from "next/server";
import { getRegistry } from "../upload/route";
import { createTempPath } from "@/lib/temp";
import { convert } from "@/lib/converters";
import type { Category } from "@/types";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 300;

declare global {
  // eslint-disable-next-line no-var
  var __convertpilot_outputs: Map<string, { path: string; name: string; createdAt: number }> | undefined;
}

function getOutputRegistry() {
  if (!global.__convertpilot_outputs) {
    global.__convertpilot_outputs = new Map();
  }
  return global.__convertpilot_outputs;
}

export { getOutputRegistry };

export async function POST(req: NextRequest) {
  let body: {
    fileId?: string;
    sourceFormat?: string;
    targetFormat?: string;
    category?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { fileId, sourceFormat, targetFormat, category } = body;

  if (!fileId || !sourceFormat || !targetFormat || !category) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const registry = getRegistry();
  const entry = registry.get(fileId);
  if (!entry) {
    return NextResponse.json({ error: "Fichier introuvable (expiré ou invalide)" }, { status: 404 });
  }

  const outputExt = targetFormat.toLowerCase();
  const outputPath = await createTempPath(outputExt);
  const outputName = `${path.basename(entry.name, path.extname(entry.name))}.${outputExt}`;

  try {
    await convert(
      category as Category,
      entry.path,
      outputPath,
      sourceFormat,
      targetFormat
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur de conversion inconnue";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const downloadId = uuidv4();
  const outputs = getOutputRegistry();
  outputs.set(downloadId, { path: outputPath, name: outputName, createdAt: Date.now() });

  return NextResponse.json({ success: true, downloadId, filename: outputName });
}
