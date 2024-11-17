import { useGame } from "../store";
import GameManager from "../manager";
import InfomationMessage from "./infomationMessage";
import InfomationSystem from "./infomationSystem";


function InfomationTable() {

  console.log("InfomationTable");

  return (
    <div style={{
        display : "flex",
        flexDirection : "column",
        flexGrow : 1,
        justifyContent : "center",
        alignItems : "center"
    }}>
        <InfomationMessage />
        <InfomationSystem/>
    </div>
  )
}

export default InfomationTable
