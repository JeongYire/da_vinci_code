import { useGame } from "../../store";
import { DavinciCard, DavinciCardHostType, DavinciCardValueType } from "../../types";



class AttackSystem{

    private playerAttackSuccess(){
        const gameStorage = useGame.getState();
        gameStorage.memoryStorage.player.choiceCard = undefined;
        gameStorage.cardInfomation.setEnemy(gameStorage.cardInfomation.enemy);
    }

    private enemyAttackSuccess(){
        const gameStorage = useGame.getState();
        gameStorage.memoryStorage.player.choiceCard = undefined;
        gameStorage.memoryStorage.player.recentCard = undefined;
        gameStorage.cardInfomation.setPlayer(gameStorage.cardInfomation.player);
    }

    attackSuccess(host : "player" | "enemy"){

        switch (host) {
            case "player":
                this.playerAttackSuccess();
                break;
            case "enemy":
                this.enemyAttackSuccess();
                break;
        }
        
    }

    attackFaild(host : "player" | "enemy"){

        switch (host) {
            case "player":
                this.enemyAttackSuccess();
                break;
            case "enemy":
                this.playerAttackSuccess();
                break;
        }

    }

}


class TurnSystemManager{

    private attackSystem : AttackSystem;

    constructor(){
        this.attackSystem = new AttackSystem();
    }

    attackCard(myCard : DavinciCard,targetCard : DavinciCard,attackValue : DavinciCardValueType,host : "player" | "enemy"){
        const attackVaild = targetCard.valueInfo.value == attackValue;

        if(attackVaild){
            targetCard.isDetect = true;
            this.attackSystem.attackSuccess(host);
        }else{
            myCard.isDetect = true;
            this.attackSystem.attackFaild(host);       
        }

        return attackVaild;
    }

}

const TurnManager = new TurnSystemManager();

export default TurnManager;