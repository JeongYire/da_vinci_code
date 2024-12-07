import { create, createStore } from "zustand";
import GameManager from "../manager";
import { DavinciCard, DavinciCardHostType, DavinciCardValueType, DavinciGameStatus, DavinciMemory } from "../types";




//상대카드,내카드,중앙카드를 제어할 스토어를 만들어봅시다...

interface GameCardStorage{
  deck : DavinciCard[],
  enemy : DavinciCard[],
  player : DavinciCard[],
  setEnemy : (value : DavinciCard[]) => void,
  setPlayer : (value : DavinciCard[]) => void,
  getEnemy : () => DavinciCard[],
  getPlayer : () => DavinciCard[],
}

interface GameInfomation{
  status : DavinciGameStatus,
  message : string,
  setMessage : (value : string) => void,
  setStatus : (status : DavinciGameStatus) => void,
  log : string[],
  setLog : (value : string) => void
}

interface CommonMemory{
  recentCard? : DavinciCard 
  setRecentCard : (card : DavinciCard) => void,
  choiceCard? : DavinciCard,
  setChoiceCard : (card : DavinciCard) => void
}



interface GameMemory{
  player : CommonMemory,
  enemy : CommonMemory
}

interface CentralGameProcessingStorage {
  gameInfomation : GameInfomation,
  cardInfomation : GameCardStorage,
  memoryStorage : GameMemory,
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
    getPlayer: () => get().cardInfomation.player, 
    setEnemy: (value) => {
      set((state) => ({
        cardInfomation: {
          ...state.cardInfomation,
          enemy: [...value], 
        },
      }));
    },
    getEnemy: () => get().cardInfomation.enemy
  },
  gameInfomation : {
    status : "idle",
    message : GameManager.getStatusMessage("idle"),
    setStatus : (value) => {
      set((state) => ({gameInfomation : {
        ...state.gameInfomation,
        status : value,
        message : GameManager.getStatusMessage(value),
      }}));
      GameManager.turnChange(value);
    },
    setMessage : (value) => {
      set((state) => ({gameInfomation : {
        ...state.gameInfomation,
        message : value,
      }}))
    },
    log : [],
    setLog : (value) => {
      //get().gameInfomation.log.push(value);
      set((state) => ({gameInfomation : {
        ...state.gameInfomation,
        log : [...state.gameInfomation.log,value],
      }}))
    }
  },
  memoryStorage : {
    player : {
      setRecentCard : (card : DavinciCard) => {
        // 얜 구독할애가없으니 그냥 정보수정만합니다...
        get().memoryStorage.player.recentCard = card;
      },
      setChoiceCard : (card : DavinciCard) => {
        set((state) => ({memoryStorage : {
          ...state.memoryStorage,
          player : {
            ...state.memoryStorage.player,
            choiceCard : card,
          }
        }}));
      },
    },
    enemy : {
      setRecentCard : (card : DavinciCard) => {
        get().memoryStorage.enemy.recentCard = card;
      },
      setChoiceCard : (card : DavinciCard) => {
        get().memoryStorage.enemy.choiceCard = card;
      },
    }
  }
}));





export {useGame};
    



  
