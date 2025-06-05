import axios from "axios";

// export const BASE_URL = "http://localhost:8080";
export const BASE_URL = "https://pokedexback-production.up.railway.app";

export const api = axios.create({
    baseURL: BASE_URL
})