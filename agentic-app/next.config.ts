import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["googleapis", "twilio", "html-to-text", "html-entities"],
};

export default nextConfig;
