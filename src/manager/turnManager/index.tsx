import GameManager from "..";
import { useGame } from "../../store";
import { DavinciCard, DavinciCardValueType, DavinciGameStatus, DavinciMemory } from "../../types";
import { ChoiceManager } from "../choiceManager";


/**
 * 
 */

class CardTracker{

    /**
     * 생각을 다르게 해봐야할듯... 이러니까 예측값이 최적화가 됐는지 안됐는지 구분이 안간다. 
     * 도중에 숫자가 드러났을경우 발생할 헤프닝이 예측이 안됨... 
     * 우선 경우의수가 최신상태로 바뀔수있는 시점이 필요하다...
     * 
     * 1. isDetect 가 드러난경우
     * 2. 내 패가 늘어난경우 
     * 
     * 이 두개를 보고 생각해보자...
     */

    private cardMetadata : DavinciMemory[];
    private myMap : any;
    private myCard : DavinciCard[];



    
    constructor(){
       this.cardMetadata  = [];
       this.myMap = {}
       this.myCard = [];
    }

    /**
     * 카드에 있는 숫자의 경우의수를 전부 구해서 배열로 리턴합니다...
     * @returns 경우의수 배열
     */
    private initCandidateValue(isStart : boolean = false){
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
   
            /** 첫턴에는 조커가 뽑히지 않기에 이렇게 줄여버립니다... */
            if(targetValue == (isStart ? 12 : 13)){
                break;
            }
        }
        !isStart ? this.doSynchronizationCard(array) : null;
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
                candidateValue : this.initCandidateValue(true),
                isDetect : false,
                realValue : playerCards[i].valueInfo.value,
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

    private makingMyMap(myCard : DavinciCard[]){
        this.myMap = this.makingMap<DavinciCard>(myCard,(obj : DavinciCard) => {
            return `${obj.valueInfo.value}`;
        })
    }

    /**
     * 정보가 전부 업데이트된후 사용되는 정리함수입니다...
     */
    private doSynchronizationCard(candidateValue : DavinciCardValueType[], count : number = 0){

        /**
         * 본인, 즉 컴퓨터가 갖고있는 카드는 상대카드의 
         * 먼저 중복되는 배열이 있는지 체크해서 삭제합시다...
         */
        const {myMap} = this;

        console.log("doSynchronizationCard");

        for (const key in myMap) {

            /**
             * myMap의 숫자 갯수대로 없어야합니다...
             * 예시 : myMap[key] 가 1일경우 searchLength는 1이나와야한다... 
             * 예시 : myMap[key] 가 2일경우 searchLength는 0이나와야한다... 
             */
            let search = candidateValue.filter(obj => `${obj}` == key);
            let searchLength = search.length;
            const check = searchLength > 0 && (2-myMap[key]) < searchLength;
            if(!check) continue;

            console.log("CHECK!");
            console.log(candidateValue);

            while(true){
                let findIndex = candidateValue.findIndex(obj => `${obj}` == key);
                if(findIndex > -1){
                    candidateValue.splice(findIndex,1);
                }else{
                    console.log("못찾겠다");
                    break;
                }
                let search = candidateValue.filter(obj => `${obj}` == key);
                if(search.length == (2-myMap[key])){
                    console.log("doSynchronizationCard 1단계 걸러짐");
                    break;
                }
            }

            console.log("CHECK END!");
            console.log(candidateValue);
 
        }

        /**
         * 왼쪽거가 조커가 아니라면 걸러낼수있는 방법이 하나 더 있습니다.
         * 배열은 오름차순이기때문에 다음에 올 인자는 더 커지거나 같은 숫자라는게 됩니다. 
         * 같은 숫자가 아닐경우 무조건 큰 숫자가 온단거죠. 그럼 이전 인자의 후보군의 가장 작은숫자는 현재 인자의 후보군에서 제외 할 수 있습니다. 
         */

        if(count > 0){
            /**
             * 우선 조커가 있는지부터 확인합니다. 있으면 후보군에서 제외합니다... 
             */

            let leftTargetObject = this.cardMetadata[count - 1];
            let leftTarget = leftTargetObject.candidateValue;
            if(!( leftTarget.includes("joker") )){
                /**
                 * 이제 같은숫자가 있는지 확인합니다. 가장 작은숫자만 비교할거기때문에 index 0이면 됩니다.
                 */
                let loopCount = count;
                if(leftTarget[0] < leftTarget[1]){
                   
                    
                    /* 만약 있다면 이전배열빼고 전부 없애버려야합니다... */
                    while(true){

                        if(this.cardMetadata[loopCount] == undefined){
                            break;
                        }

                        let leftTargetIndex = this.cardMetadata[loopCount].candidateValue.findIndex(obj => obj == leftTarget[0]);
                        if(leftTargetIndex != -1){
                            this.cardMetadata[loopCount].candidateValue.splice(leftTargetIndex,1);
                            console.log("doOptimization 2단계 걸러짐 :" + leftTarget[0]);
                        }

                        loopCount += 1;
                    }
                }
            }
 
        }

 
   
    }

