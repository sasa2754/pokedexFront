import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
            {
        protocol: "https",
        hostname: "pokedexback-production.up.railway.app",
      },
    ],
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
      },
      {
        source: "/huntPokemon",
        destination: "/huntPokemon"
      },
      {
        source: "/store",
        destination: "/store"
      },
      {
        source: "/multiplayer",
        destination: "/multiplayer"
      }
    ]
  }
};

export default nextConfig;
