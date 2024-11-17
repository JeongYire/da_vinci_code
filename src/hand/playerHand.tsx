import React from "react";
import Card from "../card";
import { useGame } from "../store";
import Hand from "./hand";
import GameManager from "../manager";


function PlayerHand() {
  console.log("PlayerHand");
  const myCard = useGame((state) => state.cardInfomation.player);
  const status = useGame((state) => state.gameInfomation.status);
  const brain = useGame((state) => state.memoryStorage.player);
  const setMessage = useGame((state) => state.gameInfomation.setMessage);

  function choiceAction(index : number){
    if(brain.recentCard == undefined) return;

    console.log("choiceAction");
    console.log(index);

    if(brain.recentCard.valueInfo.value == "joker"){
      GameManager.movementCard(myCard,brain.recentCard,index,"player");
      return;
    }
    /**
     *  생각해보니까 카드 더 뽑았을때 왼쪽이나 오른쪽카드가 조커일경우를 상정못함... 
     */

    setMessage("거긴 못가요!!!!!");
    return;
    if(index-1 < 0){
      console.log("왼쪽 끝자락");
      if(myCard[index].valueInfo.value >= brain.recentCard.valueInfo.value){
        GameManager.movementCard(myCard,brain.recentCard,index,"player");
        return;
      }
      setMessage("거긴 못가요!!!!!");
      return;
    }

    if(myCard.length <= index){
      console.log("오른쪽 끝자락");
      if(myCard[index-1].valueInfo.value <= brain.recentCard.valueInfo.value){
        GameManager.movementCard(myCard,brain.recentCard,index,"player");
        return;
      }
      setMessage("거긴 못가요!!!!!");
      return;
    }

    let recentCardValue = brain.recentCard.valueInfo.value;
    let myCardLeftValue = myCard[index-1].valueInfo.value;
    let myCardRightValue = myCard[index].valueInfo.value;

    if(myCardLeftValue <= recentCardValue && myCardRightValue >= recentCardValue){
      GameManager.movementCard(myCard,brain.recentCard,index,"player");
    }

  }

  return (
    <Hand key={"playerHand"}>
        {
          myCard.map((obj,index) => {
            return <Card key={obj.id} isDetect={obj.isDetect} isOpen={true} color={obj.valueInfo.color} value={obj.valueInfo.value} id={obj.id}>
                  {
                  index == 0 ? 
                
                    status == "playerChoiceTurn" ? 
                    <span 
                    onMouseOver={(obj) => {obj.currentTarget.style.color = "red";}} 
                    onMouseOut={(obj) => {obj.currentTarget.style.color = "black";}} 
                    onClick={() => {
                      choiceAction(0);
                    }}
                    style={{
                        position:"relative",
                        fontSize : 20,
                        bottom : 6.5,
                        right : 10,
                        cursor:"pointer",
                    }}>
                        △
                    </span> : <React.Fragment/>

                  : <React.Fragment/>
                }
                {
                  status == "playerChoiceTurn" ?
                    <span 
                    key={`${obj.id}_`}
                    onMouseOver={(obj) => {obj.currentTarget.style.color = "red";}} 
                    onMouseOut={(obj) => {obj.currentTarget.style.color = "black";}} 
                    onClick={() => {
                      choiceAction(index+1);
                    }}
                    style={{
                        position:"absolute",
                        fontSize : 20,
                        bottom : -20,
                        right : -10,
                        cursor:"pointer",
                    }}>
                        △
                    </span>
                    : <React.Fragment/>
                }
              </Card> 
          })
        }
    </Hand>
  )
}

export default PlayerHand
