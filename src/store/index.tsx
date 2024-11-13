import { create } from "zustand";
import {DavinciCardValueType,DavinciCard, DavinciCardColorType, DavinciCardInfomation}from "../types";

/*
interface CentralGameProcessingDevice {
    cardProcessingDevice : CardProcessingDevice,
}

interface CardProcessingDevice {
    card : DavinciCard[],
    tool : {
        createCard : () => DavinciCard[],
        suffleCard : () => DavinciCard[],
    }
}

*/

// 카드수는 26장입니다.
const CARD_COUNT = 26;

// 카드의 숫자는 조커를 제외하면 0~11입니다.
const VALUE_COUNT = 12;

function CreateCard(){

    const valueArray = new Array<DavinciCardInfomation>(CARD_COUNT);

    // 우선 검은색 카드를 만듭니다.
    for(let i = 0; i < VALUE_COUNT; i++){
      valueArray[i] = {
        color : "black",
        value : i,
      };
    }

    // 검은색 조커를 만듭니다...
    valueArray[VALUE_COUNT] = {
      color : "black",
      value : "joker",
    };

    // 그리고 흰색 카드를 만듭니다.
    for(let i = 0; i < VALUE_COUNT; i++){
      valueArray[i + 13] = {
        color : "white",
        value : i,
      };
    }

    // 마지막으로 흰색 조커를 만듭니다... 
    // 당연히 인덱스는 0부터 시작이니 카드수에서 1을 빼야됩니다...
    valueArray[CARD_COUNT - 1] = {
      color : "white",
      value : "joker",
    };

    console.log(valueArray);

   return valueArray;
}

function SuffleCard(valueArray : DavinciCardInfomation[]){

  let index = 0;
  let arrayLength = valueArray.length;

  let cardArray : DavinciCard[] = new Array(CARD_COUNT);

  while(true){

    // 우선 랜덤한 수를 만듭니다. 이 숫자는 valueArray의 길이에따라 범위가 변합니다.
    let randomCount = Math.floor(Math.random() * arrayLength);
    cardArray[index] = {
      host : "board",
      isOpen : false,
      id : index,
      valueInfo : valueArray[randomCount],
    }

    valueArray.splice(randomCount,1);

    index++;
    arrayLength = valueArray.length;

    if(index >= CARD_COUNT){
      break;
    }
  }

  console.log("결과 나옴");
  console.log(cardArray);

  return cardArray;
}


function StartGameAction(){
  // 우선 게임을 시작하기위해 덱을 만듭니다..
  const valueArray = CreateCard();
  // 이제 이 카드에 아이디를 할당하고 값을 셔플하면서 넣습니다...
  const cardArray : DavinciCard[] = SuffleCard(valueArray);
}


/*
const useGameProcess = create<CentralGameProcessingDevice>((set,get) => ({
    cardProcessingDevice : {
        card : [],
        tool : {
            createCard : CreateCard,
            suffleCard : () => get().cardProcessingDevice.card,
        }
    }
}))

*/


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
  gameStartAction : StartGameAction,
}))

export {useGameProcess};
    



  
