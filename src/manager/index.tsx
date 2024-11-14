import { create } from "zustand";
import {DavinciCardValueType,DavinciCard, DavinciCardColorType, DavinciCardInfomation, DavinciGameStatus, DavinciCardHostType}from "../types";
import { useDeck } from "../store";

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

function GetStatus(status : DavinciGameStatus){
    if(status == "idle"){
        return "안녕하세요! 게임을 시작하시려면 게임 시작 버튼을 눌러주세요...";
    }

    if(status == "start"){
        return "게임시작했어요...";
    }

    return "";
}

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

   return valueArray;
}

function SuffleCard(valueArray : DavinciCardInfomation[]){

  let index = 0;
  let arrayLength = valueArray.length;

  let cardArray : DavinciCard[] = new Array(CARD_COUNT);

  while(true){

    // 우선 랜덤한 수를 만듭니다. 이 숫자는 valueArray의 길이에따라 범위가 변합니다.
    let randomCount = Math.floor(Math.random() * arrayLength);

    // 랜덤한 수는 인덱스에 포함되니 거기다가 넣습니다.. 이렇게되면 id는 순서대로지만 value값은 랜덤이됩니다...
    cardArray[index] = {
      host : "deck",
      isOpen : false,
      id : index,
      valueInfo : valueArray[randomCount],
    }

    // 값이 중복이 되면 안되므로 지워버립니다... 
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

// 처음에 하는 Draw 액션을 위해 만든 함수입니다... 굳이 만들지말까했는데 깔끔하게 정리하기위해 했습니다....
function StartDrawCardAction(){

  // 우선 플레이어에게 4장...
  let cardArray = new Array();
  let deck = useDeck.getState().card;
  let loopCount = 0; 
  while(true){
    let randomCount = Math.floor(Math.random() * deck.length);
    if(deck[randomCount].valueInfo.value == "joker"){
      continue;
    }

    deck[randomCount].host = "player";
    cardArray.push(deck[randomCount]);
    deck.splice(randomCount,1);

    loopCount++;

    if(loopCount >= 4){
      break;
    }
  }

  
}

function DrawCard(deck : DavinciCard[]){

  let randomCount = Math.floor(Math.random() * deck.length);
  return deck[randomCount];
  /*
  if(isStart){
    console.log("처음이니까 액션이 강제됩니다...");

    // 처음엔 조커를 뽑으면 안되기에 filter로 검색할까했는데. 차라리 그냥 랜덤카운트해서 조커면 다시 반복하는게 나을거같아서 바꿉니다..
    let boardCard = useDeck.getState().card; 
    let draw = 0;
    const drawCardArray = new Array();
   
    while(true){
  
      console.log("반복됨!");
      // 우선 랜덤한 수를 만듭니다. 이 숫자는 valueArray의 길이에따라 범위가 변합니다.
      let randomCount = Math.floor(Math.random() * boardCard.length);
  
      if(boardCard[randomCount].valueInfo.value == "joker"){
        console.log("조커있네..");
        continue;
      }

      boardCard[randomCount].host = target;
      drawCardArray.push(boardCard[randomCount]);
      boardCard.splice(randomCount,1);
  
      draw++;

      if(draw >= drawCount){
        break;
      }
    }

    console.log(drawCardArray);
  }
    */
}

function StartGameAction(){
  // 우선 게임을 시작하기위해 덱을 만듭니다..
  const valueArray = CreateCard();
  // 이제 이 카드에 아이디를 할당하고 값을 셔플하면서 넣습니다...
  const cardArray : DavinciCard[] = SuffleCard(valueArray);
  // 이제 남은거
  // 상대카드,내카드,중앙의카드 를 제어할 스토어를 만들것
  // 뇌를 만들것 ( 이게 가장 오래걸릴듯 )
  // 메시지만들생각말고 이거부터 만들것.......
  

  /*우선 테이블에있는 보드에게 카드를 전부줍시다...*/
  useDeck.setState({card : cardArray});

  /*서로 카드를 네장 나눠줍시다!*/
  StartDrawCardAction();
}

const GameManager = {
  getStatus : GetStatus,
  gameStart : StartGameAction
}

export default GameManager;
