import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import nintendo from "../../public/nintendo.png"

interface IGameboy {
    children: React.ReactNode;
}

export const Gameboy = ({ children } : IGameboy) => {
    return (
        <div className="flex h-full itens-center justify-center w-full">
            <div className="bg-gray-300 h-5/6 w-full m-2 p-3 md:max-w-[30rem] md:min-h-[50rem] rounded-2xl shadow-2xl inset-shadow-sm inset-shadow-gray-800">
                <div className="flex justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-sm inset-shadow-gray-800">
                    <div className="flex justify-center outline-4 grayscale-25 invert-25 saturate-150 h-72 md:min-h-96 rounded-xl">
                        { children }

                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-5 h-full">
                    <div className="flex justify-between w-full p-3 md:px-5">
                        <div className="flex justify-center flex-col items-center">
                            <button>
                                <div className="w-8 md:w-12 aspect-square bg-neutral-600 rounded shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                            </button>
                            <div className="flex">
                                <button>
                                    <div className="w-8 md:w-12 aspect-square bg-neutral-600 rounded shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                                </button>
                                <div className="w-8 md:w-12 aspect-square rounded bg-neutral-600 inset-shadow-2xs"></div>
                                <button>
                                    <div className="w-8 md:w-12 aspect-square bg-neutral-600 rounded shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                                </button>
                            </div>
                            <button>
                                <div className="w-8 md:w-12 aspect-square bg-neutral-600 rounded shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                            </button>
                        </div>
                        <div className="flex gap-1 -rotate-[30deg] bg-neutral-400 h-12 w-[5.3rem] md:w-32 md:h-15 inset-shadow-2xs inset-shadow-gray-800/50 justify-around p-1 self-center rounded-4xl">
                            <button>
                                <div className="w-8 md:w-12 aspect-square bg-red-700 rounded-full shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer flex items-center justify-center text-gray-50">b</div>
                            </button>
                            <button>
                                <div className="w-8 md:w-12 aspect-square bg-red-700 rounded-full shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer flex items-center justify-center text-gray-50">a</div>
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1 mt-8">
                        <div className="flex flex-col justify-center gap-3 text-gray-700">
                            <button className="-rotate-[30deg]">
                                <div className="w-12 h-3 aspect-video bg-gray-600 rounded shadow ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                            </button>
                            <h1>Start</h1>
                        </div>
                        <div className="flex flex-col justify-center gap-3 text-gray-700">
                            <button className="-rotate-[30deg]">
                                <div className="w-12 h-3 aspect-video bg-gray-600 rounded shadow ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                            </button>
                            <h1>Select</h1>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <Image src={nintendo} alt="Logo" className="z-20 w-20 opacity-95" priority></Image>
                </div>
            </div>
        </div>
    )
}