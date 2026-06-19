"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface FileUploaderProps {
  file: File | null;
  preview: string | null;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
}

export default function FileUploader({ file, preview, onFileSelected, disabled }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (f: File) => { onFileSelected(f); },
    [onFileSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && !disabled) handleFile(f);
    },
    [handleFile, disabled]
  );

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); if (!disabled) setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative bg-white rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${dragging ? "border-gray-400 bg-gray-50" : file ? "border-gray-300" : "border-gray-300 hover:border-gray-400"}`}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={onInputChange} disabled={disabled} />

      <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
        {file ? (
          <>
            {/* Preview */}
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="max-h-36 max-w-xs object-contain rounded-xl mb-4"
                draggable={false}
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 border border-gray-200">
                <span className="text-2xl font-bold text-gray-400 uppercase text-xs tracking-widest leading-none">
                  {file.name.split(".").pop()?.toUpperCase() ?? "?"}
                </span>
              </div>
            )}
            <p className="text-sm font-semibold text-gray-900 truncate max-w-sm">{file.name}</p>
            <p className="text-sm text-gray-400 mt-0.5">
              {formatSize(file.size)}
              {" — "}
              <span className="underline underline-offset-2 hover:text-gray-600 transition-colors">
                cliquez pour changer
              </span>
            </p>
          </>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border transition-colors
              ${dragging ? "border-gray-400 bg-gray-100" : "border-gray-200 bg-gray-50"}`}>
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-base mb-1">
              {dragging ? "Déposez ici" : "Glissez-déposez un fichier"}
            </p>
            <p className="text-gray-400 text-sm mb-4">ou</p>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
              Choisir un fichier
            </span>
            <p className="text-gray-400 text-xs mt-4">Taille max : 500 Mo</p>
          </>
        )}
      </div>
    </div>
  );
}
