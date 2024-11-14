
import { useEffect } from "react";
import {useGameProcess} from "./store/index";


function InfomationTable() {

  console.log("InfomationTable");

  const isStart = useGameProcess(state => state.isStart);

  return (
    <div style={{
        display : "flex",
        flexDirection : "column",
        flexGrow : 1,
        justifyContent : "center",
        alignItems : "center"
    }}>
        <h3>안녕하세요! 게임을 시작하시려면 게임 시작 버튼을 눌러주세요...</h3>
        {
          isStart ? 
          <>
            <h4>남은 카드 : 0</h4>
            <button>카드뽑기</button>
          </> 
          : <></>
        }
    </div>
  )
}

export default InfomationTable
