import { prototype } from "events";
import type { NextConfig } from "next";
import { hostname } from "os";
import { PROTOCOL } from "sqlite3";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
      protocol: 'https',
      hostname: '*'
      }
    ]
  }
};

export default nextConfig;
