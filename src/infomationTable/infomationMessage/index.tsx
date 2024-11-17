import GameManager from "../../manager";
import { useGame } from "../../store";


function InfomationMessage() {
  const message = useGame(state => state.gameInfomation.message);
  return (
    <h3>{message}</h3>
  )
}

export default InfomationMessage
