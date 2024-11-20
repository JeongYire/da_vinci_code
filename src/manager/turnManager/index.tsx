import { useGame } from "../../store";
import { DavinciCard, DavinciCardValueType, DavinciGameStatus, DavinciMemory } from "../../types";


/**
 * 
 */

class CardTracker{

    private cardMetadata : DavinciMemory[];
    private myCard : DavinciCard[];
    private myMap : any;
   // private playerCard : DavinciCard[];

    
    constructor(){
       this.cardMetadata  = [];
       this.myCard = [];
       this.myMap = {}
       //this.playerCard = [];
    }

    /**
     * 카드에 있는 숫자의 경우의수를 전부 구해서 배열로 리턴합니다...
     * @returns 경우의수 배열
     */
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

    /**
     * 상대카드. 즉 플레이어의 카드에대해 얼마나 기억하고있는지 필요한 metaData의 초기화 함수입니다.
     * 
     */
    private initMetaData(){
        const gameStorage = useGame.getState();
        const playerCards = gameStorage.cardInfomation.player;
        let length = playerCards.length;
        for(let i = 0; i < length; i++){
            this.cardMetadata.push({
                id : playerCards[i].id,
                recentIndex : i,
                candidateValue : this.initCandidateValue(),
                isDetect : false,
            })
        }
    }

    private makingMap<T>(array:T[],search : ((item : T) => string )| null = null){
        return array.reduce((map: any, item) => {
            const key = search != null ? search(item) : `${item}`;

            if (!map[key]) {
                map[key] = 1;
            } else {
                map[key] += 1;
            }
            return map;
        }, {});  
    }

    private makingMyMap(){
        this.myMap = this.makingMap<DavinciCard>(this.myCard,(obj : DavinciCard) => {
            return `${obj.valueInfo.value}`;
        })
    }

    /**
     * 정보가 전부 업데이트된후 사용되는 정리함수입니다...
     */
    private doOptimization(target : DavinciMemory){

        /**
         * 본인, 즉 컴퓨터가 갖고있는 카드는 상대카드의 
         * 먼저 중복되는 배열이 있는지 체크해서 삭제합시다...
         */
        const {myMap} = this;

        for (const key in myMap) {

            const check = target.candidateValue.findIndex(obj => `${obj}` == key) > -1;
            if(!check) continue;

            for(let i = 0; i < myMap[key]; i++){
                let findIndex = target.candidateValue.findIndex(obj => `${obj}` == key);
                if(findIndex > -1){
                    target.candidateValue.splice(findIndex,1);
                }else{
                    break;
                }
            }
        }

    }

    /**
     * metaData 배열을 업데이트할때 사용하는 함수입니다...
     * 1,3,4,5
     * 1,2,3,4,5
     */
    private updateMetaData(playerCard : DavinciCard[],playerCardLength : number){
        for(let i = 0; i < playerCardLength; i++){
            if(this.cardMetadata[i] == undefined || this.cardMetadata[i].id != playerCard[i].id){
                console.log("변경된 감지 undeinfed 인덱스 : " + i);

                let newValue = {
                    id : playerCard[i].id,
                    recentIndex : i,
                    candidateValue : this.initCandidateValue(),
                    isDetect : playerCard[i].isDetect,  
                };
       
                this.cardMetadata.splice(i,0,newValue)
                this.doOptimization(newValue);
                break;
            }
            if(this.cardMetadata[i].isDetect != playerCard[i].isDetect){
                console.log("변경된 감지 isDetect 인덱스 : " + i);
                this.cardMetadata[i].isDetect = playerCard[i].isDetect;
                break;
            }
        }

        /*
        console.log("-- 변경됨 --");
        console.log(playerCard);
        console.log(this.cardMetadata);
        */

    }
    initTracker(){
        this.initMetaData();
        this.updateEnemyCard();
        let length = this.cardMetadata.length;
        for(let i = 0; i < length; i++){
           this.doOptimization(this.cardMetadata[i]);
        }
    }

    updateMemory(){
        this.updatePlayerCard();
        this.updateEnemyCard();
    }

    private updatePlayerCard(){
        const gameStorage = useGame.getState();
        const playerCards = gameStorage.cardInfomation.player;
        let playerCardLength = playerCards.length;
        if((this.cardMetadata.length != playerCardLength) || playerCards.findIndex(obj => obj.isDetect == true) != -1){
            console.log("플레이어 카드의 변화가 감지됐어요! 업데이트를 실행합니다...");
            this.updateMetaData(playerCards,playerCardLength);
        }
    }

    private updateEnemyCard(){
        const gameStorage = useGame.getState();
        const myCard = gameStorage.cardInfomation.enemy;
        if(this.myCard.length != myCard.length){
            console.log("에너미 카드의 변화가 감지됐어요! 업데이트를 실행합니다...");
            this.myCard = myCard;
            this.makingMyMap();
        }
    }


    private acting(){

    }

}

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
    private tracker : CardTracker

    constructor(){
        this.attackSystem = new AttackSystem();
        this.tracker = new CardTracker();
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
        console.log("게임스타트");
        this.tracker.initTracker();
    }

    turnChange(status : DavinciGameStatus){
        console.log(`현재 턴 : ${status}`);
        this.tracker.updateMemory();
    }


}




const TurnManager = new TurnSystemManager();

export default TurnManager;