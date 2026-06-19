const LIBREOFFICE_INPUT_FORMATS: Set<string> = new Set([
  "DOC","DOCX","DOCM","DOT","DOTM","DOTX","ODT","RTF","TXT","HTML",
  "WPS","SXW","ABW","AW","KWD","DBK","XLS","XLSX","CSV","ODS","ODP",
  "PPT","PPTX","ODP","PDF",
]);

const LIBREOFFICE_OUTPUT_FORMATS: Set<string> = new Set([
  "PDF","DOC","DOCX","ODT","RTF","TXT","HTML","XLSX","CSV","ODS",
  "PPTX","ODP",
]);

export async function convertDocument(
  inputPath: string,
  outputPath: string,
  targetFormat: string
): Promise<void> {
  // Dynamic import with turbopackIgnore prevents Turbopack from analyzing
  // document-runner.ts at build time. Without this, the dynamic path.join inside
  // document-runner would match ~10,000 node_modules files and exceed Vercel's 250 MB limit.
  const { runDocumentConversion } = await import(
    /* turbopackIgnore: true */
    "./document-runner"
  );
  await runDocumentConversion(inputPath, outputPath, targetFormat);
}

export function supportsDocumentConversion(sourceFormat: string, targetFormat: string): boolean {
  return (
    LIBREOFFICE_INPUT_FORMATS.has(sourceFormat.toUpperCase()) &&
    LIBREOFFICE_OUTPUT_FORMATS.has(targetFormat.toUpperCase())
  );
}
