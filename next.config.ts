import type { NextConfig } from "next";
import { IgnorePlugin } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore test files and other unnecessary files from thread-stream
    config.plugins = config.plugins || [];
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^\.\/test/,
        contextRegExp: /thread-stream/,
      })
    );
    
    // Ignore non-code files
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /\.(md|txt|LICENSE|bench\.js)$/,
        contextRegExp: /thread-stream/,
      })
    );

    return config;
  },
};

export default nextConfig;
