import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "fluent-ffmpeg", "node-7z"],

  // Exclude build-time-only native packages from the serverless function bundle.
  // These are needed to compile the app but not to run it on Vercel (Lambda).
  outputFileTracingExcludes: {
    "*": [
      "./node_modules/@next/swc-linux-x64-gnu/**",
      "./node_modules/@next/swc-linux-x64-musl/**",
      "./node_modules/@next/swc-darwin-arm64/**",
      "./node_modules/@next/swc-darwin-x64/**",
      "./node_modules/@next/swc-win32-x64-msvc/**",
      "./node_modules/@tailwindcss/oxide-linux-x64-gnu/**",
      "./node_modules/@tailwindcss/oxide-linux-x64-musl/**",
      "./node_modules/@tailwindcss/oxide-darwin-arm64/**",
      "./node_modules/@tailwindcss/oxide-darwin-x64/**",
      "./node_modules/@tailwindcss/oxide-win32-x64-msvc/**",
      "./node_modules/tailwindcss/**",
      "./node_modules/lightningcss-linux-x64-gnu/**",
      "./node_modules/lightningcss-linux-x64-musl/**",
      "./node_modules/lightningcss-darwin-arm64/**",
      "./node_modules/lightningcss-darwin-x64/**",
      "./node_modules/lightningcss-win32-x64-msvc/**",
      "./node_modules/lightningcss/**",
    ],
  },
};

export default nextConfig;
