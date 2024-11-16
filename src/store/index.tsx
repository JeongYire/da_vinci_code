import { create } from "zustand";
import GameManager from "../manager";
import { DavinciCard, DavinciCardHostType, DavinciGameStatus } from "../types";




//상대카드,내카드,중앙카드를 제어할 스토어를 만들어봅시다...

interface GameCardStorage{
  deck : DavinciCard[],
  enemy : DavinciCard[],
  player : DavinciCard[],
  setEnemy : (value : DavinciCard[]) => void,
  setPlayer : (value : DavinciCard[]) => void,
}

interface GameInfomation{
  status : DavinciGameStatus,
  setStatus : (status : DavinciGameStatus) => void,
}

interface CentralGameProcessingStorage {
  gameInfomation : GameInfomation,
  cardInfomation : GameCardStorage,
}


/**
 * 현재는 이렇게 한번에 스토어 한개로 관리하고있고. 나눌필요는없지만
 * 가독성을위해 그냥 나눠버릴까 고민중입니다... 어쩔진 나중에 생각할것 
 */
const useGame = create<CentralGameProcessingStorage>((set,get) => ({
  cardInfomation : {
    deck : [],
    enemy : [],
    player : [],
    setPlayer: (value) => {
      console.log("setPlayer");
      set((state) => ({
        cardInfomation: {
          ...state.cardInfomation,
          player: [...value], 
        },
      }));
    },
    setEnemy: (value) => {
      set((state) => ({
        cardInfomation: {
          ...state.cardInfomation,
          enemy: [...value], 
        },
      }));
    },
  },
  gameInfomation : {
    status : "idle",
    setStatus : (value) => {
      set((state) => ({gameInfomation : {
        ...state.gameInfomation,
        status : value,
      }}))
    } 
  }
}));

export {useGame};
    



  
