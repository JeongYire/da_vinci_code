import { useRef } from "react";
import { useGame } from "../../../store";
import { DavinciCard } from "../../../types";
import GameManager from "../../../manager";
import ArrowList from "../../../arrowList";
import { ChoiceManager } from "../../../manager/choiceManager";



  
class PlayerCardManager{
    cards: DavinciCard[];
    recentCard: DavinciCard | undefined;

    constructor(){

        //update 함수써도 eslint가 오류띄워서 그냥 여기다함 
        const gameStorage = useGame.getState();
        this.cards = gameStorage.cardInfomation.player;
        this.recentCard = gameStorage.memoryStorage.player.recentCard;
   
    }

    update() {
        const gameStorage = useGame.getState();
        this.cards = gameStorage.cardInfomation.player;
        this.recentCard = gameStorage.memoryStorage.player.recentCard;
    }

    private isVaildRange(index : number,recentCard : DavinciCard){
        if(ChoiceManager.isEmpty(recentCard)) return false;
        let recentValue = Number(recentCard.valueInfo.value);
        return ChoiceManager.left(index,this.cards) <= recentValue && ChoiceManager.right(index,this.cards) >= recentValue;
    }

    choice(index : number){ 
        console.log("CHOICE");
        console.log(index);
        const {recentCard} = this;
        if(ChoiceManager.isEmpty(recentCard)) return false;
        if(ChoiceManager.isJoker(recentCard)) return true;
        return this.isVaildRange(index,recentCard);
    }
}

const PlayerArrowList = () => {

    const status = useGame((state) => state.gameInfomation.status);
    const setMessage = useGame((state) => state.gameInfomation.setMessage);
    const manager = useRef<PlayerCardManager>(new PlayerCardManager());

    function choiceAction(index : number){
        if(manager.current.choice(index)){
            GameManager.moveCard(index,"player");
        }else{
            setMessage("거기에 둘 수 없어요!");
        }
    }

    if(status == "playerChoiceTurn" || status == "playerAttackRetryTurn") manager.current.update();

    return <ArrowList host="player" check={status == "playerChoiceTurn"} onClick={choiceAction}/>;
}



export default PlayerArrowList;