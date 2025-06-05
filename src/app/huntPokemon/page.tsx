"use client"

import { Gameboy } from "@/components/gameboy";
import Image, { StaticImageData } from "next/image";
import cenarioPokemon from "../../../public/cenarioPokemon.jpg";
import pokeballImage from "../../../public/pokeball.png";
import greatballImage from "../../../public/greatball.png";
import ultraballImage from "../../../public/ultraball.png";
import masterballImage from "../../../public/masterball.png";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/constants/routes";
import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Baloon } from "@/components/textBaloon";
import { api } from "@/constants/api";


interface PokemonRandom {
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

interface User {
    name: string,
    email: string,
    money: number,
    pokeballs: {
        pokeball: number,
        greatball: number,
        ultraball: number,
        masterball: number
    }
}

const HuntPokemon = () => {
    const [pokemon, setPokemon] = useState<PokemonRandom>();
    const [option, setOption] = useState(1);
    const [optionPoke, setOptionPoke] = useState(1);
    const [user, setUser] = useState<User>();

    const [page, setPage] = useState(1);

    const router = useRouter();

    const buttonA = () => {
        if (page == 2) {
            if (option == 1) {
                setPage(3);
                return;
            }
            else if (option == 2) {
                setPage(5);
                return;
            }
        }

        if (page === 3) {
            const selectedPokeball = availablePokeballs.find(ball => ball.id === optionPoke);
            if (selectedPokeball) {
                huntPokemon(selectedPokeball.name);
                getUser();
                return;
            }
        }
        else if (page == 4 || page == 5) {
            getRandomPoke();
            setPage(1);
            setOption(1);
            setOptionPoke(1);
            return;
        }
        else {
            setPage(page + 1);
            return;
        }

    }

    const buttonB = () => {
        router.push(ROUTES.game);
    }

    
    const buttonCima = () => {
        if (option == 1) {
            setOption(3);
            return;
        }

        setOption(option - 1);
    }

    const buttonBaixo = () => {
        if (option == 3) {
            setOption(1);
            return;
        }

        else if (option == 2) {
            setOption(3);
        }

        setOption(option + 1);
    }

    const buttonDireita = () => {
        if (page === 3) {
            const currentIndex = availablePokeballs.findIndex((ball: any) => ball.id === optionPoke);
            const nextIndex = (currentIndex + 1) % availablePokeballs.length;
            setOptionPoke(availablePokeballs[nextIndex].id);
        }
    }

    const buttonEsquerda = () => {
        if (page === 3) {
            const currentIndex = availablePokeballs.findIndex((ball: any) => ball.id === optionPoke);
            const prevIndex = (currentIndex - 1 + availablePokeballs.length) % availablePokeballs.length;
            setOptionPoke(availablePokeballs[prevIndex].id);
        }
    }


    const getRandomPoke = async () => {
        try {
            const token = localStorage.getItem("Token");

            if (!token) {
                router.push(ROUTES.login);
                return;
            }

            const response = await api.get<PokemonRandom>(`/pokemon/random`, { headers: { "Authorization" : token }});
            console.log(response.data);

            setPokemon(response.data);

        } catch (error) {
            console.error(error);
            setPage(6);
        }
    }

    const huntPokemon = async (pokeball : string) => {
        const token = localStorage.getItem("Token");

        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        console.log(pokemon)
        console.log(pokeball)

        try {
            const response = await api.post(`/pokemon/hunt`, {
                pokemon: pokemon,
                pokeballName: pokeball,
            }, { headers: { "Authorization" : token } });

            if (response.data.response == true)
                setPage(4)
            else
                setPage(5)

        } catch (error) {
            setPage(6);
            console.log(error);
        }
    }

    const getUser = async () => {
        const token = localStorage.getItem("Token");

        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        try {
            const response = await api.get(`/user`, { headers: { "Authorization" : token } });
            const user = response.data;
            console.log(user);
            setUser(user);

        } catch (error) {
            console.log(error);
            router.push(ROUTES.login);
            return;
        }
    }

    const availablePokeballs = user && user.pokeballs
    ? [
        user.pokeballs.pokeball > 0 && { id: 1, name: "pokeball", image: pokeballImage },
        user.pokeballs.greatball > 0 && { id: 2, name: "greatball", image: greatballImage },
        user.pokeballs.ultraball > 0 && { id: 3, name: "ultraball", image: ultraballImage },
        user.pokeballs.masterball > 0 && { id: 4, name: "masterball", image: masterballImage }
    ].filter(Boolean) as { id: number, name: string, image: StaticImageData }[]
    : [];

    

    const capitalize = (str: string): string => 
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    useEffect(() => {
        getRandomPoke();
        getUser();
    }, []);

    useEffect(() => {
        getUser();
    }, [page]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-600">
            <Gameboy buttonA={buttonA} buttonB={buttonB} buttonDireita={buttonDireita} buttonEsquerda={buttonEsquerda} buttonBaixo={buttonBaixo} buttonCima={buttonCima}>
                <div className="flex relative justify-center bg-amber-300 w-full rounded-xl">
                    <Image className="object-cover rounded-xl " src={cenarioPokemon} alt="aaa"></Image>
                    <div className="absolute flex h-full w-full items-center justify-center">
                        {pokemon ? (
                            <div className="flex h-full w-full justify-center p-2">
                                <Image className="md:w-60 md:h-60 aspect-square rounded-full w-46 h-46 bg-radial from-blue-100 from-10% to-transparent to-90%" src={pokemon.isShiny ? pokemon.imageShiny : pokemon.image} alt="aaa" width={400} height={400} priority></Image>

                                {page == 1 ? (
                                    <Baloon classExtra="absolute" text="Um pokemon selvagem apareceu!"></Baloon>
                                ) : page == 2 ?  (
                                    <div className="flex text-blue-800 p-1 gap-1 flex-col w-11/12 absolute self-end bg-amber-100 rounded outline">
                                        <button className={` ${option == 1 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>Caçar {capitalize(pokemon.name)} {option == 1 ? "<" : ""}</button>
                                        <button className={` ${option == 2 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>Correr {option == 2 ? "<" : ""}</button>
                                    </div>
                                ) : page == 3 ? (
                                    <div className="flex text-blue-800 p-1 gap-1 items-center justify-center absolute self-end bg-amber-100 rounded outline">
                                        {user && availablePokeballs.length > 0 ? (
                                            availablePokeballs.map((ball: any) => (
                                                <button
                                                    key={ball.id}
                                                    className={` ${optionPoke === ball.id ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50 flex items-center justify-center gap-2" : ""} outline outline-blue-800 p-1 rounded`}
                                                >
                                                    <Image className="w-12" src={ball.image} width={300} height={300} priority alt={ball.name} />
                                                </button>
                                            ))
                                        ) : availablePokeballs.length <= 0 ? (
                                            <div className="text-red-500 font-semibold px-2">Você não tem nenhuma pokébola mais</div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                ) : page == 4 ? (
                                    <>
                                        <Baloon classExtra="absolute" text="Você pegou o pokemon!"></Baloon>
                                    </>
                                ) : page == 5 ? (
                                    <>
                                        <Baloon classExtra="absolute" text="O pokemon selvagem fugiu!"></Baloon>
                                    </>
                                ) : (
                                    <>
                                        <Baloon classExtra="absolute" text="Ocorreu um erro!"></Baloon>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <CircularProgress color="warning" />
                            </>
                        )}

                    </div> 
                </div>
            </Gameboy>
        </div>
    )
}

export default HuntPokemon;