


type DavinciCard = {
    id : number,
    value : number | "joker",
    color : "black" | "white",
    isOpen : boolean,
    host : "human" | "enemy" | "board"
}

export type {DavinciCard};