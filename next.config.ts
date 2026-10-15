import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ============================================
     OPÇÕES DO NEXT.JS
     ============================================ */
  reactCompiler: true,
  output: "standalone", // Necessário para Docker
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  /* ============================================
     IMAGENS REMOTAS PERMITIDAS
     ============================================ */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;