"use client"

import { Gameboy } from "@/components/gameboy";
import { Baloon } from "@/components/textBaloon";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import prof from "../../../public/profOak.avif";
import profTriste from "../../../public/profOakTriste.webp";
import cenario1 from "../../../public/pokeCenario1.png";
import { useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { api } from "@/constants/api";


const Login = () => {
    const [page, setPage] = useState(1);
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);


    const router = useRouter();

    const validateLogin = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/user/login`, {
                email: email,
                password: pass,
            });
            
    
            const token = response.data.token;
            console.log(token);
    
            if (token) 
                localStorage.setItem("Token", token);
            else
                setPage(3);
    
            router.push(ROUTES.game);
        } catch (error) {
            console.error(error);
            setPage(3);
        } finally {
            setLoading(false);
        }
    };

    const buttonA = () => {
        if (page == 2) {
            validateLogin();
        }

        else if (page == 3)
            setPage(2);

        else
            setPage(page + 1);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-600">
            <Gameboy buttonA={buttonA} buttonB={() => {if (page == 1) return; setPage(page - 1)}}>
                <div className="flex relative justify-center bg-amber-300 w-full rounded-xl">
                    { page == 1 ? (
                        <>
                            <Image src={prof} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                            <Baloon classExtra="absolute" text="Olá, soube que temos um treinador chegando, me diga seu email e sua senha para começar o jogo!"></Baloon>
                        </>
                    ) : page == 2 ? (
                        <>
                            <Image src={cenario1} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                            {loading && (
                                <div className="relative w-full flex items-center justify-center">
                                    <CircularProgress color="warning" size={80} className="absolute self-center rounded-xl"/>
                                </div>
                            )}
                            <div className="absolute h-full w-full flex text-black">
                                <div className="w-full flex flex-col items-center gap-3 self-end bg-amber-100 outline m-2 p-3 rounded">
                                    <h1 className="text-xl font-bold text-red-600">Login</h1>
                                    <TextField onChange={ (e) => setEmail(e.target.value) } sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}} id="outlined-multiline-flexible" label="Email"/>
                                    <TextField onChange={ (e) => setPass(e.target.value) } sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}} id="outlined-multiline-flexible" label="Senha" type="password"/>
                                    <Link className="self-end text-red-600 hover:text-red-800 active:text-red-900" href={ROUTES.register}>Não tem uma conta?</Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Image src={profTriste} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                            <Baloon classExtra="absolute" text="Parece que aconteceu um problema aqui, não consegui encontrar sua conta, tente novamente!"></Baloon>
                        </>
                    )}
                </div>
            </Gameboy>

        </div>
    )
}

export default Login;