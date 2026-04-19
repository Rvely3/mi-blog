import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace al directorio de este config.
  // Evita que Turbopack elija un lockfile huérfano en C:\Users\Usuario\
  // y resuelva dependencias desde el lugar equivocado.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;