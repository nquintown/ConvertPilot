"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import FileUploader from "./FileUploader";
import FormatSelector from "./FormatSelector";
import CategoryMenu from "./CategoryMenu";
import AdModal from "./AdModal";
import { detectCategory } from "@/lib/formats";
import type { Category } from "@/types";

type ConversionState = "idle" | "converting" | "done" | "error";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
}

const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml", "image/bmp", "image/tiff", "image/heic", "image/heif"]);

export default function ConversionPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryAutoDetected, setCategoryAutoDetected] = useState(false);
  const [sourceFormat, setSourceFormat] = useState("");
  const [targetFormat, setTargetFormat] = useState("");
  const [state, setState] = useState<ConversionState>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAdModal, setShowAdModal] = useState(false);
  const prevPreview = useRef<string | null>(null);

  // Revoke blob URL when it changes or component unmounts
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  useEffect(() => {
    if (prevPreview.current) {
      URL.revokeObjectURL(prevPreview.current);
    }
    if (file && IMAGE_MIMES.has(file.type)) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      prevPreview.current = url;
    } else {
      setPreview(null);
      prevPreview.current = null;
    }
  }, [file]);

  const handleFileSelected = useCallback((f: File) => {
    setFile(f);
    setDownloadUrl(null);
    setDownloadName("");
    setErrorMsg("");
    setState("idle");
    setTargetFormat("");
    setShowAdModal(false);

    const ext = f.name.split(".").pop() ?? "";
    const detected = detectCategory(ext);
    if (detected) {
      setCategory(detected.id);
      setCategoryAutoDetected(true);
    } else {
      setCategory(null);
      setCategoryAutoDetected(false);
    }
    setSourceFormat(ext.toUpperCase());
  }, []);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setCategoryAutoDetected(false);
    setTargetFormat("");
  };

  const handleConvert = async () => {
    if (!file || !category || !sourceFormat || !targetFormat) return;

    setState("converting");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sourceFormat", sourceFormat);
      formData.append("targetFormat", targetFormat);
      formData.append("category", category);

      const res = await fetch("/api/convert", { method: "POST", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erreur de conversion" }));
        throw new Error(data.error || "Erreur de conversion");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const lastDot = file.name.lastIndexOf(".");
      const baseName = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
      const name = `${baseName}.${targetFormat.toLowerCase()}`;

      setDownloadUrl(url);
      setDownloadName(name);
      // Show ad modal before revealing download — state becomes "done" after ad
      setShowAdModal(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
      setState("error");
    }
  };

  const handleAdComplete = () => {
    setShowAdModal(false);
    setState("done");
  };

  const handleReset = () => {
    setDownloadUrl(null);
    setFile(null);
    setPreview(null);
    setCategory(null);
    setCategoryAutoDetected(false);
    setSourceFormat("");
    setTargetFormat("");
    setState("idle");
    setDownloadName("");
    setErrorMsg("");
    setShowAdModal(false);
  };

  const isConverting = state === "converting";
  const canConvert = !!file && !!category && !!sourceFormat && !!targetFormat && !isConverting;

  return (
    <>
      {showAdModal && <AdModal onComplete={handleAdComplete} />}

      <div className="space-y-4">
        {/* Upload zone */}
        <FileUploader
          file={file}
          preview={preview}
          onFileSelected={handleFileSelected}
          disabled={isConverting}
        />

        {/* Two-column panel — only shown after file selected */}
        {file && (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">

            {/* LEFT: Original */}
            <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Original</p>

              {preview && (
                <div className="mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center min-h-32">
                  <img src={preview} alt="preview" className="max-h-48 w-full object-contain" draggable={false} />
                </div>
              )}

              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 text-gray-400 font-medium pr-4 whitespace-nowrap">Type</td>
                    <td className="py-2 text-gray-900 text-right">{sourceFormat || "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-400 font-medium pr-4">Taille</td>
                    <td className="py-2 text-gray-900 text-right">{formatSize(file.size)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-400 font-medium pr-4">Nom</td>
                    <td className="py-2 text-gray-900 text-right truncate max-w-[140px]" title={file.name}>{file.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RIGHT: Options */}
            <div className="sm:col-span-3 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Options de conversion</p>

              {/* Category — only shown when not auto-detected */}
              {!categoryAutoDetected && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Catégorie</p>
                  <CategoryMenu selected={category} onSelect={handleCategoryChange} />
                </div>
              )}

              {/* Target format */}
              {category && (
                <FormatSelector
                  label="Format cible"
                  value={targetFormat}
                  onChange={setTargetFormat}
                  selectedCategory={category}
                  excludeFormat={sourceFormat}
                />
              )}

              {/* Actions */}
              <div className="mt-auto space-y-3">
                {/* Convert button */}
                <button
                  onClick={handleConvert}
                  disabled={!canConvert}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                    ${canConvert
                      ? "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.99]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {isConverting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Conversion en cours…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      {sourceFormat && targetFormat
                        ? <>Convertir <span className="opacity-60 font-normal">{sourceFormat} → {targetFormat}</span></>
                        : "Convertir"
                      }
                    </>
                  )}
                </button>

                {/* Success */}
                {state === "done" && downloadUrl && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Converti</p>
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">{downloadName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a
                        href={downloadUrl}
                        download={downloadName}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Télécharger
                      </a>
                      <button
                        onClick={handleReset}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:border-gray-400 transition-colors"
                      >
                        Nouveau
                      </button>
                    </div>
                  </div>
                )}

                {/* Error */}
                {state === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Erreur</p>
                        <p className="text-xs text-gray-600 mt-0.5">{errorMsg}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="mt-3 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
                    >
                      Réessayer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
