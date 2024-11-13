import { useContext, useRef } from "react"
import { DavinciCard } from "./types";


type GameInfomation = {
  cardArray : DavinciCard[],
}

function GameScreen(props : { children : any }) {


  let gameInfomation = useRef<GameInfomation>({
    cardArray : [],
  });



  return (
    <div style={{
      display : "flex",
    }}>
      {
        props.children
      }
    </div>
  )
}

export default GameScreen
