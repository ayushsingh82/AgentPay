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

    // Ignore React Native dependencies for MetaMask SDK in web environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
      };
      
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /@react-native-async-storage\/async-storage/,
        })
      );
    }

    return config;
  },
};

export default nextConfig;
