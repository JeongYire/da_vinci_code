import GameManager from "../../manager";
import { useGame } from "../../store";


function InfomationMessage() {
  const message = useGame(state => state.gameInfomation.message);
  const subMessage = useGame(state => state.gameInfomation.subMessage);
  return (
    <>
      <h3>{message}</h3>
      <h4>{subMessage}</h4>
    </>
  )
}

export default InfomationMessage
