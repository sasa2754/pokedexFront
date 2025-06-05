"use client"

import { Gameboy } from "@/components/gameboy";
import cenarioFrenteLab from "../../../public/cenarioFrenteLab.jpg";
import profTriste from "../../../public/profOakTriste.webp";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/constants/routes";
import { Baloon } from "@/components/textBaloon";


const Game = () => {
    const [page, setPage] = useState(1);
    const [option, setOption] = useState(1);
    const router = useRouter();
    

    const buttonA = () => {
        if (option == 1) {
            router.push(ROUTES.huntPokemon);
        }
        else if (option == 2) {
            router.push(ROUTES.pokedex);
        }
        else if (option == 3) {
            router.push(ROUTES.store);
        }
        else if (option == 4) {
            router.push(ROUTES.multiplayer);
        }
        else{
            setPage(2);
        }
    }

    const buttonB = () => {
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-600">
            <Gameboy buttonA={buttonA} buttonB={buttonB} buttonCima={buttonCima} buttonBaixo={buttonBaixo}>
                <div className="flex relative justify-center bg-amber-300 w-full rounded-xl">
                    {page == 1 ? (
                        <>
                            <Image className="object-cover rounded-xl" src={cenarioFrenteLab} alt="aaa"></Image>
                            <div className="flex text-blue-800 p-1 gap-1 flex-col w-11/12 absolute self-end bg-amber-100 rounded outline">
                                <button className={` ${option == 1 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>Caçar pokémon {option == 1 ? "<" : ""}</button>
                                <button className={` ${option == 2 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>Abrir pokedex {option == 2 ? "<" : ""}</button>
                                <button className={` ${option == 3 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>Ir para a loja {option == 3 ? "<" : ""}</button>
                                <button className={` ${option == 4 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""} outline outline-blue-800 p-1 rounded`}>Multiplayer {option == 4 ? "<" : ""}</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Image src={profTriste} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                            <Baloon classExtra="absolute" text="Acho que algum charmander deve ter colocado fogo sem querer nessa parte do sistema, vou arrumar o mais rápido possível, volte mais tarde!"></Baloon>
                        </>
                    )}
                </div>
            </Gameboy>

        </div>
    )
}

export default Game;