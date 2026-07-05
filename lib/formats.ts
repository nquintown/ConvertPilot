import type { FormatCategory } from "@/types";

export const FORMAT_CATEGORIES: FormatCategory[] = [
  {
    id: "image",
    label: "Image",
    icon: "🖼️",
    popular: ["JPG", "PNG", "WEBP", "GIF", "HEIC", "AVIF", "SVG", "TIFF", "BMP", "PSD"],
    formats: [
      "3FR","ARW","AVIF","BMP","CR2","CRW","CUR","DCM","DCR","DDS","DNG","ERF",
      "EXR","FAX","FTS","G3","G4","GIF","GV","HDR","HEIC","HEIF","HRZ","ICO",
      "IIQ","IPL","JBG","JBIG","JFI","JFIF","JIF","JNX","JP2","JPE","JPEG",
      "JPG","JPS","K25","KDC","MAC","MAP","MEF","MNG","MRW","MTV","NEF","NRW",
      "ORF","OTB","PAL","PALM","PAM","PBM","PCD","PNG","PSD","SVG","TGA","TIFF","WEBP",
    ],
  },
  {
    id: "document",
    label: "Document",
    icon: "📄",
    popular: ["PDF", "DOCX", "DOC", "XLSX", "TXT", "RTF", "ODT", "CSV", "HTML"],
    formats: [
      "ABW","AW","CSV","DBK","DJVU","DOC","DOCM","DOCX","DOT","DOTM","DOTX",
      "HTML","KWD","ODT","OXPS","PDF","RTF","SXW","TXT","WPS","XLS","XLSX","XPS",
    ],
  },
  {
    id: "ebook",
    label: "Livre électronique",
    icon: "📚",
    popular: ["EPUB", "MOBI", "AZW3", "FB2", "PDF"],
    formats: ["AZW3","EPUB","FB2","LRF","MOBI","PDB","RB","SNB","TCR"],
  },
  {
    id: "audio",
    label: "Audio",
    icon: "🎵",
    popular: ["MP3", "WAV", "AAC", "FLAC", "OGG", "M4A", "OPUS", "AIFF"],
    formats: [
      "8SVX","AAC","AC3","AIFF","AMB","AMR","APE","AU","AVR","CAF","CDDA","CVS",
      "CVSD","CVU","DSS","DTS","DVMS","FAP","FLAC","FSSD","GSM","GSRT","HCOM",
      "HTK","IMA","IRCAM","M4A","M4R","MAUD","MP2","MP3","NIST","OGA","OGG",
      "OPUS","PAF","PRC","PVF","RA","SD2","SHN","SLN","SMP","SND","SNDR","SNDT",
      "SOU","SPH","SPX","TAK","TTA","TXW","VMS","VOC","WAV",
    ],
  },
  {
    id: "archive",
    label: "Archive",
    icon: "🗜️",
    popular: ["ZIP", "RAR", "7Z", "TAR", "TGZ", "TAR.GZ"],
    formats: [
      "7Z","ACE","ALZ","ARC","ARJ","CAB","CPIO","DEB","JAR","LHA","RAR","RPM",
      "TAR","TAR.7Z","TAR.BZ","TAR.LZ","TAR.LZN","TAR.LZO","TAR.XZ","TAR.Z",
      "TBZ2","TGZ","ZIP",
    ],
  },
  {
    id: "video",
    label: "Vidéo",
    icon: "🎬",
    popular: ["MP4", "MKV", "MOV", "AVI", "WEBM", "WMV", "FLV", "MPEG"],
    formats: [
      "3G2","3GP","AAF","ASF","AV1","AVCHD","AVI","CAVS","DIVX","DV","F4V","FLV",
      "HEVC","M2TS","M2V","M4V","MJPEG","MKV","MOD","MOV","MP4","MPEG","MPEG-2",
      "MPG","MTS","MXF","OGV","RM","RMVB","SWF","TOD","TS","VOB","WEBM","WMV",
      "WTV","XVID",
    ],
  },
  {
    id: "presentation",
    label: "Présentation",
    icon: "📊",
    popular: ["PPTX", "PPT", "ODP", "PPSX", "PDF"],
    formats: ["ODP","POT","POTM","POTX","PPS","PPSM","PPSX","PPT","PPTM","PPTX"],
  },
  {
    id: "font",
    label: "Police",
    icon: "🔤",
    popular: ["TTF", "OTF", "WOFF", "WOFF2"],
    formats: ["AFM","BIN","CFF","CID","DFONT","OTF","PFA","PFB","PS","PT3","SFD","T11","T42","TTF","UFO","WOFF","WOFF2"],
  },
  {
    id: "vector",
    label: "Vecteur",
    icon: "✏️",
    popular: ["SVG", "AI", "EPS", "PDF", "CDR", "EMF"],
    formats: ["AFF","AI","CCX","CDR","CDT","CGM","CMX","DST","EMF","EPS","EXP","FIG","PCS","PES","PLT","PS","SK","SK1","SVG","WMF"],
  },
  {
    id: "cad",
    label: "CAD",
    icon: "📐",
    popular: ["DWG", "DXF", "SVG", "PDF"],
    formats: ["DWG","DXF","DWF","SVG","PDF"],
  },
];

export function getCategoryById(id: string): FormatCategory | undefined {
  return FORMAT_CATEGORIES.find((c) => c.id === id);
}

export function detectCategory(ext: string): FormatCategory | undefined {
  const upper = ext.toUpperCase().replace(/^\./, "");
  return FORMAT_CATEGORIES.find((c) => c.formats.includes(upper));
}
