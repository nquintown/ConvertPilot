"use client";

import { useState, useCallback } from "react";
import { FORMAT_CATEGORIES } from "@/lib/formats";
import type { Category, FormatCategory } from "@/types";

interface FormatSelectorProps {
  label: string;
  value: string;
  onChange: (format: string) => void;
  selectedCategory?: Category;
  excludeFormat?: string;
}

export default function FormatSelector({
  label,
  value,
  onChange,
  selectedCategory,
  excludeFormat,
}: FormatSelectorProps) {
  const [search, setSearch] = useState("");

  const categories = selectedCategory
    ? FORMAT_CATEGORIES.filter((c) => c.id === selectedCategory)
    : FORMAT_CATEGORIES;

  const groups = useCallback((): { cat: FormatCategory; formats: string[] }[] => {
    const q = search.toUpperCase().trim();
    return categories
      .map((c) => ({
        cat: c,
        formats: c.formats.filter(
          (f) => f !== excludeFormat && (!q || f.includes(q))
        ),
      }))
      .filter((g) => g.formats.length > 0);
  }, [categories, search, excludeFormat])();

  const totalFormats = groups.reduce((n, g) => n + g.formats.length, 0);

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>

      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
        {/* Search */}
        <div className="px-3 pt-3 pb-2 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={`Rechercher parmi ${totalFormats} formats…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Format grid */}
        <div className="overflow-y-auto max-h-52 p-3 space-y-3 scrollbar-none">
          {groups.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-4">Aucun format trouvé</p>
          ) : (
            groups.map(({ cat, formats }) => (
              <div key={cat.id}>
                {!selectedCategory && (
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => onChange(fmt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all
                        ${value === fmt
                          ? "bg-gray-900 border-gray-900 text-white"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900"
                        }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
