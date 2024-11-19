import { create } from "zustand";
import {DavinciCardValueType,DavinciCard, DavinciCardColorType, DavinciCardInfomation, DavinciGameStatus, DavinciCardHostType}from "../types";
import { useGame } from "../store";
import cardManager from "./cardManager";


function DrawCard(target : DavinciCardHostType){

  console.log("DrawCard");

  /* 테스트시작
  const value = prompt("뭐 원해");
  let deck = useGame.getState().cardInfomation.deck;
  let randomCount = Math.floor(Math.random() * deck.length);

  let targetCard =  deck[randomCount];
  let gameStorage = useGame.getState();

  if(target == "player"){
    targetCard.host = "player";
    targetCard.valueInfo.value = value == "-" ? "joker" : Number(value);
    gameStorage.memoryStorage.player.setRecentCard(targetCard);
  }

  deck.splice(randomCount,1);
  gameStorage.gameInfomation.setStatus("playerChoiceTurn");

  return;
  테스트 끝 */

  const card = cardManager.draw()[0];
  
  let gameStorage = useGame.getState();

  /* host 바꾸는걸 GameManager가 할지 CardManager가 할지 고민중... */
  if(target == "player"){
    card.host = "player";
    gameStorage.memoryStorage.player.setRecentCard(card);
  }

  gameStorage.gameInfomation.setStatus("playerChoiceTurn");
  
}

function MoveCard(cardArray : DavinciCard[],index : number,target : DavinciCardHostType){
  
  console.log("MoveCard");

  let gameStorage = useGame.getState();
  let card = gameStorage.memoryStorage.player.recentCard;
  
  if(card != undefined){
    cardArray.splice(index,0,card);
  }else{
    console.log("버그!!!!!!!");
  }

  if(target == "player"){
    gameStorage.cardInfomation.setPlayer(cardArray);
  }else{
    gameStorage.cardInfomation.setEnemy(cardArray);
  }

  //gameStorage.gameInfomation.setStatus("playerAttackTurn");
  // 잠깐테스트로 반복하게함
  //gameStorage.gameInfomation.setStatus("playerDrawTurn");
  gameStorage.gameInfomation.setStatus("playerAttackTurn");
}

function StartGame(){
  
  const cardArray = cardManager.createCard();

  /*우선 테이블에있는 보드에게 카드를 전부줍시다...*/
  useGame.getState().cardInfomation.deck = cardArray;

  /*카드를 나눠주는 작업을 실행합니다...*/
  cardManager.dealCard();

  /*작업을 전부 끝마쳤으면 이제 스테이터스를 바꿉니다...*/
  useGame.getState().gameInfomation.setStatus("playerDrawTurn");

}

function GetStatusMessage(status : DavinciGameStatus | string){

  console.log("GetStatusMessage");
  console.log(status);

  let message = "";

  switch (status) {
    case "idle":
      message = "안녕하세요! 게임을 시작하시려면 게임 시작 버튼을 눌러주세요...";
      break;
    case "playerDrawTurn":
      message = "카드를 뽑아주세요!!";
      break;
    case "playerAttackTurn":
      message = "상대의 카드를 예측해주세요!!";
      break;
    case "playerChoiceTurn":
        message = "카드를 위치시켜주세요!!";
        break;
    case "playerAttackRetryTurn":
        message = "카드 공격에 성공했습니다! 다시 공격하거나, 턴을 끝낼 수 있어요!";
        break;
    default : 
        message = "적이 행동중이에요..."
        break;
  }

  return message;
}

function AttackCard(card : DavinciCard,value : DavinciCardValueType,host : DavinciCardHostType = "player"){

  const attackVaild = card.valueInfo.value == value;
  const gameStorage = useGame.getState();
  if(host == "player"){
    if(attackVaild){

     
      const enemyCard = gameStorage.cardInfomation.enemy;

      let target = enemyCard.find(obj => obj.id == card.id) as DavinciCard;
      target.isDetect = true;

      gameStorage.memoryStorage.player.choiceCard = undefined;
      gameStorage.cardInfomation.setEnemy(enemyCard);

      gameStorage.gameInfomation.setStatus("playerAttackRetryTurn");
    }else{

      
      gameStorage.memoryStorage.player.choiceCard = undefined;
      const recentCard = gameStorage.memoryStorage.player.recentCard as DavinciCard;
      const playerCard = gameStorage.cardInfomation.player;
      
      let target = playerCard.find(obj => obj.id == recentCard.id) as DavinciCard;
      target.isDetect = true;

      gameStorage.memoryStorage.player.recentCard = undefined;
      
      gameStorage.cardInfomation.setPlayer(playerCard);
      gameStorage.gameInfomation.setStatus("enemyDrawTurn");
    }
  }
}

const GameManager = {
  getStatusMessage : GetStatusMessage,
  gameStart : StartGame,
  drawCard : DrawCard,
  moveCard : MoveCard,
  attackCard : AttackCard,
}



export default GameManager;
