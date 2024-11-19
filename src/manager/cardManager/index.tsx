import { useGame } from "../../store";
import { DavinciCard, DavinciCardHostType, DavinciCardInfomation } from "../../types";

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

    // 카드수는 26장입니다.
    const CARD_COUNT = 26;

    // 카드의 숫자는 조커를 제외하면 0~11입니다.
    const VALUE_COUNT = 12;


    class CardManager{

        private createCardValue(){
            const valueArray = new Array<DavinciCardInfomation>(CARD_COUNT);
        
            // 우선 검은색 카드를 만듭니다.
            for(let i = 0; i < VALUE_COUNT; i++){
            valueArray[i] = {
                color : "black",
                value : i,
            };
            }
        
            // 검은색 조커를 만듭니다...
            valueArray[VALUE_COUNT] = {
            color : "black",
            value : "joker",
            };
        
            // 그리고 흰색 카드를 만듭니다.
            for(let i = 0; i < VALUE_COUNT; i++){
            valueArray[i + 13] = {
                color : "white",
                value : i,
            };
            }
        
            // 마지막으로 흰색 조커를 만듭니다... 
            // 당연히 인덱스는 0부터 시작이니 카드수에서 1을 빼야됩니다...
            valueArray[CARD_COUNT - 1] = {
            color : "white",
            value : "joker",
            };
        
        return valueArray;
        }

        private suffleCard(valueArray : DavinciCardInfomation[]){
        
            let index = 0;
            let arrayLength = valueArray.length;
        
            let cardArray : DavinciCard[] = new Array(CARD_COUNT);
        
            while(true){
        
            // 우선 랜덤한 수를 만듭니다. 이 숫자는 valueArray의 길이에따라 범위가 변합니다.
            let randomCount = Math.floor(Math.random() * arrayLength);
        
            // 랜덤한 수는 인덱스에 포함되니 거기다가 넣습니다.. 이렇게되면 id는 순서대로지만 value값은 랜덤이됩니다...
            cardArray[index] = {
                host : "deck",
                isOpen : false,
                isDetect : false,
                id : index,
                valueInfo : valueArray[randomCount],
            }
        
            // 값이 중복이 되면 안되므로 지워버립니다... 
            valueArray.splice(randomCount,1);
        
            index++;
            arrayLength = valueArray.length;
        
            if(index >= CARD_COUNT){
                break;
            }
            }
        
            console.log("결과 나옴");
            console.log(cardArray);
        
            return cardArray;
        }

        private sortCard(array : DavinciCard[],target : DavinciCardHostType){
            array.sort((a,b) => {
                if(a.valueInfo.value > b.valueInfo.value){
                    return target == "player" ? 1 : -1;
                }
                if(a.valueInfo.value < b.valueInfo.value){
                    return target == "player" ? -1 : 1;
                }
        
                // 숫자가 같다면 색깔만 다르단건데. 규칙상 뭐가 먼저가도 상관없으니 그냥 검은색을 뒤에둡니다.
                if(a.valueInfo.color == "black"){
                    return 1;
                }else{
                    return -1;
                }
                
            })
        }

        createCard(){
            const valueArray = this.createCardValue();
            return this.suffleCard(valueArray);
        }

        private getRandom(count : number){
            return Math.floor(Math.random() * count);
        }

        private isEmpty(target : DavinciCard[] | DavinciCard | undefined){
            return target == undefined;
        }

        draw(isVaild : (value : DavinciCard) => boolean = () => true,totalLoopCount : number = 1){

            let gameStorage = useGame.getState();
            let deck = gameStorage.cardInfomation.deck;
            let valueArray : DavinciCard[] = [];

            let loopCount = 0;
            while(true){

                let randomCount = this.getRandom(deck.length);
                let targetCard =  deck[randomCount];
                if(!isVaild(targetCard)){
                    console.log("JOKER");
                    continue;
                };

                deck.splice(randomCount,1)
                loopCount += 1;

                valueArray.push(targetCard);

                if(loopCount == totalLoopCount){
                    break;
                }
            }


            return valueArray;
        }

        move(index : number,host : "player" | "enemy" = "player"){

            let gameStorage = useGame.getState();
            let playerCard = gameStorage.cardInfomation.player;
            let card = gameStorage.memoryStorage.player.recentCard;
            if(this.isEmpty(card)) return;
            playerCard.splice(index,0,card);
            gameStorage.cardInfomation.setPlayer(playerCard);
            gameStorage.gameInfomation.setStatus("playerAttackTurn");

        }

        /* 처음 시작시 카드매니저에게 카드배분을 부탁합니다... */
        dealCard(){
           
            const playerCard = this.draw((obj => obj.valueInfo.value != "joker"),4);
            playerCard.map(obj => obj.host = "player");
            this.sortCard(playerCard,"player");
            const enemyCard = this.draw((obj => obj.valueInfo.value != "joker"),4);
            enemyCard.map(obj => obj.host = "enemy");
            this.sortCard(enemyCard,"enemy");

            let gameStorage = useGame.getState().cardInfomation;
            gameStorage.player = playerCard;
            gameStorage.enemy = enemyCard;

        }

    }

    export default (new CardManager());



  