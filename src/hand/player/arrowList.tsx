import { useEffect, useRef } from "react";
import Card from "../../card";
import { useGame } from "../../store";
import { DavinciCard } from "../../types";
import GameManager from "../../manager";


class ChoiceManager{

    isEmpty(target : DavinciCard | undefined){return target == undefined};
    isJoker(target : DavinciCard){return target.valueInfo.value == "joker"};

    left(targetIndex : number,targetArray : DavinciCard[]) : number{
        console.log("left 함수 사용");
        let target = targetArray[targetIndex-1];
        if(this.isEmpty(target)){
        /* 카드의 숫자는 0~11 이기때문에 -1로합니다.. -99로하든 -999로하든 상관없음 나중에 값체크할때 true가 나오는게 목적이라*/
        console.log(`결과  : -1`);
        return -1;
        };
        if(this.isJoker(target)) return this.left(targetIndex-1,targetArray);
        console.log(`결과  : ${target.valueInfo.value}`);
        return Number(target.valueInfo.value);
    }

    right(targetIndex : number,targetArray : DavinciCard[]) : number{
        console.log("right 함수 사용");
        let target = targetArray[targetIndex];
        if(this.isEmpty(target)){
        /* 카드의 숫자는 0~11 이기때문에 12로합니다.. 99로하든 999로하든 상관없음 나중에 값체크할때 true가 나오는게 목적이라*/
        console.log(`결과  : 12`);
        return 12;
        };
        if(this.isJoker(target)) return this.right(targetIndex+1,targetArray);
        console.log(`결과  : ${target.valueInfo.value}`);
        return Number(target.valueInfo.value);
    }

}
  
class PlayerCardManager{
    cards: DavinciCard[];
    recentCard: DavinciCard | undefined;
    choiceManager : ChoiceManager;

    constructor(){

        //update 함수써도 eslint가 오류띄워서 그냥 여기다함 
        const gameStorage = useGame.getState();
        this.cards = gameStorage.cardInfomation.player;
        this.recentCard = gameStorage.memoryStorage.player.recentCard;
        this.choiceManager = new ChoiceManager();

    }

    update() {
        const gameStorage = useGame.getState();
        this.cards = gameStorage.cardInfomation.player;
        this.recentCard = gameStorage.memoryStorage.player.recentCard;
    }

    private isVaildRange(index : number,recentCard : DavinciCard){
        if(this.choiceManager.isEmpty(recentCard)) return false;
        let recentValue = Number(recentCard.valueInfo.value);
        return this.choiceManager.left(index,this.cards) <= recentValue && this.choiceManager.right(index,this.cards) >= recentValue;
    }

    choice(index : number){ 
        console.log("CHOICE");
        console.log(this.cards);
        console.log(this.recentCard);
        const {recentCard} = this;
        if(this.choiceManager.isEmpty(recentCard)) return false;
        if(this.choiceManager.isJoker(recentCard)) return true;
        return this.isVaildRange(index,recentCard);
    }
}

const ArrowList = () => {

    const status = useGame((state) => state.gameInfomation.status);
    const setMessage = useGame((state) => state.gameInfomation.setMessage);
    const manager = useRef<PlayerCardManager>(new PlayerCardManager());

    function choiceAction(index : number){
        const gameStorage = useGame.getState();
        const myCard = gameStorage.cardInfomation.player;
        const recentCard = gameStorage.memoryStorage.player.recentCard;
        if(manager.current.choice(index)){
            GameManager.moveCard(myCard,recentCard,index,"player")
        }else{
            setMessage("거기에 둘 수 없어요!");
        }
    }

    if(status == "playerChoiceTurn") manager.current.update();

    return (
        <div style={{
            width : "100%",
            height : "100%",
            position : "absolute",
            display : "flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
        {
            status == "playerChoiceTurn" ?
            (
                (
                    () => {
                        let elements = [];
                        let length = useGame.getState().cardInfomation.player.length + 1;
                        for(let index = 0; index < length; index++){
                            elements.push(<div key={`${index}_arrow_div`} style={{
                                width:60,
                                height:80,
                                textAlign:"center",
                            }}>
                                <span 
                                    key={`${index}_arrow_span`}
                                    onMouseOver={(obj) => {obj.currentTarget.style.color = "red";}} 
                                    onMouseOut={(obj) => {obj.currentTarget.style.color = "black";}} 
                                    onClick={() => {
                                        choiceAction(index);
                                    }}
                                    style={{
                                        display : "inline-block",
                                        cursor : "pointer",
                                        width : 20,
                                        height : 20,
                                        textAlign:"center",
                                        position:"relative",
                                        top:"100%",
                                    }}>
                                        △
                                </span>
                            </div>);
                        }
                        return elements;
                    }
                )()
            ) : <></>
        }
        </div>
    )
    
}



export default ArrowList;