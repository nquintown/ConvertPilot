"use client";

import { FORMAT_CATEGORIES } from "@/lib/formats";
import type { Category } from "@/types";

interface CategoryMenuProps {
  selected: Category | null;
  onSelect: (cat: Category) => void;
}

export default function CategoryMenu({ selected, onSelect }: CategoryMenuProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FORMAT_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
            ${selected === cat.id
              ? "bg-gray-900 border-gray-900 text-white"
              : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
