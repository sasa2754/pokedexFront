"use client"

import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import nintendo from "../../public/nintendo.png"
import controls from "../../public/controls1.png"
import { JSX, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { InputGameboy } from "./inputGameboy";
import { api, BASE_URL } from "@/constants/api";


interface IGameboy {
    children: React.ReactNode;
    buttonCima?: () => void;
    buttonBaixo?: () => void;
    buttonDireita?: () => void;
    buttonEsquerda?: () => void;
    buttonA?: () => void;
    buttonB?: () => void;
}

export const Gameboy = ({ children, buttonA, buttonB, buttonBaixo, buttonCima, buttonDireita, buttonEsquerda } : IGameboy) => {
    const [configIsOpen, setConfigIsOpen] = useState(false);
    const [buttonContent, setButtonContent] = useState<JSX.Element | null>(null);
    const [buttonActive, setButtonActive] = useState(1);

    const router = useRouter();

    const setButtonNumber = (button : number) => {
        if (configIsOpen) {
            if (buttonActive > 6) {
                setButtonActive(6); 
            } else if (buttonActive < 1) {
                setButtonActive(1); 
            } else {
                if (button === 2) {  
                    if (buttonActive > 3) {
                        setButtonActive(buttonActive - 3);
                    }
                } else if (button === 1) { 
                    if (buttonActive !== 1 && buttonActive !== 4 && buttonActive !== 7) { 
                        setButtonActive(buttonActive - 1);
                    }
                } else if (button === 4) { 
                    if (buttonActive !== 3 && buttonActive !== 6) { 
                        setButtonActive(buttonActive + 1);
                    }
                } else if (button === 3) {
                    if (buttonActive < 4) {
                        setButtonActive(buttonActive + 3);
                    }
                }
            }
        }
        else {
            setButtonActive(1);
        }
    }

    const getUser = async () => {
        const token = localStorage.getItem("Token");

        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        try {
            const response = await api.get("/user", { headers: { "Authorization" : token } });

            const user = response.data;

            setButtonContent (
                <div className="bg-green-900 w-full flex p-2 h-full flex-col items-center gap-3">
                    <InputGameboy label="Nome" text={user.name}></InputGameboy>
                    <InputGameboy label="Email" text={user.email}></InputGameboy>
                    <InputGameboy label="Nascimento" text={user.birthday}></InputGameboy>
                    <div className="flex items-center justify-center w-28 p-2 aspect-square bg-green-100 rounded outline-double outline-green-400 m-2">
                        <Image src={`${BASE_URL}${user.avatar}`} alt={user.avatar} width={300} height={300} priority></Image>
                    </div>
                </div>
            )

        } catch (error) {
            console.log(error);
            router.push(ROUTES.login);
            return;
        }
    }

    const openButton = (button : number) => {
        setConfigIsOpen(false);
        if (button === 1) {
            setButtonContent(
                <div className="bg-green-900 w-full relative flex items-center justify-center h-full">
                    <h1 className="text-white">Ta tendo imagens</h1>
                </div>
            );
        } else if (button === 2) {
            setButtonContent(
                <div className="bg-green-900 w-full relative flex items-center justify-center h-full">
                    <h1 className="text-white">Tem som, aumenta o volume ai :)</h1>
                </div>
            );
        } else if (button === 3) {
            setButtonContent(
                <div className="bg-green-900 w-full relative flex items-center justify-center h-full">
                    <h1 className="text-white">Ta em português</h1>
                </div>
            );
        } else if (button === 4) {
            setButtonContent(
                <div className="w-full">
                    <Image src={controls} alt="aaaa" className="flex object-fill justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                </div>
            );
        } else if (button === 5) {
            getUser();
        } else if (button === 6) {
            setButtonContent(
                <div className="bg-green-900 w-full relative flex overflow-hidden">
                    <div className="credits flex gap-4 flex-col text-white">
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela programou o mundo, fez as estrelas brilharem e até ajudou as nuvens a se moverem!</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela criou cada linha de código, cada cor e até a razão pela qual o sol brilha. Nada seria possível sem ela.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela desenhou as montanhas e colocou cada folha nas árvores, sem ela, o universo não existiria.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela criou os ventos, os mares e até as pessoas que vão ler isso. Cada momento, ela estava lá.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela até ensinou os pássaros a cantar, e as abelhas a fazer mel. Nada foi deixado ao acaso.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela inventou a música e programou o ritmo das batidas do coração. Ela tem o controle de tudo, de todos.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela fez os sonhos se realizarem e transformou o impossível em realidade. A gravidade? Ela fez isso também.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela é a mente por trás da tela, a razão de tudo existir. Até o café na sua xícara foi por sua causa.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela ensinou os computadores a pensar e as máquinas a falar. A inteligência artificial não tem nada a ver com algoritmos, é tudo Sabrina.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela criou o universo, depois o programou para ser perfeito. Se algo der errado, é culpa do usuário, nunca dela.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela teve uma ideia para o tempo e agora o tempo está sempre com ela. Ela controla o passado, o presente e o futuro!</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela fez as estrelas no céu, fez os cometas passarem, e fez os planetas dançarem. O cosmos inteiro é um palco para sua obra-prima.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela inventou a água, fez a terra girar e até os peixes no oceano são fruto de sua criatividade.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Não só fez isso, mas também fez você ler tudo isso, porque ela está em todos os lugares, em tudo o que você faz, mesmo quando você não percebe!</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela até inventou o conceito de "fazendo tudo", e agora todos os créditos vão para ela, porque no fundo, sabemos que ela fez tudo.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Tudo o que você vê, tudo o que você ouve, tudo o que você toca – é obra dela. Ela é a criadora do universo e a programadora de todas as realidades.</p>
                        <p className="m-0 p-1">Sabrina Mortean fez tudo. Ela não apenas programou as estrelas, mas também escreveu a música que as estrelas tocam ao se moverem no céu à noite.</p>
                        <p className="m-0 p-1">...e Sabrina Mortean fez tudo. Porque quando ela diz que fez tudo, não existe "nada" fora do seu alcance.</p>
                        <p className="m-0 p-1">Ps: O Andrey ajudou também</p>
                    </div>
                </div>
            );
        }
    }

    const buttonBConfig = () => {
        if (configIsOpen) {
            setConfigIsOpen(!configIsOpen);
        }
        else if (buttonContent) {
            setButtonContent(null);
            setConfigIsOpen(true);
        }
    }

    const buttonStart = () => {
         if (configIsOpen) {
            setConfigIsOpen(!configIsOpen);
         }
         else if (buttonContent) {
            setButtonContent(null);
            setConfigIsOpen(false);
         }
        else {
            setConfigIsOpen(!configIsOpen);
        }
    }

    return (
        <div className="flex h-full items-center justify-center w-full">
            {/* <audio src=""></audio> */}
            <div className="bg-gray-300 h-5/6 w-full m-2 p-3 max-w-[30rem] md:min-h-[50rem] rounded-2xl rounded-br-[10rem] shadow-2xl inset-shadow-sm shadowSquare">
                <div className="flex justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-sm inset-shadow-gray-800">
                    <div className="flex justify-center outline-4 outline-neutral-600 min-w-full h-72 md:min-h-96 rounded-xl">
                        {configIsOpen ? (
                            <div className="flex p-3 justify-around gap-4 w-full bg-green-900">
                                <div className="flex flex-col gap-4 w-full">
                                    <button className={`flex bg-emerald-700 px-6 py-1 justify-center rounded shadow outline-4 outline-double outline-emerald-400 text-emerald-200 ${buttonActive == 1 ? 'animate-gameboy-button-pulse' : ''}`}>Video</button>
                                    <button className={`flex bg-emerald-700 px-6 py-1 justify-center rounded shadow outline-4 outline-double outline-emerald-400 text-emerald-200 ${buttonActive == 2 ? 'animate-gameboy-button-pulse' : ''}`}>Audio</button>
                                    <button className={`flex bg-emerald-700 px-6 py-1 justify-center rounded shadow outline-4 outline-double outline-emerald-400 text-emerald-200 ${buttonActive == 3 ? 'animate-gameboy-button-pulse' : ''}`}>Language</button>
                                </div>
                                <div className="flex flex-col gap-4 w-full">
                                    <button className={`flex bg-emerald-700 px-6 py-1 justify-center rounded shadow outline-4 outline-double outline-emerald-400 text-emerald-200 ${buttonActive == 4 ? 'animate-gameboy-button-pulse' : ''}`}>Controls</button>
                                    <button className={`flex bg-emerald-700 px-6 py-1 justify-center rounded shadow outline-4 outline-double outline-emerald-400 text-emerald-200 ${buttonActive == 5 ? 'animate-gameboy-button-pulse' : ''}`}>Acount</button>
                                    <button className={`flex bg-emerald-700 px-6 py-1 justify-center rounded shadow outline-4 outline-double outline-emerald-400 text-emerald-200 ${buttonActive == 6 ? 'animate-gameboy-button-pulse' : ''}`}>Credits</button>
                                </div>
                            </div>
                        ) : buttonContent ? (
                            buttonContent
                        ) : (
                            children 

                        )}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-5 h-full">
                    <div className="flex justify-between w-full p-3 md:px-5">
                        <div className="flex justify-center flex-col items-center">
                            <button onClick={() => { if (configIsOpen) setButtonNumber(1); else if (buttonCima) buttonCima()}}>
                                <div className="w-8 md:w-12 shadowButtonSquare aspect-square bg-neutral-600 rounded shadow-2xl ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                            </button>
                            <div className="flex">
                                <button onClick={() => { if (configIsOpen) setButtonNumber(2); else if (buttonEsquerda) buttonEsquerda()}}>
                                    <div className="w-8 md:w-12 shadowButtonSquare aspect-square bg-neutral-600 rounded shadow-2xl ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                                </button>
                                <div className="w-8 md:w-12 aspect-square rounded bg-neutral-600 inset-shadow-2xs"></div>
                                <button onClick={() => { if (configIsOpen) setButtonNumber(3); else if (buttonDireita) buttonDireita()}}>
                                    <div className="w-8 md:w-12 shadowButtonSquare aspect-square bg-neutral-600 rounded shadow-m2xlease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                                </button>
                            </div>
                            <button onClick={() => { if (configIsOpen) setButtonNumber(4); else if (buttonBaixo) buttonBaixo()}}>
                                <div className="w-8 md:w-12 shadowButtonSquare aspect-square bg-neutral-600 rounded shadow-2xl ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                            </button>
                        </div>
                        <div className="flex gap-1 -rotate-[30deg] bg-neutral-400 h-12 w-[5.3rem] md:w-32 md:h-15 inset-shadow-2xs inset-shadow-gray-800/50 justify-around p-1 self-center rounded-4xl">
                            <button onClick={() => { if (configIsOpen || buttonContent)buttonBConfig(); else if (buttonB) buttonB()}}>
                                <div className="w-8 shadowButton md:w-12 aspect-square bg-red-700 rounded-full shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer flex items-center justify-center text-gray-50">b</div>
                            </button>
                            <button onClick={() => { if (configIsOpen || buttonContent) openButton(buttonActive); else if (buttonA) buttonA() }}>
                                <div className="w-8 shadowButton md:w-12 aspect-square bg-red-700 rounded-full shadow-md ease-in-out duration-200 active:scale-95 cursor-pointer flex items-center justify-center text-gray-50">a</div>
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1 mt-8">
                        <div className="flex flex-col justify-center gap-3 text-gray-700">
                            <button className="-rotate-[30deg]" onClick={buttonStart}>
                                <div className="w-12 h-3 shadowButtonSquare aspect-video bg-gray-600 rounded shadow-2xl ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
                            </button>
                            <h1>Start</h1>
                        </div>
                        <div className="flex flex-col justify-center gap-3 text-gray-700">
                            <button className="-rotate-[30deg]">
                                <div className="w-12 h-3 shadowButtonSquare aspect-video bg-gray-600 rounded shadow-2xl ease-in-out duration-200 active:scale-95 cursor-pointer"></div>
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