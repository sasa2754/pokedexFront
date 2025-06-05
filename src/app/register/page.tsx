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
import cenarioFrenteLab from "../../../public/cenarioFrenteLab.jpg";
import profTriste from "../../../public/profOakTriste.webp";
import cenario1 from "../../../public/pokeCenario1.png";
import { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Avatar } from "@/components/avatar";
import dayjs, { Dayjs } from "dayjs";
import { api } from "@/constants/api";
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

interface avatar {
    name: string,
    url: string
}

class Coordinate {
    x: number;
    y: number;
    maxCol: number;

    constructor(x : number, y : number, maxCol : number) {
        this.x = x;
        this.y = y;
        this.maxCol = maxCol;
    }

    static fromCoord = (coord: Coordinate) => {
        const newCoord = new Coordinate(coord.x, coord.y, coord.maxCol)

        return newCoord
    }

    getIndex = () => {
        return (this.y * this.maxCol) + this.x;
    }
}

const Register = () => {
    const [page, setPage] = useState(1);
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState<Dayjs | null>();
    const [email, setEmail] = useState("");
    const [avatares, setAvatares] = useState<avatar[]>();
    const [pass, setPass] = useState("");
    const [coord, setCoord] = useState<Coordinate>(new Coordinate(0, 0, 4));
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const validateRegister = async (avatar : avatar) => {
        setLoading(true);
        try {
            console.log(avatar);
            const response = await api.post(`/user/register`, {
                name: name,
                email: email,
                birthday: birthday,
                avatar: avatar.url,
                password: pass,
            });
    
            if (response.status == 200) {
                console.log("Criou")
                login();
            }
            else {
                console.log(response.status);
                setPage(7);
            }
        } catch (error) {
            console.error(error);
            setPage(7);
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        setLoading(true);
        try {
            const responseLogin = await api.post(`/user/login`, {
                email: email,
                password: pass,
            });
            
    
            const token = responseLogin.data.token;
            console.log(token);
    
            if (token)
                localStorage.setItem("Token", token);
            else
                setPage(7);
    
            router.push(ROUTES.game);
        } catch (error) {
            console.error(error);
            setPage(7);
        } finally {
            setLoading(false);
        }
    }

    const getAvatar = async () => {
        setLoading(true);
        try {
            const response = (await api.get<avatar[]>(`/user/avatar`)).data;
            console.log(response);

            console.log(response[1].url);

            setAvatares(response);
        } catch (error) {
            console.error(error);
            setPage(9);
        } finally {
            setLoading(false);
        }
    }

    const buttonA = () => {
        if (page == 8)
            setPage(6);

        if (page == 7) {
            if (!avatares)
                return;

            validateRegister(avatares[coord.getIndex()]);
        }

        if (page == 9)
            router.push(ROUTES.home);

        setPage(page + 1);
    }

    const buttonCima = () => {
        if (coord.y === 0)
            return;

        coord.y--;

        setCoord(Coordinate.fromCoord(coord));
        console.log(coord);
    }

    const buttonBaixo = () => {
        if (coord.y === 3)
            return;

        coord.y++;

        setCoord(Coordinate.fromCoord(coord));
    }

    const buttonDireita = () => {
        if (coord.x === 3)
            return;

        coord.x++;

        setCoord(Coordinate.fromCoord(coord));
    }

    const buttonEsquerda = () => {
        if (coord.x === 0)
            return;

        coord.x--;

        setCoord(Coordinate.fromCoord(coord));
    }

    useEffect(() => {
        getAvatar();
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">

            <div className="flex items-center justify-center min-h-screen bg-neutral-600">
                <Gameboy buttonA={buttonA} buttonB={() => {if (page == 1) return; setPage(page - 1)}} buttonCima={buttonCima} buttonBaixo={buttonBaixo} buttonDireita={buttonDireita} buttonEsquerda={buttonEsquerda}>
                    <div className="flex relative justify-center bg-amber-300 w-full h-full rounded-xl">
                        {loading ? (
                            <div className="relative w-full flex items-center justify-center">
                                <Image className="object-cover rounded-xl" src={cenarioFrenteLab} alt="aaa" fill></Image>
                                <CircularProgress color="warning" size={80} className="absolute self-center rounded-xl"/>
                            </div>
                        ) : (
                            <>
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
                                            <div className="w-full flex flex-col items-center gap-3 self-end bg-amber-100 outline m-2 p-3 rounded h-11/12 overflow-auto md:overflow-hidden">
                                                <h1 className="text-xl font-bold text-red-600">Cadastro</h1>
                                                <TextField onChange={ (e) => setName(e.target.value) } sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}} id="outlined-multiline-flexible" label="Nome"/>
                                                <DatePicker onChange={ (value) => setBirthday(value) } label="Data de Nascimento" sx={{ width: "100%", height: "56px", "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "red", borderStyle: "dashed", borderWidth: "2px" }, "&:hover fieldset": { borderColor: "red" }, "&.Mui-focused fieldset": { borderColor: "red" }, "& .MuiInputLabel-root.Mui-focused": { color: "orange" }, "& .MuiInputLabel-root": { color: "purple"} },}}/>
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
                                            <Avatar index={index} key={index} name={avatar.name} url={avatar.url} activeIndex={coord.getIndex()}></Avatar>  
                                            ))}
                                        </div>
                                    </>
                                ) : page == 8 ? (
                                    <>
                                        <Image src={profTriste} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                        <Baloon classExtra="absolute" text="Parece que aconteceu um problema aqui, não consegui criar a sua conta, tente novamente mais tarde!"></Baloon>
                                    </>
                                ) : (
                                    <>
                                        <Image src={profTriste} alt="aaaa" className="flex object-cover grayscale-50 inset-shadow-2xs justify-center bg-gray-400 h-72 md:min-h-96 rounded-xl inset-shadow-2xl inset-shadow-gray-800"></Image>
                                        <Baloon classExtra="absolute" text="Parece que estou com problemas no sistema do cadastro, vou arrumar o mais rápido possível, volte mais tarde!"></Baloon>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </Gameboy>
            </div>
        </LocalizationProvider>

    )
}

export default Register;