import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: ({
    appDir: true,
    // ...other experimental flags you might have
  } as unknown as NextConfig["experimental"]),
  /* config options here */
    allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.100.107:3000" // add any other LAN/dev origins you use
  ],
};

export default nextConfig;
