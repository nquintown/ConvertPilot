import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function checkBinary(name: string): Promise<string | null> {
  // Direct path
  if (name.startsWith("/")) {
    try {
      await execFileAsync(name, ["--version"]);
      return name;
    } catch {
      return null;
    }
  }

  // which lookup
  try {
    const { stdout } = await execFileAsync("which", [name]);
    const p = stdout.trim();
    if (p) return p;
  } catch {
    // not found
  }

  // macOS app fallback for soffice
  if (name === "soffice") {
    const mac = "/Applications/LibreOffice.app/Contents/MacOS/soffice";
    try {
      await execFileAsync(mac, ["--version"]);
      return mac;
    } catch {
      // not found
    }
  }

  return null;
}
