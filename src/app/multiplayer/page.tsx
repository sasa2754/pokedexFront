"use client"

import { Gameboy } from "@/components/gameboy";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import { useRouter } from 'next/navigation';
import cenarioBattle from "../../../public/cenarioBattle.jpg"
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Baloon } from "@/components/textBaloon";
import { api } from "@/constants/api";
import { PokemonView } from "@/components/pokemonPokedex";
import StarIcon from '@mui/icons-material/Star';
import { AxiosError } from "axios";


export interface Player {
    id: number;
    name: string;
}

export interface Match {
    matchId: string;
    players: [Player, Player];
}

export interface MatchmakingResponse {
    matchFound: boolean;
    match?: Match;
}

interface User {
    id: number;
    name: string;
    email: string;
    money: number;
    pokeballs: {
        pokeball: number;
        greatball: number;
        ultraball: number;
        masterball: number;
    };
}

interface pokemons {
    id: number;
    name: string;
    base_experience: number;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    image: string;
    imageBack: string;
    imageShiny: string;
    imageBackShiny: string;
    crie: string;
    isShiny: boolean;
}

interface BattleLogEntry {
    message: string;
    timestamp: string;
}

interface BattleData {
    matchId: string;
    player1Id: number;
    player2Id: number;
    player1Pokemon?: pokemons;
    player2Pokemon?: pokemons;
    logs: BattleLogEntry[];
    turn: number;
    winnerId?: number;
}

