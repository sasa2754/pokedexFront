import { BASE_URL } from "@/constants/api";
import Image from "next/image"
import { useEffect, useRef } from "react";

interface IAvatar {
    name: string,
    url: string,
    index: number,
    activeIndex: number
}



export const Avatar = ({ index, name, url, activeIndex } : IAvatar) => {
    const avatarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (activeIndex === index && avatarRef.current) {
            avatarRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [activeIndex, index]);
    


    return (
        <div ref={avatarRef} key={index} className={`aspect-square ${ index === activeIndex ? "animate-gameboy-pulse" : ""} p-1 bg-gray-200 rounded-lg flex items-center justify-center shadow-md`}>
            <Image priority width={300} height={300} src={`${BASE_URL}${url}`} alt={name} className="w-full h-full object-cover rounded-lg" />
        </div>
    )
}