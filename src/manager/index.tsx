import { create } from "zustand";
import {DavinciCardValueType,DavinciCard, DavinciCardColorType, DavinciCardInfomation, DavinciGameStatus, DavinciCardHostType}from "../types";
import { useGame } from "../store";
import CardManager from "./cardManager";
import TurnManager from "./turnManager";


function DrawCard(target : DavinciCardHostType){

  console.log("DrawCard");

  const card = CardManager.draw()[0];
  
  let gameStorage = useGame.getState();

  /* host 바꾸는걸 GameManager가 할지 CardManager가 할지 고민중... */
  /* 현재는 GameManager가 하고있습니다... */

  if(target == "player"){
    card.host = "player";
    gameStorage.memoryStorage.player.setRecentCard(card);
    gameStorage.gameInfomation.setStatus("playerChoiceTurn");
  }

}

function MoveCard(index : number,target : DavinciCardHostType){
  
  console.log("MoveCard");
  CardManager.move(index);

  // 잠깐 테스트로 DrawTurn으로 바꿈
  useGame.getState().gameInfomation.setStatus("playerAttackTurn");

}

function StartGame(){
  
  const cardArray = CardManager.createCard();

  /*우선 테이블에있는 보드에게 카드를 전부줍시다...*/
  useGame.getState().cardInfomation.deck = cardArray;

  /*카드를 나눠주는 작업을 실행합니다...*/
  CardManager.dealCard();

  /*턴 관리자에게 게임이 시작됐음을 알립니다...*/
  TurnManager.isGameStart();

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

function AttackCard(myCard : DavinciCard,targetCard : DavinciCard,attackValue : DavinciCardValueType,host : "player" | "enemy" = "player"){

  const result = TurnManager.attackCard(myCard,targetCard,attackValue,host);
  const gameStorage = useGame.getState();

  if(host == "player"){
    result ? gameStorage.gameInfomation.setStatus("playerAttackRetryTurn") : gameStorage.gameInfomation.setStatus("enemyDrawChoiceTurn");
    return;
  }

  if(host == "enemy"){
    result ? gameStorage.gameInfomation.setStatus("enemyDrawChoiceTurn") : gameStorage.gameInfomation.setStatus("playerDrawTurn");
    return;
  }

}

const GameManager = {
  getStatusMessage : GetStatusMessage,
  gameStart : StartGame,
  drawCard : DrawCard,
  moveCard : MoveCard,
  attackCard : AttackCard,
  turnChange : (status : DavinciGameStatus) => TurnManager.turnChange(status),
}



export default GameManager;









