import { NextRequest, NextResponse } from "next/server";
import { saveTempFile } from "@/lib/temp";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 500 MB)" }, { status: 413 });
    }

    const ext = path.extname(file.name).slice(1) || "bin";
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = await saveTempFile(buffer, ext);
    const fileId = uuidv4();

    // Store the path mapping in a temp registry
    const registry = getRegistry();
    registry.set(fileId, { path: filePath, name: file.name, size: file.size, createdAt: Date.now() });

    return NextResponse.json({ fileId, name: file.name, size: file.size });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}

// In-memory registry (sufficient for MVP with single instance)
declare global {
  // eslint-disable-next-line no-var
  var __convertpilot_registry: Map<string, { path: string; name: string; size: number; createdAt: number }> | undefined;
}

export function getRegistry() {
  if (!global.__convertpilot_registry) {
    global.__convertpilot_registry = new Map();
  }
  return global.__convertpilot_registry;
}
