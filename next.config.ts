import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Turbopack configuration for Next.js 16+
  turbopack: {
    resolveAlias: {
      // Redirect MediaPipe import to empty module (we use tfjs runtime instead)
      '@mediapipe/selfie_segmentation': './lib/utils/empty-module.js',
    },
  },

  // Allow external images and resources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'unpkg.com',
      },
    ],
  },

  // Exclude TensorFlow packages from server-side bundling
  serverExternalPackages: [
    '@tensorflow-models/body-segmentation',
    '@tensorflow/tfjs-core',
    '@tensorflow/tfjs-backend-webgl',
    '@mediapipe/selfie_segmentation'
  ],

  // Webpack configuration for handling problematic packages
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mark MediaPipe packages as optional (we use TFJS runtime instead)
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback['@mediapipe/selfie_segmentation'] = false;
    }
    return config;
  },
};

export default nextConfig;
