import { NextRequest, NextResponse } from "next/server";
import { getOutputRegistry } from "../../convert/route";
import fs from "fs";
import mime from "mime-types";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const outputs = getOutputRegistry();
  const entry = outputs.get(id);

  if (!entry) {
    return NextResponse.json({ error: "Fichier introuvable ou expiré" }, { status: 404 });
  }

  if (!fs.existsSync(entry.path)) {
    return NextResponse.json({ error: "Fichier converti introuvable sur le serveur" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(entry.path);
  const mimeType = mime.lookup(entry.name) || "application/octet-stream";

  outputs.delete(id);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(entry.name)}"`,
      "Content-Length": fileBuffer.length.toString(),
    },
  });
}
