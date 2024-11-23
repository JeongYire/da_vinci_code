import GameManager from "../../manager";
import { useGame } from "../../store";


function InfomationMessage() {
  const message = useGame(state => state.gameInfomation.status);
  return (
    <>
      <h3>{GameManager.getStatusMessage(message)}</h3>
    </>
  )
}

export default InfomationMessage
