import { create } from "zustand";
import GameManager from "../manager";
import { DavinciGameStatus } from "../types";



interface GameInfomation{
  status : DavinciGameStatus
  message : string,
}

const useGameInfomation = create<GameInfomation>((set,get) => ({
  status : "idle",
  message : GameManager.getStatus(get().status),
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


export {useGameProcess,useGameInfomation};
    



  
