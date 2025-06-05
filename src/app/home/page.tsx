"use client"

import { Gameboy } from "@/components/gameboy";
import pokemon from "../../../public/pokemonFireRed.webp";
import pikachu from "../../../public/pikachuHome.jpg";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { useRouter } from 'next/navigation';



const Home = () => {
    const router = useRouter();

    const handleStart = () => {
        const audio = new Audio("/music.mp3");
        audio.volume = 0.3;
        audio.loop = true;
        audio.play();

        router.push(ROUTES.login);
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-600">
            <Gameboy buttonA={handleStart}>
                {/* <Image src={pokemon} alt="aaaa" className="flex justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image> */}
                <div className="flex relative justify-center">
                    <Image src={pikachu} alt="aaaa" className="flex  object-cover grayscale-25 justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                    <button className="absolute bg-amber-400 text-neutral-700 px-10 py-1 outline-double outline-5 outline-blue-700 animate-gameboy-pulse rounded shadow-2xl self-end md:mb-5 mb-2">Start</button>
                </div>
            </Gameboy>

        </div>
    )
}

export default Home;