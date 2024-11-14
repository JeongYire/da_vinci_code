import { create } from "zustand";
import {DavinciCardValueType,DavinciCard, DavinciCardColorType, DavinciCardInfomation, DavinciGameStatus, DavinciCardHostType}from "../types";
import { useGame } from "../store";

/*

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
      isDetect : false,
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
function StartCardDeals(){

  function StartDealCard(target : DavinciCardHostType){

    let cardArray = new Array();
    let gameStorage = useGame.getState();
    let deck = useGame.getState().cardInfomation.deck;
    let loopCount = 0; 
    while(true){
      let randomCount = Math.floor(Math.random() * deck.length);
      if(deck[randomCount].valueInfo.value == "joker"){
        console.log("조커라서 다시함");
        continue;
      }
  
      deck[randomCount].host = target;
      cardArray.push(deck[randomCount]);
      deck.splice(randomCount,1);
  
      loopCount++;
  
      if(loopCount >= 4){
        break;
      }
    }


    if(target == "player"){
      gameStorage.cardInfomation.player = cardArray;
      //useGame.getState().cardInfomation.setPlayer(cardArray);
      //useGame.setState({cardInfomation : {...gameStorage.cardInfomation,player : cardArray}})
    }

    if(target == "enemy"){
      gameStorage.cardInfomation.enemy = cardArray;
      //useGame.getState().cardInfomation.setEnemy(cardArray);
      //useGame.setState({cardInfomation : {...gameStorage.cardInfomation,enemy : cardArray}})
    }
  }

  // 우선 플레이어에게 4장...
  StartDealCard("player");

  // 그리고 적에게 4장...
  StartDealCard("enemy");

  console.log("Draw 다함");
  console.log(useGame.getState());

  useGame.setState({
    gameInfomation : {
      ...useGame.getState().gameInfomation,
      status : "playerDrawTurn"
    }
  });
  
}

function DrawCard(deck : DavinciCard[]){

  let randomCount = Math.floor(Math.random() * deck.length);
  return deck[randomCount];

}

function StartGameAction(){
  // 우선 게임을 시작하기위해 덱을 만듭니다..
  const valueArray = CreateCard();
  // 이제 이 카드에 아이디를 할당하고 값을 셔플하면서 넣습니다...
  const cardArray : DavinciCard[] = SuffleCard(valueArray);

  /*우선 테이블에있는 보드에게 카드를 전부줍시다...*/
  useGame.setState({cardInfomation : {...useGame.getState().cardInfomation,deck : cardArray}})

  /*서로 카드를 네장 나눠줍시다!*/
  StartCardDeals();

}

const GameManager = {
  getStatus : GetStatus,
  gameStart : StartGameAction
}

function GetStatus(status : DavinciGameStatus){
  if(status == "idle"){
      return "안녕하세요! 게임을 시작하시려면 게임 시작 버튼을 눌러주세요...";
  }

  if(status == "playerDrawTurn"){
    return "카드를 뽑아주세요!!";
  }

  if(status == "playerAttackTurn"){
    return "상대의 카드를 예측해주세요!!";
  }

  if(status == "playerJokerTurn"){
    return "조커를 위치시켜주세요!!";
  }

  return "적이 행동중이에요...";
}

export default GameManager;
