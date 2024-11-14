

type DavinciCardValueType = number | "joker";
type DavinciCardColorType = "black" | "white";
type DavinciCardHostType =  "player" | "enemy" | "deck";
type DavinciCardInfomation = {
    color : DavinciCardColorType,
    value : DavinciCardValueType,
}
type DavinciCard = {
    id : number,
    valueInfo : DavinciCardInfomation,
    isOpen : boolean,
    host : DavinciCardHostType
}


type DavinciGameStatus = "idle" | "start";


export type {DavinciCard,DavinciCardColorType,DavinciCardValueType,DavinciCardHostType,DavinciCardInfomation,DavinciGameStatus};