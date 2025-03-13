import { Gameboy } from "@/components/gameboy";
import pokemon from "../../../public/pokemonFireRed.webp"
import Image from "next/image";


const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-500">
            <Gameboy>
                <Image src={pokemon} alt="aaaa" className="flex justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
            </Gameboy>

        </div>
    )
}

export default Home;