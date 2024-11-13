import { useContext } from "react"
import { useGameProcess } from "./store";

function ToolScreen() {
   console.log("ToolScreen");

   const gameStart = useGameProcess(state => state.gameStartAction);

  return (
    <div style={{
        width : 200,
        height : 600,
        borderWidth : 1,
        borderColor : "black",
        borderStyle: "groove",
        display : "flex",
        flexDirection : "column",
        textAlign : "center"
    }}>
       <h2>
          게임시작
       </h2>
       <button onClick={gameStart}>게임시작</button>
       <h2>
          게임리셋
       </h2>
       <button onClick={() => {}}>게임리셋</button>
       {
      /*
        <h2>
          로그
       </h2>
       <button>게임시작</button>
       */
       }
    </div>
  )
}

export default ToolScreen