const Multiplayer = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User>();
    const [oponente, setOponente] = useState("");
    const [oponenteId, setOponenteId] = useState<any>();
    const [page, setPage] = useState(1);
    const [matchId, setMatchId] = useState("");
    const [pokemons, setPokemons] = useState<pokemons[]>();
    const [selectPokemon, setSelectPokemon] = useState(0);
    const [battleData, setBattleData] = useState<BattleData | null>(null);
    const [option, setOption] = useState(1);
    const [action, setAction] = useState("");
    const [selectedBattlePokemon, setSelectedBattlePokemon] = useState<pokemons>();

    const router = useRouter();

    const buttonA = () => {
        if (page == 2) {
            getPokemon();
            setPage(page + 1);
        } else if (page == 3) {
            const chosenPokemon = pokemons?.[selectPokemon];
            if (chosenPokemon) {
                setSelectedBattlePokemon(chosenPokemon);
                selectedPokemon(chosenPokemon.id);
            } else {
                console.error("Não foi possível selecionar o Pokémon. Verifique a lista e o índice.");
            }
        } else if (page == 4) {
            if (!battleData || !user) return;

            // Se já houve um vencedor ou alguém fugiu, não permitir novas ações
            if (isBattleOver()) return;

            if (option == 1) {
                setAction("ATTACK");
                actionBattle("ATTACK");
            } else {
                setAction("FLEE");
                actionBattle("FLEE");
            }
        }
    }

    const buttonB = () => {
        if (page == 1 || battleData?.winnerId) {
            router.push(ROUTES.game);
        }
    }

    const buttonCima = () => {
        if (page == 3) {
            if (selectPokemon == 0) return;
            setSelectPokemon(selectPokemon - 1);
        } else if (page == 4) {
            if (option == 1) {
                setOption(2);
                return;
            }
            setOption(option - 1);
        }
    }

    const buttonBaixo = () => {
        if (page == 3) {
            if (pokemons?.length === (selectPokemon + 1)) return;
            setSelectPokemon(selectPokemon + 1);
        } else if (page == 4) {
            if (option == 2) {
                setOption(1);
                return;
            }
            setOption(option + 1);
        }
    }

    const capitalize = (str: string): string =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const buttonDireita = () => { }
    const buttonEsquerda = () => { }

    const actionBattle = async (actionSelect: string) => {
        setLoading(true);

        const token = localStorage.getItem("Token");
        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        const currentUser = await getUser();
        if (battleData?.turn !== currentUser?.id) {
            console.warn("Não é seu turno. Ignorando ação.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(`/battle/action`, {
                matchId: matchId,
                action: { type: actionSelect }
            }, { headers: { "Authorization": token } });

            setBattleData(response.data as BattleData);
            setLoading(false);
            setPage(4);
        } catch (error) {
            console.error(error);
            setPage(3);
        }
    }

    const match = async () => {
        setLoading(true);
        const token = localStorage.getItem("Token");
        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        try {
            const response = await api.post<MatchmakingResponse>(`/matchmaking`, {}, { headers: { "Authorization": token } });
            if (response.data.matchFound) {
                setLoading(false);
                if (response.data.match) {
                    const currentUser = await getUser();
                    setMatchId(response.data.match.matchId);

                    if (currentUser) {
                        const opponentPlayer1Name = response.data.match.players[1]?.name;
                        const opponentPlayer0Name = response.data.match.players[0]?.name;

                        if (opponentPlayer1Name && opponentPlayer0Name) {
                            if (opponentPlayer1Name === currentUser.name) {
                                setOponente(opponentPlayer0Name);
                                setOponenteId(response.data.match.players[0].id);
                            } else {
                                setOponente(opponentPlayer1Name);
                                setOponenteId(response.data.match.players[1].id);
                            }
                        } else {
                            console.error("O nome de um dos jogadores está faltando nos dados da partida");
                        }
                    } else {
                        console.error("Não foi possível buscar os dados do usuário atual para determinar o oponente.");
                    }
                }
                setPage(2);
            } else {
                // Continua tentando até encontrar oponente
                match();
            }
        } catch (error) {
            console.error(error);
            setPage(3);
        }
    }

    const getPokemon = async () => {
        const token = localStorage.getItem("Token");
        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        try {
            const response = await api.get(`/user`, { headers: { "Authorization": token } });
            const user = response.data;
            if (!user) router.push(ROUTES.login);
            setPokemons(user.pokedex);
        } catch (error) {
            console.log(error);
            router.push(ROUTES.login);
        } finally {
            setLoading(false);
        }
    }

    const selectedPokemon = async (pokemonId: number) => {
        setLoading(true);
        const token = localStorage.getItem("Token");
        if (!token) {
            router.push(ROUTES.login);
            return;
        }

        try {
            const response = await api.post(`/battle/select-pokemon`, {
                matchId: matchId,
                pokemonId: pokemonId
            }, { headers: { "Authorization": token } });

            setBattleData(response.data as BattleData);
            setLoading(false);
            setPage(4);
        } catch (error) {
            console.error(error);
            setPage(3);
        }
    }

    const getUser = async (): Promise<User | null> => {
        const token = localStorage.getItem("Token");
        if (!token) {
            router.push(ROUTES.login);
            return null;
        }
        try {
            const response = await api.get(`/user`, { headers: { "Authorization": token } });
            const userData: User = response.data;
            setUser(userData);
            return userData;
        } catch (error) {
            console.log(error);
            router.push(ROUTES.login);
            return null;
        }
    }

    useEffect(() => {
        match();
    }, []);

    useEffect(() => {

        let pollInterval: NodeJS.Timeout | undefined;

        const fetchAndUpdateBattleStatus = async () => {
            if (!matchId || !user?.id) return;
            const token = localStorage.getItem("Token");
            if (!token) {
                router.push(ROUTES.login);
                return;
            }

            try {
                if (battleData?.winnerId) {
                    if (pollInterval) clearInterval
                    return
                }
                const response = await api.get<BattleData>(`/battle/${matchId}`, {
                    headers: { "Authorization": token }
                });
                setBattleData(response.data);
                if (isBattleOver(response.data)) {
                    if (pollInterval) clearInterval(pollInterval);
                }
            } catch (error) {
                if ((error as AxiosError).status !== 404) {
                    console.error("Erro ao buscar status da batalha:", error);
                    if (pollInterval) clearInterval(pollInterval);
                }

                if (battleData?.winnerId) {
                    clearInterval(pollInterval);
                    return
                }

                // if (!winnerId) {
                //     setBattleData({...battleData, winnerId: oponenteId} as BattleData)
                // }

            }
        };

        if (page === 4 && matchId) {
            fetchAndUpdateBattleStatus();
            pollInterval = setInterval(fetchAndUpdateBattleStatus, 1000);
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [page, matchId, user, battleData]);


    /**
     * Retorna true se a batalha já acabou:
     * - Um dos Pokémon tem hp <= 0
     * - Alguma mensagem de fuga nos logs
     */
    const isBattleOver = (data: BattleData = battleData!): boolean => {
        if (!data || !user) return false;

        if (data.winnerId)
            return true

        return false
    };

    /**
     * Retorna a mensagem de fim de batalha em função de quem perdeu/venceu
     */
    const getEndMessage = (): string => {
        if (!battleData || !user) return "";

        const playerIsP1 = battleData.player1Id === user.id;
        const playerPokemon = playerIsP1 ? battleData.player1Pokemon : battleData.player2Pokemon;
        const opponentPokemon = playerIsP1 ? battleData.player2Pokemon : battleData.player1Pokemon;

        if (!playerPokemon || !opponentPokemon) return "";

        const fugiuLog = battleData.logs.find(log =>
            log.message.toLowerCase().includes("fugiu")
        );

        if (fugiuLog) {
            const playerPokemonName = playerPokemon.name.toLowerCase();
            const regex = new RegExp(`\\b${user.id}\\b`);
            if (regex.test(fugiuLog.message)) {
                return "Você fugiu da batalha!";
            } else {
                return "O seu oponente fugiu da batalha!";
            }
        }

        if (user.id === battleData.winnerId) {
            console.log("UserID:", user.id)
            console.log("WinnerID:", battleData.winnerId)

            return "Você venceu a batalha!"
        } else {
            return "Você perdeu a batalha!"
        }
    };

    useEffect(() => {
        console.log("Winner ID updated!", battleData?.winnerId)
    }, [battleData])

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-neutral-600">
                <Gameboy
                    buttonA={buttonA}
                    buttonB={buttonB}
                    buttonCima={buttonCima}
                    buttonBaixo={buttonBaixo}
                    buttonDireita={buttonDireita}
                    buttonEsquerda={buttonEsquerda}
                >
                    <div className="flex relative justify-center bg-amber-300 w-full rounded-xl">
                        <Image
                            className="object-cover rounded-xl absolute h-full"
                            src={cenarioBattle}
                            alt="cenário de batalha"
                        />

                        {loading && (
                            <div className="w-full flex items-center justify-center">
                                <CircularProgress
                                    color="warning"
                                    size={80}
                                    className="absolute self-center rounded-xl"
                                />
                                <Baloon classExtra="absolute" text="Encontrando adversário!" />
                            </div>
                        )}

                        {page == 1 ? (
                            <Baloon classExtra="absolute" text={`Encontrando adversário`} />
                        ) : page == 2 ? (
                            <Baloon
                                classExtra="absolute"
                                text={`Partida encontrada! ${oponente} está pronto(a) para a batalha!`}
                            />
                        ) : page == 3 ? (
                            <>
                                {pokemons && pokemons.length > 0 && (
                                    <div className="grid absolute grid-cols-5 gap-2 bg-red-800 w-full h-full rounded-xl p-2">
                                        <div
                                            className={`col-span-3 ${pokemons.length > 0 ? "bg-blue-300" : "bg-gray-600"
                                                } p-4 rounded-lg`}
                                        >
                                            <div className="flex flex-col gap-3 items-center w-full">
                                                <Image
                                                    className="rounded-full md:w-44 w-28 bg-radial from-blue-100 from-10% to-transparent to-90%"
                                                    src={
                                                        pokemons[selectPokemon].isShiny
                                                            ? pokemons[selectPokemon].imageShiny
                                                            : pokemons[selectPokemon].image
                                                    }
                                                    alt={pokemons[selectPokemon].name}
                                                    width={400}
                                                    height={400}
                                                    priority
                                                />
                                                <div className="flex flex-col bg-blue-200 w-full p-2 outline-double outline-cyan-600 rounded gap-1">
                                                    <div className="flex justify-between">
                                                        <div className="flex gap-2">
                                                            <h1 className="text-cyan-700 text-sm md:text-base">
                                                                {capitalize(pokemons[selectPokemon].name)}
                                                            </h1>
                                                            {pokemons[selectPokemon].isShiny && (
                                                                <StarIcon sx={{ color: "yellow" }} />
                                                            )}
                                                        </div>
                                                        <h1 className="text-cyan-700 text-sm md:text-base">
                                                            XP: {pokemons[selectPokemon].base_experience}
                                                        </h1>
                                                    </div>
                                                    <div>
                                                        <h1 className="text-cyan-700 text-sm md:text-base">
                                                            Attack: {pokemons[selectPokemon].attack}
                                                        </h1>
                                                        <h1 className="text-cyan-700 text-sm md:text-base">
                                                            Defense: {pokemons[selectPokemon].defense}
                                                        </h1>
                                                        <h1 className="text-cyan-700 text-sm md:text-base">
                                                            Speed: {pokemons[selectPokemon].speed}
                                                        </h1>
                                                        <h1 className="text-cyan-700 text-sm md:text-base">
                                                            HP: {pokemons[selectPokemon].hp}
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-green-700 scrollhost p-4 rounded-lg col-span-2 gap-2 flex flex-col overflow-auto">
                                            {pokemons.map((pokemon, index) => (
                                                <PokemonView
                                                    key={index}
                                                    index={index}
                                                    id={pokemon.id}
                                                    activeIndex={selectPokemon}
                                                    name={pokemon.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : page == 4 ? (
                            <>
                                {page === 4 && battleData && user && (
                                    <div className="flex flex-col w-full h-full p-2">
                                        {/* Verifica se a batalha acabou */}
                                        {isBattleOver() ? (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Baloon
                                                    classExtra="text-center bg-red-200 p-4 rounded-lg"
                                                    text={getEndMessage()}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                {/* Tela de batalha normal */}
                                                <div className="flex relative justify-between items-end w-full h-4/5 px-2">
                                                    {/* Pokémon do jogador (à esquerda) */}
                                                    <div className="flex flex-col items-center justify-end">
                                                        {battleData.player1Id === user.id
                                                            ? battleData.player1Pokemon && (
                                                                <>
                                                                    <Baloon classExtra="mb-1" text={`Vida: ${battleData.player1Pokemon.hp}`} />
                                                                    <Image
                                                                        className="aspect-square rounded-full md:w-44 w-44 bg-radial from-blue-100 from-10% to-transparent to-90%"
                                                                        src={
                                                                            battleData.player1Pokemon.isShiny
                                                                                ? battleData.player1Pokemon.imageBackShiny
                                                                                : battleData.player1Pokemon.imageBack
                                                                        }
                                                                        alt="Seu Pokémon"
                                                                        width={400}
                                                                        height={400}
                                                                        priority
                                                                    />
                                                                </>
                                                            )
                                                            : battleData.player2Pokemon && (
                                                                <>
                                                                    <Baloon classExtra="mb-1" text={`Vida: ${battleData.player2Pokemon.hp}`} />
                                                                    <Image
                                                                        className="aspect-square rounded-full md:w-44 w-44 bg-radial from-blue-100 from-10% to-transparent to-90%"
                                                                        src={
                                                                            battleData.player2Pokemon.isShiny
                                                                                ? battleData.player2Pokemon.imageBackShiny
                                                                                : battleData.player2Pokemon.imageBack
                                                                        }
                                                                        alt="Seu Pokémon"
                                                                        width={400}
                                                                        height={400}
                                                                        priority
                                                                    />
                                                                </>
                                                            )}
                                                    </div>

                                                    {/* Pokémon do oponente (à direita) */}
                                                    <div className="flex flex-col items-center justify-start">
                                                        {battleData.player1Id !== user.id
                                                            ? battleData.player1Pokemon && (
                                                                <>
                                                                    <Baloon classExtra="mb-1" text={`Vida: ${battleData.player1Pokemon.hp}`} />
                                                                    <Image
                                                                        className="aspect-square rounded-full md:w-44 w-44 bg-radial from-blue-100 from-10% to-transparent to-90%"
                                                                        src={
                                                                            battleData.player1Pokemon.isShiny
                                                                                ? battleData.player1Pokemon.imageShiny
                                                                                : battleData.player1Pokemon.image
                                                                        }
                                                                        alt="Pokémon do oponente"
                                                                        width={400}
                                                                        height={400}
                                                                        priority
                                                                    />
                                                                </>
                                                            )
                                                            : battleData.player2Pokemon && (
                                                                <>
                                                                    <Baloon classExtra="mb-1" text={`Vida: ${battleData.player2Pokemon.hp}`} />
                                                                    <Image
                                                                        className="aspect-square rounded-full md:w-44 w-44 bg-radial from-blue-100 from-10% to-transparent to-90%"
                                                                        src={
                                                                            battleData.player2Pokemon.isShiny
                                                                                ? battleData.player2Pokemon.imageShiny
                                                                                : battleData.player2Pokemon.image
                                                                        }
                                                                        alt="Pokémon do oponente"
                                                                        width={400}
                                                                        height={400}
                                                                        priority
                                                                    />
                                                                </>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* Ações ou espera */}
                                                <div className="flex justify-center absolute bottom-0 w-full my-2 h-1/5 items-start">
                                                    {battleData.turn === user.id ? (
                                                        <div className="flex text-blue-800 p-1 gap-1 flex-col w-11/12 bg-amber-100 rounded outline">
                                                            <button
                                                                className={`${option === 1 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""
                                                                    } outline outline-blue-800 p-1 rounded`}
                                                            >
                                                                Atacar {option === 1 ? "<" : ""}
                                                            </button>
                                                            <button
                                                                className={`${option === 2 ? "animate-gameboy-pulse-pokemon font-semibold bg-amber-50" : ""
                                                                    } outline outline-blue-800 p-1 rounded`}
                                                            >
                                                                Fugir {option === 2 ? "<" : ""}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <Baloon
                                                            classExtra="text-center"
                                                            text="Aguarde o turno do seu oponente!"
                                                        />
                                                    )}
                                                </div>

                                                {/* Aguardando oponente escolher Pokémon */}
                                                {(!battleData.player1Pokemon || !battleData.player2Pokemon) && (
                                                    <Baloon
                                                        classExtra="absolute self-center"
                                                        text="Aguardando o oponente escolher um Pokémon para a batalha!"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                            </>
                        ) : page == 5 ? (
                            <></>
                        ) : (
                            <></>
                        )}
                    </div>
                </Gameboy>
            </div>
        </>
    )
}

export default Multiplayer;
