import { create } from "zustand";
import GameManager from "../manager";
import { DavinciCard, DavinciCardHostType, DavinciGameStatus } from "../types";


//상대카드,내카드,중앙카드를 제어할 스토어를 만들어봅시다...
interface EnemyCard{
  card : DavinciCard[],
}

interface PlayerCard{
  card : DavinciCard[],
}

interface DeckCard{
  card : DavinciCard[],
}


const useDeck = create<DeckCard>((set,get) => ({
  card : [],
}));


interface GameInfomation{
  status : DavinciGameStatus
  message : string,
}

const useGameInfomation = create<GameInfomation>((set,get) => ({
  status : "idle",
  message : GameManager.getStatus("idle"),
}));


interface GameStatus {
  isStart : boolean,
  gameFinish : () => void,
  gameStart : () => void
  gameStartAction: () => void,
}

const useGameProcess = create<GameStatus>((set,get) => ({
  isStart : false,
  gameFinish : () => set(() => ({isStart : false})),
  gameStart : () => set(() => ({isStart : true})),
  gameStartAction : () => {},
}))


export {useGameProcess,useGameInfomation,useDeck};
    



  
