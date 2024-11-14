import { useContext, useRef } from "react"
import { DavinciCard } from "./types";


function GameScreen(props : { children : any }) {

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
