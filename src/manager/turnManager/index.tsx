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
     * 
     * --- 
     * 어떻게해도 동기화시점에서 논리가 꼬이니까 
     * 그냥 아예 공격턴. 그니까 생각해야될 턴에 생각함수를 사용시키자. 그럼 꼬일일도 없을거다. 
     * ---
     */

    private cardMetadata : DavinciMemory[];
    private enemyCard : DavinciCard[];
    private playerCard : DavinciCard[];

    constructor(){
       this.cardMetadata  = [];
       this.enemyCard,this.playerCard = [];
    }

    updateMemory(){
        this.playerCard = useGame.getState().cardInfomation.player;
        this.enemyCard = useGame.getState().cardInfomation.enemy;
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
        return array;
    }

    /**
     * 상대카드. 즉 플레이어의 카드에대해 얼마나 기억하고있는지 필요한 metaData의 초기화 함수입니다.
     * 
     */
    private initMetaData(){
        let length = this.playerCard.length;
        for(let i = 0; i < length; i++){
            this.cardMetadata.push({
                id : this.playerCard[i].id,
                recentIndex : i,
                candidateValue : this.initCandidateValue(true),
                isDetect : false,
                realValue : this.playerCard[i].valueInfo.value,
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
        
        return this.makingMap<DavinciCard>(myCard,(obj : DavinciCard) => {
            return `${obj.valueInfo.value}`;
        })
    }

    /**
     * 정보가 전부 업데이트된후 사용되는 정리함수입니다...
     */

    private synchronization(myMap : any,candidateValue : DavinciCardValueType[]){
        for (const key in myMap) {

            /**
             * myMap의 숫자 갯수대로 없어야합니다...
             * 예시 : myMap[key] 가 1일경우 searchLength는 1이나와야한다... 
             * 예시 : myMap[key] 가 2일경우 searchLength는 0이나와야한다... 
             */
            while(true){
                let search = candidateValue.filter(obj => `${obj}` == key);
                if(search.length == (2-myMap[key])){
                    break;
                }

                let findIndex = candidateValue.findIndex(obj => `${obj}` == key);
                if(findIndex > -1){
                    candidateValue.splice(findIndex,1);
                }else{
                    break;
                }
            }

        }
    }
    

    private synchronizeEnemyCardMetaData(){


        console.log("synchronizeEnemyCardMetaData");
        /**
         * 본인, 즉 컴퓨터가 갖고있는 카드는 상대카드의 
         * 먼저 중복되는 배열이 있는지 체크해서 삭제합시다...
         */
        let myMap = this.makingMyMap(this.enemyCard);

  
        let length = this.cardMetadata.length;

        for(let i = 0; i < length; i++ ){
            this.synchronization(myMap,this.cardMetadata[i].candidateValue);
        }

        console.log([...this.cardMetadata]);

    }

    private initDataStorage(){
        let gameStorage = useGame.getState().cardInfomation;
        this.playerCard = gameStorage.player;
        this.enemyCard = gameStorage.enemy;
    }

    initTracker(){
         /* 이 시점에서 아직 정리되지않음 */
        this.initDataStorage();
        /* 이 시점에도 아직 정리안됨 */
        this.initMetaData();
        /* 이 시점에서 정리됨 */
        this.synchronizeEnemyCardMetaData();
    }
    

    private refreshMetaData(){

        /**
         * 최신 상태의 플레이어카드를 조회해 metaData 보다 많다면 바뀐 요소를 추가합니다. 
         */
        const AddMetaData = () => {
            if(this.cardMetadata.length == this.playerCard.length) return;
            console.log("AddMetaData");
            this.playerCard.map((card,index) => {
                if(this.cardMetadata.findIndex((data) => data.id == card.id) == -1){

                  
                    let addObject : DavinciMemory = {
                        id : card.id,
                        candidateValue : this.initCandidateValue(),
                        isDetect : card.isDetect,
                        realValue : card.valueInfo.value,
                        recentIndex : index,
                    };
                    this.cardMetadata.splice(index,0,addObject)

                }
            })

        }

        /**
         * 최신 상태의 플레이어카드를 조회해 카드 정보를 동기화합니다. 
         */
        const CompareMetaData = () => {
  
            this.playerCard.map((card,index) => {
                if(card.id == this.cardMetadata[index].id){
                    this.cardMetadata[index].isDetect = card.isDetect;
                    if(this.cardMetadata[index].isDetect){
                        this.cardMetadata[index].candidateValue = [this.cardMetadata[index].realValue];
                    }
                }else{
                    console.log("이부분 오류남");
                    throw new Error("오류!!!");
                }
            })
  
        }

        /**
         * 메타데이터끼리의 싱크로를 실행합니다.
         */
        const FilterCandidateValue = () => {

            let isDetectArray = this.cardMetadata.filter(obj => obj.isDetect);
            let detectMap = this.makingMap<DavinciMemory>(isDetectArray,(item) => item.realValue.toString());

            let length = this.cardMetadata.length;
            for(let i = 0; i < length; i++){
                this.synchronization(detectMap,this.cardMetadata[i].candidateValue); 
            }

        }

        /**
         * 약간의 최적화를 실행합니다.
         * 0,1,1,2,2
         * joker,3,4,5 
         */


        console.log("--- META DATA ---")
        console.log([...this.cardMetadata]);

        
        console.log("--- AddMetaData ---")
        AddMetaData();
        console.log([...this.cardMetadata]);
        
        console.log("--- CompareMetaData ---")
        CompareMetaData();
        console.log([...this.cardMetadata]);

        console.log("--- FilterCandidateValue ---")
        FilterCandidateValue();
        console.log([...this.cardMetadata]);
        
        console.log("--- synchronizeEnemyCardMetaData ---")
        this.synchronizeEnemyCardMetaData();
        console.log([...this.cardMetadata]);
        /**
         * 이거 계속실행되면 안되니까 
         */
       // OptimizationCandidateValue();

    }

    /* 플레이어의 카드에서 예측을 해봅니다... */
    doThinking(status : DavinciGameStatus){

        /* 여기다가 압축,정리 그냥 다해버리시오...  */

        console.log("컴퓨터의 생각 시작!!");

        /* metaData 를 살펴봅시다... */
        this.refreshMetaData();
        

      //  let cloneMetaData = [...this.cardMetadata];

        const OptimizationCandidateValue = (metaData : DavinciMemory[]) => {

            const CheckRightToJoker = (index : number,value : DavinciCardValueType) => {
                if(metaData[index+1] == undefined) return undefined;
                let findFilter = metaData[index+1].candidateValue.filter(obj => value <= obj || obj == "joker");
                metaData[index+1].candidateValue = findFilter;
                CheckRightToJoker(index+1,value);
            }

            const CheckLeftToJoker = (index : number,value : DavinciCardValueType) => {
                if(metaData[index-1] == undefined) return undefined;
                let findFilter = metaData[index-1].candidateValue.filter(obj => value >= obj || obj == "joker");
                metaData[index-1].candidateValue = findFilter;
                CheckLeftToJoker(index-1,value);
            }
            

            let length = metaData.length;

            for(let i = 0; i < length; i++){
                if(metaData[i].candidateValue.includes("joker"))continue;

                if(metaData[i].isDetect){
                    CheckLeftToJoker(i,metaData[i].realValue);
                    CheckRightToJoker(i,metaData[i].realValue);
                    continue;
                };

                if(metaData[i].candidateValue[0] < metaData[i].candidateValue[1]){
                    CheckRightToJoker(i,metaData[i].candidateValue[0]);
                    continue;
                };
                
            }

        }

        console.log("OptimizationCandidateValue");
        OptimizationCandidateValue(this.cardMetadata);
 
        // 일단 clone 만드는건 안했는데 로직꼬일거같으면 만들것...

        // 먼저 드러나지않은 요소를 맞추는거니까 filter로 한번 거릅니다...
        let notDetectMetaData = this.cardMetadata.filter(obj => !obj.isDetect);

        if(notDetectMetaData.length == 0){
            console.log("컴퓨터가 이겼다...")
            alert("당신이 졌어요!")
            location.reload();
            return;
        }

        // 그럼 그중 가장 첫번째요소. 즉 제일 값이 적은걸 공격카드로 세웁니다.
        let attackData = notDetectMetaData[0];
        let attackCard = this.playerCard.find(obj => obj.id == attackData.id);

        // undefined가 나올수없습니다.. 나오는순간 그냥 다 꼬인거임 
        if(attackCard == undefined){
            console.log("걍 오류");
            throw new Error("오류라고!!!");
        }

        /*
        if(status == "enemyAttackRetryTurn"){
            let diffLength = attackData.candidateValue.length;
            console.log("difflength : " + diffLength);
            let probability = (1 / diffLength) * 100;
            console.log("probability : " + probability)

            if(probability < 50){
                if(useGame.getState().cardInfomation.deck.length == 0){
                    useGame.getState().gameInfomation.setStatus("playerAttackTurn");
                }else{
                    useGame.getState().gameInfomation.setStatus("playerDrawTurn");
                }
                
                return;
            }
        }
            */
        
        console.log(`컴퓨터가 예측하는 카드 값 : ${attackData.candidateValue.toString()}`);
        console.log(`컴퓨터가 주장한다 : ${attackData.candidateValue[0].toString()}`);
        console.log("컴퓨터가 공격하는 카드 값 ");
        console.log(attackCard);
        let recentCard = useGame.getState().memoryStorage.enemy.recentCard;
        console.log(recentCard);
        const attakcResult = TurnManager.attackCard(recentCard,attackCard,attackData.candidateValue[0],"enemy");
       
        console.log("공격 결과는... 두그두그 :" + attakcResult);

        let attackDataIndex = this.cardMetadata.findIndex(obj =>  obj.id == attackData.id);

        let gameStorage = useGame.getState();

        if(!attakcResult){
            // 실패했다면... 
            console.log("실패했어!!");
            console.log([...attackData.candidateValue]);
            attackData.candidateValue.shift();
            console.log(attackData.candidateValue);
            this.cardMetadata[attackDataIndex].candidateValue = attackData.candidateValue;
        }

        if(attakcResult){
            gameStorage.gameInfomation.setStatus("enemyAttackRetryTurn");
        }else{
            gameStorage.gameInfomation.setStatus("playerDrawTurn");
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
        gameStorage.memoryStorage.enemy.recentCard = undefined;
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
            if(myCard){
                myCard.isDetect = true;
            }
            this.attackSystem.attackFaild(host);       
        }

        useGame.getState().gameInfomation.setLog(`${host == "player" ? "당신은" : "상대방은"} ${targetCard.id}번 카드를 ${attackValue}라고 주장했고. ${attackVaild ? "성공했습니다." : "실패했습니다."}`);

        return attackVaild;
    }

    isGameStart(){
        console.log("게임스타트");
        this.tracker.initTracker();
    }

    turnChange(status : DavinciGameStatus){

        this.tracker.updateMemory();

        if(status=="enemyDrawChoiceTurn"){
            if(useGame.getState().cardInfomation.deck.length == 0){
                useGame.getState().gameInfomation.setStatus("enemyAttackTurn");
            }else{
                this.startEnemyTurn();
            }
        }
        if(status=="enemyAttackRetryTurn" || status=="enemyAttackTurn"){
            this.tracker.doThinking(status);
        }

    }

    private isVaildRange(index : number,recentCard : DavinciCard,cards : DavinciCard[]){
        if(ChoiceManager.isEmpty(recentCard)) return false;
        let recentValue = Number(recentCard.valueInfo.value);
        return ChoiceManager.left(index,cards) <= recentValue && ChoiceManager.right(index,cards) >= recentValue;
    }

    startEnemyTurn(){
        let gameStorage = useGame.getState();

        GameManager.drawCard("enemy");

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
    }


}




const TurnManager = new TurnSystemManager();

export default TurnManager;