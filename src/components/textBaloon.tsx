interface IBaloon {
    text: string;
    classExtra?: string;
}

export const Baloon = ({ text, classExtra } : IBaloon) => {
    return (
        <div className={`${classExtra} flex self-end bg-amber-100 text-black max-w-11/12 m-2 rounded outline p-2`}>
            <p>{text}</p>
        </div>
    )
}