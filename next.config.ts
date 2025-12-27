import {withSentryConfig} from "@sentry/nextjs";
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
  async redirects(){
    return [
      {
        source:"/",
        destination:"/workflows",
        permanent:false
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        async_hooks: false,
        perf_hooks: false,
        child_process: false,
      };
    }
    return config;
  },

};


export default withSentryConfig(nextConfig, {
  org: "na-srp",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
});