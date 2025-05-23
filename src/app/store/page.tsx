"use client";

import { Gameboy } from "@/components/gameboy";
import cenarioLoja from "../../../public/cenarioLoja.png";
import profTriste from "../../../public/profOakTriste.webp";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/constants/routes";
import { Baloon } from "@/components/textBaloon";
import { api } from "@/constants/api";
import { CircularProgress } from "@mui/material";
import pokecoin from "../../../public/pokecoin.png";

const Store = () => {
    const [page, setPage] = useState(1);
    const [option, setOption] = useState(1);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User>();

    interface User {
        name: string;
        email: string;
        birthday: string;
        avatar: string;
        money: number;
        pokeballs: {
          pokeball: number;
          greatball: number;
          ultraball: number;
          masterball: number;
        };
        pokedex: {
          id: number;
          name: string;
          base_experience: number;
          hp: number;
          attack: number;
          defense: number;
          speed: number;
          image: string;
          imageShiny: string;
          crie: string;
          isShiny: boolean;
        }[];
      }

    const getUser = async () => {
            const token = localStorage.getItem("Token");
    
            if (!token) {
                router.push(ROUTES.login);
                return;
            }
    
            try {
                const response = await api.get("/user", { headers: { "Authorization" : token } });
    
                setUser(response.data);
    
            } catch (error) {
                console.log(error);
                router.push(ROUTES.login);
                return;
            }
        }


    const buy = async (pokeball : string) => {
            setLoading(true);

            const token = localStorage.getItem("Token");

            if (!token) {
                router.push(ROUTES.login);
                return;
            }

            try {
                const response = await api.post(`/user/buy`, {
                    pokeballName: pokeball,
                }, { headers: { "Authorization" : token } });
                
        
                if (response.status == 200)
                    setPage(3)
                else
                    setPage(4)

                console.log(response.status)


            } catch (error) {
                console.error(error);
                setPage(4);
            } finally {
                setLoading(false);
                getUser();
            }
    }


    const buttonA = () => {
        if (page == 1) {
            setPage(2)
        }
        else if (page == 2) {
            if (option == 1) {
                buy("Pokeball")
            }
            else if (option == 2) {
                buy("Greatball")
            }
            else if (option == 3) {
                buy("Ultraball")
            }
            else if (option == 4) {
                buy("Masterball")
            }
        }
        else if (page == 3 || page == 4 || page == 5) {
            setPage(1);
        }
    }

    const buttonB = () => {
        if (page == 1) {
            router.push(ROUTES.game);
        }
        else if (page == 2) {
            setPage(1);
        }
        if (page == 3)
            setPage(1);
    }

    const buttonCima = () => {
        if (option == 1) {
            setOption(4);
            return;
        }
        setOption(option - 1);
    }

    const buttonBaixo = () => {
        if (option == 4) {
            setOption(1);
            return;
        }
        setOption(option + 1);
    }

    useEffect(() => {
        getUser();
      }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-600">
            <Gameboy buttonA={buttonA} buttonB={buttonB} buttonCima={buttonCima} buttonBaixo={buttonBaixo}>
                <div className="flex relative justify-center bg-amber-300 w-full rounded-xl">
                    {loading ? (
                        <div className="relative w-full flex items-center justify-center">
                            <Image className="object-cover rounded-xl" src={cenarioLoja} alt="aaa" fill></Image>
                            <CircularProgress color="warning" size={80} className="absolute self-center rounded-xl"/>
                        </div>
                    ) : (
                        <>
                            {page == 1 ? (
                                <>
                                    <Image className="object-cover rounded-xl" src={cenarioLoja} alt="aaa"></Image>
                                    <Baloon classExtra="absolute" text="Bem-vindo(a), o que você gostaria de comprar?"></Baloon>
                                </>
                            ) : page == 2 && user ? (
                                <>
                                    <Image className="object-cover rounded-xl" src={cenarioLoja} alt="aaa"></Image>
                                        <div className="flex absolute my-2 justify-end w-11/12">
                                            <div className="bg-amber-100 flex gap-2 p-2 rounded-2xl items-center">
                                                <Image className="object-cover rounded-full max-w-8" src={pokecoin} alt="aaa"></Image>
                                                <h1 className="text-blue-900 font-bold p-1 rounded">{user.money}</h1>
                                            </div>
                                        </div>
                                    <div className="flex text-blue-800 p-1 gap-1 flex-col w-11/12 absolute self-end bg-amber-100 rounded outline">
        
                                        <button className={`${option == 1 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>
                                        Pokeball - 2 {option == 1 ? "<" : ""}
                                        </button>
                                        <button className={`${option == 2 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>
                                        Greatball - 5 {option == 2 ? "<" : ""}
                                        </button>
                                        <button className={`${option == 3 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>
                                        Ultraball - 20 {option == 3 ? "<" : ""}
                                        </button>
                                        <button className={`${option == 4 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>
                                        Masterball - 1000 {option == 4 ? "<" : ""}
                                        </button>
                                    </div>
                                </>
                            ) : page == 3 ?(
                                <>
                                    <Image className="object-cover rounded-xl" src={cenarioLoja} alt="aaa"></Image>
                                    <Baloon classExtra="absolute" text="Obrigado por comprar na minha loja!"></Baloon>
                                </>
                            ) : page == 4 ? (
                                <>
                                    <Image className="object-cover rounded-xl" src={cenarioLoja} alt="aaa"></Image>
                                    <Baloon classExtra="absolute" text="Parece que você não tem dinheiro para esse item!"></Baloon>
                                </>
                            ) : (
        
                                <>
                                    <Image src={profTriste} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                    <Baloon classExtra="absolute" text="Acho que algum charmander deve ter colocado fogo sem querer nessa parte do sistema, vou arrumar o mais rápido possível, volte mais tarde!"></Baloon>
                                </>
                            )}
                        </>
                    )}
                </div>
            </Gameboy>

        </div>
    )
}

export default Store;