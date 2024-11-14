import { useGame } from "../store";
import Hand from "./hand";


function PlayerHand() {
  console.log("PlayerHand");
  const myCard = useGame((state) => state.cardInfomation.player);
  console.log(myCard);

  return (
    <Hand>
      <></>
    </Hand>
  )
}

export default PlayerHand
