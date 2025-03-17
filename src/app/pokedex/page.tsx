"use client"

import { Gameboy } from "@/components/gameboy";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/constants/routes";
import axios from "axios";
import Image from "next/image";
import { PokemonView } from "@/components/pokemonPokedex";


interface pokemons {
    id: number,
    name: string,
    base_experience: number,
    hp: number,
    attack: number,
    defense: number,
    speed: number,
    image: string,
    imageShiny: string,
    crie: string,
    isShiny: boolean
}


const Pokedex = () => {
    const [pokemons, setPokemons] = useState<pokemons[]>();
    const [selectPokemon, setSelectPokemon] = useState(0);
    const pokeRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();
    

    const getPokemon = async () => {
        const token = localStorage.getItem("Token");

        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/user", { headers: { "Authorization" : token } });

            const user = response.data;

            if (!user)
                router.push(ROUTES.login);

            setPokemons(user.pokedex);
            console.log(user);

        } catch (error) {
            console.log(error);
            router.push(ROUTES.login);
            return;
        }
    }

    const buttonCima = () => {
        if (selectPokemon == 0)
            return;

        setSelectPokemon(selectPokemon - 1);
    }

    const buttonBaixo = () => {
        if (pokemons?.length === (selectPokemon + 1))
            return;

        setSelectPokemon(selectPokemon + 1);
    }

    const capitalize = (str: string): string => 
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    useEffect(() => {
        getPokemon();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-600">
            <Gameboy buttonB={() => router.push(ROUTES.game)} buttonCima={buttonCima} buttonBaixo={buttonBaixo}>
                <div className="grid grid-cols-5 gap-2 bg-red-800 w-full rounded-xl p-2">
                    <div className={`col-span-3 ${pokemons && pokemons?.length > 0 ? "bg-blue-300" : "bg-gray-600"}  p-4 rounded-lg`}>
                        {pokemons ? (
                            <div className="flex flex-col gap-3 items-center w-full">
                                <Image className="rounded-full md:w-44 w-28 bg-radial from-blue-100 from-10% to-transparent to-90%" src={pokemons[selectPokemon].isShiny ? pokemons[selectPokemon].imageShiny : pokemons[selectPokemon].image} alt={pokemons[selectPokemon].name} width={400} height={400} priority></Image>
                                <div className="flex flex-col bg-blue-200 w-full p-2 outline-double outline-cyan-600 rounded gap-1">
                                    <div className="flex justify-between">
                                        <h1 className="text-cyan-700 text-sm md:text-base">{capitalize(pokemons[selectPokemon].name)}</h1>
                                        <h1 className="text-cyan-700 text-sm md:text-base">XP: {pokemons[selectPokemon].base_experience}</h1>
                                    </div>
                                    <div>
                                    <h1 className="text-cyan-700 text-sm md:text-base">Attack: {pokemons[selectPokemon].attack}</h1>
                                    <h1 className="text-cyan-700 text-sm md:text-base">Defense: {pokemons[selectPokemon].defense}</h1>
                                    <h1 className="text-cyan-700 text-sm md:text-base">Speed: {pokemons[selectPokemon].speed}</h1>
                                    <h1 className="text-cyan-700 text-sm md:text-base">HP: {pokemons[selectPokemon].hp}</h1>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                    <div className="bg-green-700 scrollhost p-4 rounded-lg col-span-2 gap-2 flex flex-col overflow-auto">
                        { pokemons && pokemons?.length > 0 ? (
                            pokemons?.map((pokemon, index) => (
                                <PokemonView key={index} index={index} id={pokemon.id} activeIndex={selectPokemon} name={pokemon.name}></PokemonView>
                            ))
                        ) : (
                            <>
                                <h1>Você ainda não caçou nenhum pokemon!</h1>
                            </>
                        )}
                    </div>
                </div>
            </Gameboy>

        </div>
    )
}

export default Pokedex;