import { useGame } from "../../store";
import { DavinciCard, DavinciCardValueType, DavinciGameStatus, DavinciMemory } from "../../types";


/**
 * 공격과 관련된 행동을 제어하는 클래스 입니다.. 
 */ 
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

/**
 * 턴에 관련된 행동을 제어하는 클래스 입니다.. 
 */ 
class TurnSystemManager{

    private attackSystem : AttackSystem;
    private enemySystem : EnemyManager

    constructor(){
        this.attackSystem = new AttackSystem();
        this.enemySystem = new EnemyManager();
    }



    attackCard(myCard : DavinciCard,targetCard : DavinciCard,attackValue : DavinciCardValueType,host : "player" | "enemy") {
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

    isGameStart(){
        this.enemySystem.initMemory();
    }

    turnChange(status : DavinciGameStatus){
        console.log(`현재 턴 : ${status}`);
        if(status == "playerAttackTurn"){
            this.enemySystem.updateMemory();
        }
        if(status == "enemyTurn"){

        }
    }

    updateMemory(){
        this.enemySystem.updateMemory();
    }

}

type EnemyMapType<T extends (number | "joker")> = {
    [key in T] : number
}

type EnemyMap = EnemyMapType<DavinciCardValueType>;

/**
 * 
 */

class EnemyManager{

    private brain : DavinciMemory[];
    private cards : DavinciCard[];
    private myMap : EnemyMap;

    constructor(){
       this.brain  = [];
       this.cards = [];
       this.myMap = {
        "joker" : 0,
       }
    }

    private initCandidateValue(){
        let recentValue = -1;
        let targetValue = 0;
        let array : DavinciCardValueType[] = [];
        
        while(true){
            array.push(targetValue == 12 ? "joker" : targetValue);
            if(targetValue == recentValue){
                targetValue += 1;
            }else{
                recentValue = targetValue;
            }
   
            if(targetValue == 13){
                break;
            }
        }

        return array;
    }

    private initBrain(){
        const gameStorage = useGame.getState();
        const playerCards = gameStorage.cardInfomation.player;
        let length = playerCards.length;
        for(let i = 0; i < length; i++){
            this.brain.push({
                id : playerCards[i].id,
                recentIndex : i,
                candidateValue : this.initCandidateValue()
            })
        }
        this.updateMemory();
    }

    private makingMap(){
        this.myMap = this.cards.reduce((map : any, item) => {

            let target = map[`${item.valueInfo.value}`];
            if(!target){
                map[`${item.valueInfo.value}`] = 1;
            }else{
                map[`${item.valueInfo.value}`] += 1;
            }
            return map;
        }, {});
    }

    /**
     * 정보가 전부 업데이트된후 사용되는 생각함수입니다...
     */
    private doThink(target : DavinciMemory){
        /**
         * 먼저 중복되는 배열이 있는지 체크해서 삭제합시다...
         */
        let loopCount = 0;

        console.log(this.myMap);
  
    }

    initMemory(){
        this.initBrain();
        this.doThink(this.brain[0]);
    }

    updateMemory(){
        const gameStorage = useGame.getState();
        const myCard = gameStorage.cardInfomation.enemy;
        this.cards = myCard;
        this.makingMap();
    }
    
    private acting(){

    }

}

const TurnManager = new TurnSystemManager();

export default TurnManager;