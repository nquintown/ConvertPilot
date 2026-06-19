export type Category =
  | "image"
  | "document"
  | "ebook"
  | "audio"
  | "archive"
  | "video"
  | "presentation"
  | "font"
  | "vector"
  | "cad";

export interface FormatCategory {
  id: Category;
  label: string;
  icon: string;
  formats: string[];
}

export interface ConversionJob {
  id: string;
  originalName: string;
  originalPath: string;
  outputPath?: string;
  outputName?: string;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
  createdAt: number;
}

export interface ConvertRequest {
  fileId: string;
  sourceFormat: string;
  targetFormat: string;
  category: Category;
}

export interface ConvertResponse {
  success: boolean;
  downloadId?: string;
  filename?: string;
  error?: string;
}
