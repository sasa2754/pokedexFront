import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [{protocol: "http", hostname: "localhost", port: "8080"}],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home"
      },
      {
        source: "/login",
        destination: "/login"
      },
      {
        source: "/register",
        destination: "/register"
      },
      {
        source: "/game",
        destination: "/game"
      },
      {
        source: "/pokedex",
        destination: "/pokedex"
      }
    ]
  }
};

export default nextConfig;
