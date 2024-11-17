import GameManager from "../../manager";
import { useGame } from "../../store";


function InfomationSystem() {

 
  const status = useGame(state => state.gameInfomation.status);
  const deckCard = useGame((state) => state.cardInfomation.deck);
  const playerMemory = useGame((state) => state.memoryStorage.player);


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
        : null
      }
    </> 
  )
}

export default InfomationSystem
