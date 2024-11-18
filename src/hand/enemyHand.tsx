import Card from "../card";
import { useGame } from "../store";
import Hand from "./hand";

function EnemyHand() {

  console.log("EnemyHand");
  const enemyCard = useGame((state) => state.cardInfomation.enemy);
  const status = useGame((state) => state.gameInfomation.status);
  
  return (
    <Hand>
        <>
        {
          enemyCard.map(obj => {
            return <Card key={obj.id} isDetect={obj.isDetect} isOpen={obj.isDetect} color={obj.valueInfo.color} value={obj.valueInfo.value} id={obj.id} />
          })
        }
        </>
    </Hand>
  )
}

export default EnemyHand
