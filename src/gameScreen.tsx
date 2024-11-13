import { useContext, useRef } from "react"
import ToolContext from "./context/toolContext"
import { DavinciCard } from "./types";


type GameInfomation = {
  cardArray : DavinciCard[],
}

function GameScreen(props : { children : any }) {

  const gameContext = useContext(ToolContext);
  let gameInfomation = useRef<GameInfomation>({
    cardArray : [],
  });

  gameContext.startGame = () => {


    /**
     * 이거 나중에 함수로 분리해서 할것
     */
    const cardArray : DavinciCard[] = new Array();
    /* 먼저 카드를 만듭니다. */
    for( let i = 0; i < 12; i++ ){
      cardArray.push({
        id : i,
        color : "black",
        isOpen : false,
        value : i,
        host : "board"
      })
    }
    /* 조커는 특별하니 따로 만듭니다.. */
    cardArray.push({
      id : 12,
      color : "black",
      isOpen : false,
      value : "joker",
      host : "board"
    })
    /* 이번엔 하양으로... */
    for( let i = 0; i < 12; i++ ){
      cardArray.push({
        id : i + 13,
        color : "white",
        isOpen : false,
        value : i,
        host : "board"
      })
    }
    /* 조커는 특별하니 따로 만듭니다.. */
    cardArray.push({
      id : 25,
      color : "white",
      isOpen : false,
      value : "joker",
      host : "board"
    })

    console.log(cardArray);

  }

  return (
    <div style={{
      display : "flex",
    }}>
      <ToolContext.Provider value={gameContext}>
      {
        props.children
      }
      </ToolContext.Provider>

    </div>
  )
}

export default GameScreen
