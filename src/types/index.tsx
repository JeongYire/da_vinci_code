

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
    isDetect : boolean,
    host : DavinciCardHostType
}


type DavinciGameStatus = "idle" | "playerDrawTurn" | "playerJokerTurn" | "playerAttackTurn" | "enemyDrawTurn" | "enemyJokerTurn" | "enemyAttackTurn";


export type {DavinciCard,DavinciCardColorType,DavinciCardValueType,DavinciCardHostType,DavinciCardInfomation,DavinciGameStatus};