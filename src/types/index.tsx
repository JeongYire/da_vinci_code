

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

/*
    생각해보니 카드뽑고 위치고르는거까지 자동으로하면 나중에 조커때문에 이상해지니 턴하나를 더 만들어야함

*/
type DavinciGameStatus = "idle" | "playerDrawTurn" | "playerChoiceTurn" | "playerAttackTurn" | "playerAttackRetryTurn" | "enemyDrawTurn" | "enemyJokerTurn" | "enemyAttackTurn";


export type {DavinciCard,DavinciCardColorType,DavinciCardValueType,DavinciCardHostType,DavinciCardInfomation,DavinciGameStatus};