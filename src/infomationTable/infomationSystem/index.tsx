import { MutableRefObject, useRef } from "react";
import GameManager from "../../manager";
import { useGame } from "../../store";


function InfomationSystem() {

 
  const status = useGame(state => state.gameInfomation.status);
  const deckCard = useGame((state) => state.cardInfomation.deck);
  const playerMemory = useGame((state) => state.memoryStorage.player);
  const setMessage = useGame((state) => state.gameInfomation.setMessage);

  const inputRef = useRef<HTMLInputElement>(null);

  function attack(){

    if(!playerMemory.choiceCard){
      setMessage("먼저 카드를 골라주세요!");
      return;
    }

    if(!inputRef.current?.value.trim()){
      setMessage("값을 적어주세요!");
      return;
    }

    if(Number.isNaN(Number(inputRef.current.value)) && (inputRef.current.value.toLowerCase() != "joker" && inputRef.current.value != "-")){
      setMessage("정확한 값을 적어주세요! 0~11의 숫자나 joker 혹은 - 가 들어갈 수 있습니다.");
      return;
    }

    if(inputRef.current.value == "joker" || inputRef.current.value == "-"){
      GameManager.attackCard(playerMemory.choiceCard,"joker");
      return;
    }

    if(!(-1 < Number(inputRef.current?.value) && 12 > Number(inputRef.current?.value))){
      setMessage("정확한 숫자을 적어주세요! 0~11의 숫자가 들어갈 수 있습니다.");
      return;
    }
 
    GameManager.attackCard(playerMemory.choiceCard,Number(inputRef.current?.value));
  }

  return (
    <>
      {
        status == "playerDrawTurn" ? 
        
          <>
            <h4>남은 카드 : {deckCard.length}</h4>
            <button onClick={() => GameManager.drawCard("player")}>카드뽑기</button>
          </>
        : status == "playerChoiceTurn" ?
        <>
          <h4>뽑은 카드값: {playerMemory.recentCard?.valueInfo.value}</h4>
        </> 
        : status == "playerAttackTurn" || status == "playerAttackRetryTurn"?
        <>
          <h4>고른 카드의 아이디값 : {playerMemory.choiceCard?.id ?? "없음"}</h4>
          <div>
            <h3>고른 카드의 값은...</h3>
            <div>
              <input ref={inputRef} type="text"/> 
            </div>
          </div>
          <div>
            <button onClick={() => attack()}>결정</button>
          </div>
          {
            status == "playerAttackRetryTurn" ? 
            <div>
              <button onClick={() => attack()}>턴 종료</button>
            </div> : <></>
          }
        </>
        : null
      }
    </> 
  )
}

export default InfomationSystem
