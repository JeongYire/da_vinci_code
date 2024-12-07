import { useGame } from "./store";
import GameManager from "./manager";

function ToolScreen() {
   console.log("ToolScreen");

   const logs = useGame(state => state.gameInfomation.log);


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
       <button onClick={GameManager.gameStart}>게임시작</button>
        <h2>
          로그
       </h2>
       <div>
         {
            logs.map(obj => {
               return <div><span>{obj}</span></div>
            })
         }
       </div>
    </div>
  )
}

export default ToolScreen
