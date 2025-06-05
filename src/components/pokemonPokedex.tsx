import Image from "next/image"
import { useEffect, useRef } from "react";

interface IPokemonView {
    name: string,
    index: number,
    activeIndex: number,
    id: number
}

const capitalize = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const PokemonView = ({ index, name, activeIndex, id } : IPokemonView) => {
    const pokeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (activeIndex === index && pokeRef.current) {
            pokeRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [activeIndex, index]);
    


    return (
        <div ref={pokeRef} key={index} className={`bg-green-600 py-0.5 md:px-3 px-1 rounded outline-double outline-green-500 ${activeIndex == index ? "animate-gameboy-pulse-pokedex" : ""}`}>
            <h1 className="text-sm md:text-base">#{id} {capitalize(name)}</h1>
        </div>
    )
}