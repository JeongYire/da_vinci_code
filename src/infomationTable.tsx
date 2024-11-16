
import { useEffect } from "react";
import {useGame} from "./store/index";
import GameManager from "./manager";


function InfomationTable() {

  console.log("InfomationTable");

  const status = useGame(state => state.gameInfomation.status);
  const deckCard = useGame((state) => state.cardInfomation.deck);


  return (
    <div style={{
        display : "flex",
        flexDirection : "column",
        flexGrow : 1,
        justifyContent : "center",
        alignItems : "center"
    }}>
        <h3>{GameManager.getStatus(status)}</h3>
        {
          <>
            {
              status == "playerDrawTurn" ? 
              
                <>
                  <h4>남은 카드 : {deckCard.length}</h4>
                  <button onClick={() => GameManager.drawCard("player")}>카드뽑기</button>
                </>
              : <></>
            }
          </> 
        }
    </div>
  )
}

export default InfomationTable
