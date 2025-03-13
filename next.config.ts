import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