    /**
     * metaData 배열을 업데이트할때 사용하는 함수입니다...
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
                    realValue : playerCard[i].valueInfo.value, 
                };
       
                /* 이걸 잠시 중단합니다.. */
                //this.doSynchronizationCard(newValue.candidateValue);
                this.cardMetadata.splice(i,0,newValue)
                
                break;
            }
            if(this.cardMetadata[i].isDetect != playerCard[i].isDetect){
                console.log("변경된 감지 isDetect 인덱스 : " + i);
                this.cardMetadata[i].isDetect = playerCard[i].isDetect;
                this.cardMetadata[i].candidateValue = [this.cardMetadata[i].realValue];
                this.isDetectOptimization(i,this.cardMetadata[i].realValue);
            }
        }


    }

    private isDetectOptimization(index : number,realValue : DavinciCardValueType){

        /**
         * 만약 isDetect, 즉 밝혀진 상태라면 무조건 제외합니다... 
         */
        let loopCount = 0;
        while(true){
            let target = this.cardMetadata[loopCount];

            if(target == undefined) break;
            if(loopCount != index){

                let findIndex = target.candidateValue.findIndex(obj => obj == realValue);

                if(findIndex > -1){
                    this.cardMetadata[loopCount].candidateValue.splice(findIndex,1);
                    console.log("IS DETECT 작업을 통해 걸러짐");
                }

            }
 
            loopCount += 1;
        }
    }
    initTracker(){
        /* 이 시점에서 아직 정리되지않음 */
        this.initMetaData();
        /* 이 시점에도 아직 정리안됨 */
        this.updateEnemyCard();
        /* 이 시점에서 정리됨 */
        let length = this.cardMetadata.length;
        for(let i = 0; i < length; i++){
           this.doSynchronizationCard(this.cardMetadata[i].candidateValue,i);
        }
    }

    updateMemory(){
        /* 이제 여기서 정리될게 필요한데... */
        this.updateEnemyCard();
        this.updatePlayerCard();
    }

    private updatePlayerCard(){
        
        const gameStorage = useGame.getState();
        const playerCards = gameStorage.cardInfomation.player;
        let playerCardLength = playerCards.length;

        if((this.cardMetadata.length != playerCardLength) || playerCards.findIndex(obj => obj.isDetect == true) != -1){
            this.updateMetaData(playerCards,playerCardLength);
        }

    }

    private updateEnemyCard(){

        const gameStorage = useGame.getState();
        let myCard = gameStorage.cardInfomation.enemy;

        if(myCard.length != this.myCard.length){
            console.log("에너미카드 다름 감지");
            this.myCard = [...myCard];
            this.makingMyMap(this.myCard);

            let length = this.cardMetadata.length;
            for(let i = 0; i < length; i++){
                this.doSynchronizationCard(this.cardMetadata[i].candidateValue,i);
            }
        }


    }

    /* 플레이어의 카드에서 예측을 해봅니다... */
    doThinking(stop : boolean = false){

        console.log("컴퓨터의 생각 시작!!");
        console.log(this.myMap);
        /* metaData 를 살펴봅시다... */
        console.log(this.cardMetadata);

        console.log("STOP으로 인해 멈춰짐")
        if(stop) return;

        let gameStorage = useGame.getState();
        let myRecentCard = gameStorage.memoryStorage.enemy.recentCard as DavinciCard;

        console.log(myRecentCard);
        //TurnManager.attackCard(recentCard)

       //

        // 먼저 드러나지않은 요소를 맞추는거니까 filter로 한번 거릅니다...
        let notDetectMetaData = this.cardMetadata.filter(obj => !obj.isDetect);

        if(notDetectMetaData.length == 0){
            console.log("컴퓨터가 이겼다...")
            alert("당신이 졌어요!")
            location.reload();
            return;
        }

        console.log("notDetectMetaData ");
        console.log([...notDetectMetaData]);

        /*
        // 그 다음 Math.min 으로 가장 길이가 작은 배열을 구합니다...
        let minLength = Math.min(...(notDetectMetaData.map(obj => obj.candidateValue.length)));
        console.log(`minLength : ${minLength}`);

        // 이제 그 가장 작은 길이와 같은 배열이 있는지 걸러줍시다...
        notDetectMetaData = notDetectMetaData.filter(obj => obj.candidateValue.length == minLength);
        */

        // 그럼 그중 가장 첫번째요소. 즉 제일 값이 적은걸 공격카드로 세웁니다.
        let attackData = notDetectMetaData[0];
        let attackCard = gameStorage.cardInfomation.player.find(obj => obj.id == attackData.id);

        // undefined가 나올수없습니다.. 나오는순간 그냥 다 꼬인거임 
        if(attackCard == undefined){
            console.log("걍 오류");
            throw new Error("오류라고!!!");
        }
        
        console.log("컴퓨터가 예측하는 카드 값 ");
        console.log(attackData);
        console.log("-- 컴퓨터가 주장하는 예측 값---");
        console.log([...attackData.candidateValue][0]);
        console.log("컴퓨터가 공격하는 카드 값 ");
        console.log(attackCard);
        const attakcResult = GameManager.attackCard(myRecentCard,attackCard,attackData.candidateValue[0],"enemy");
        console.log("공격 결과는... 두그두그 :" + attakcResult);

        let attackDataIndex = this.cardMetadata.findIndex(obj =>  obj.id == attackData.id);
        if(!attakcResult){
            // 실패했다면... 
            attackData.candidateValue.shift();
            this.cardMetadata[attackDataIndex].candidateValue = attackData.candidateValue;
        }else{
            // 성공했다면...
            console.log("성공!!!");
            this.doThinking();
        }
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
        if(status=="enemyDrawChoiceTurn"){
            this.startEnemyTurn();
        }
    }

    private isVaildRange(index : number,recentCard : DavinciCard,cards : DavinciCard[]){
        if(ChoiceManager.isEmpty(recentCard)) return false;
        let recentValue = Number(recentCard.valueInfo.value);
        return ChoiceManager.left(index,cards) <= recentValue && ChoiceManager.right(index,cards) >= recentValue;
    }

    startEnemyTurn(){
        let gameStorage = useGame.getState();

        /* 먼저 턴을 바꿉니다. */
        //gameStorage.gameInfomation.setStatus("enemyDrawChoiceTurn")
        /* 그리고 카드를 뽑습니다. */
        GameManager.drawCard("enemy");
        /* 뽑힌 카드 를 봅니다.*/
        
        let recentCard = gameStorage.memoryStorage.enemy.recentCard;

        let enemyCard = gameStorage.cardInfomation.enemy; 
        enemyCard.reverse();
        if(recentCard == undefined)return;
    
        if(recentCard?.valueInfo.value != "joker"){
            
            /* 상대패.. 즉 enemyCard는 왼쪽기준으로 가장 큽니다... 그걸 유의하시오 */
 
            if(recentCard == undefined)return;
  
            let count = 0;

            while(true){
                if(this.isVaildRange(count,recentCard,enemyCard)){
                    enemyCard.splice(count,0,recentCard);
                    break;
                }

                if(count == enemyCard.length){
                    console.log("오류!!!!");
                    break;
                }

                count += 1;
            }

        }else{
            console.log("조커네? 아무데나 놓을까?");

            let randomCount = Math.floor(Math.random() * (enemyCard.length+1));
            enemyCard.splice(randomCount,0,recentCard);
        }

        enemyCard.reverse();
        gameStorage.cardInfomation.setEnemy(enemyCard);

        /* 먼저 턴을 바꿉니다. */
        gameStorage.gameInfomation.setStatus("enemyAttackTurn");

        this.tracker.doThinking();
        
    }


}




const TurnManager = new TurnSystemManager();

export default TurnManager;