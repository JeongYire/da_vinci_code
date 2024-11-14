import Card from "../card";
import { useGame } from "../store";
import Hand from "./hand";


function PlayerHand() {
  console.log("PlayerHand");
  const myCard = useGame((state) => state.cardInfomation.player);
  const status = useGame((state) => state.gameInfomation.status);

  return (
    <Hand>
        <>
        {
          myCard.map(obj => {
            return <Card key={obj.id} isDetect={obj.isDetect} isOpen={true} color={obj.valueInfo.color} value={obj.valueInfo.value} id={obj.id}/>
          })
        }
        </>
    </Hand>
  )
}

export default PlayerHand
