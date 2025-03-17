
interface IInputGameboy {
    label: string,
    text: string
}

export const InputGameboy = ({ text, label }: IInputGameboy) => {
    const parsedDate = new Date(text);
    const isValidDate = !isNaN(parsedDate.getTime());

    const formattedText = isValidDate
        ? parsedDate.toLocaleDateString("pt-BR")
        : text;

    return (
        <div className="bg-green-700 flex gap-2 p-2 rounded outline-double outline-green-500 shadow-2xl w-full h-10 items-center">
            <h1 className="text-green-100">{label}:</h1>
            <p className="text-green-100">{formattedText}</p>
        </div>
    )
}