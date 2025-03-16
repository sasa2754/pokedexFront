"use client"

import { Gameboy } from "@/components/gameboy";
import { Baloon } from "@/components/textBaloon";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import prof from "../../../public/profOakRegister.jpg";
import profPokemon from "../../../public/profOakPokemons.avif";
import pokeballs from "../../../public/pokeballs.avif";
import profExplicando from "../../../public/profOakExplicando.avif";
import profTriste from "../../../public/profOakTriste.webp";
import cenario1 from "../../../public/pokeCenario1.png";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface avatar {
    name: string,
    url: string
}

const Register = () => {
    const [page, setPage] = useState(1);
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [email, setEmail] = useState("");
    const [avatares, setAvatares] = useState<avatar[]>();
    const [avatar, setAvatar] = useState<avatar>();
    const [pass, setPass] = useState("");

    const router = useRouter();

    const validateEmail = async () => {
        try {
            const response = await axios.post("http://localhost:8080/user/login", {
                name: name,
                email: email,
                birthday: birthday,
                avatar: avatar,
                password: pass,
            });
    
            router.push(ROUTES.game);
        } catch (error) {
            console.error(error);
            setPage(7);
        }
    };

    const getAvatar = async () => {
        try {
            const response = (await axios.get<avatar[]>("http://localhost:8080/user/avatar")).data;
            console.log(response);

            console.log(response[1].url);

    
            setAvatares(response);
        } catch (error) {
            console.error(error);
            setPage(8);
        }
    }

    const buttonA = () => {
        if (page == 8)
            setPage(6);

        if (page == 9)
            router.push(ROUTES.home);

        setPage(page + 1);
    }

    useEffect(() => {
        getAvatar();
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <div className="flex items-center justify-center min-h-screen bg-neutral-600">
                <Gameboy buttonA={buttonA} buttonB={() => {if (page == 1) return; setPage(page - 1)}}>
                    <div className="flex relative justify-center bg-amber-300 w-full h-full rounded-xl">
                        { page == 1 ? (
                            <>
                                <Image src={prof} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <Baloon classExtra="absolute" text="Bem vindo, novo treinador! É ótimo ter você aqui, vou te explicar um pouco sobre como o nosso mundo funciona..."></Baloon>
                            </>

                        ) : page == 2 ? (
                            <>
                                <Image src={profPokemon} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <Baloon classExtra="absolute" text="Nesse mundo nós temos criaturas chamadas de Pokemons, se tiver sorte, você pode capturá-los e cuidar deles..."></Baloon>
                            </>
                        ) : page == 3 ?(
                            <>
                                <Image src={profExplicando} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <Baloon classExtra="absolute" text="Mas o meu principal objetivo aqui é estudar os Pokemons, gostaria que você capturasse eles para que eu possa estudá-los melhor..."></Baloon>
                            </>
                        ) : page == 4 ? (
                            <>
                                <Image src={pokeballs} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <Baloon classExtra="absolute" text="Nós temos alguns tipos de pokeballs para você utilizar, cada uma tem uma taxa de eficiência diferente..."></Baloon>
                            </>
                        ) : page == 5 ?(
                            <>
                                <Image src={prof} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <Baloon classExtra="absolute" text="Mas para iniciarmos, preciso de algumas informações suas, mas não se preocupe, deixarei elas bem guardadas!"></Baloon>
                            </>
                        ) : page == 6 ? (
                            <>
                                <Image src={cenario1} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <div className="absolute h-full w-full flex text-black">
                                    <div className="w-full flex flex-col items-center gap-3 self-end bg-amber-100 outline m-2 p-3 rounded">
                                        <h1 className="text-xl font-bold text-red-600">Cadastro</h1>
                                        <TextField onChange={ (e) => setName(e.target.value) } sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}} id="outlined-multiline-flexible" label="Nome"/>
                                        <DatePicker label="Data de Nascimento" sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}}/>
                                        <TextField onChange={ (e) => setEmail(e.target.value) } sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}} id="outlined-multiline-flexible" label="Email"/>
                                        <TextField onChange={ (e) => setPass(e.target.value) } sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}} id="outlined-multiline-flexible" label="Senha" type="password"/>
                                        <Link className="self-end text-red-600 hover:text-red-800 active:text-red-900" href={ROUTES.login}>Já em uma conta?</Link>
                                    </div>
                                </div>
                            </>
                        ) : page == 7 ? (
                            <>
                                <Image src={cenario1} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <div className="scrollhost absolute grid items-center justify-center grid-cols-4 gap-2 md:p-3 p-1 w-full h-full max-h-full overflow-auto rounded-lg">
                                    {avatares?.map((avatar, index) => (
                                        <div key={index} className="aspect-square p-1 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
                                            <Image priority width={300} height={300} src={`http://localhost:8080${avatar.url}`} alt={avatar.name} className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : page == 8 ? (
                            <>
                                <Image src={profTriste} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <Baloon classExtra="absolute" text="Parece que aconteceu um problema aqui, não consegui encontrar sua conta, tente novamente!"></Baloon>
                            </>
                        ) : (

                            <>
                                <Image src={profTriste} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                <Baloon classExtra="absolute" text="Parece que estou com problemas no sistema do cadastro, vou arrumar o mais rápido possível, volte mais tarde!"></Baloon>
                            </>
                        )}
                    </div>
                </Gameboy>

            </div>
        </LocalizationProvider>

    )
}

export default Register;