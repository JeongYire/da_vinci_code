import Card from "../../cardList/card";
import { useGame } from "../../store";
import Hand from "..";
import CardList from "../../cardList";
import ArrowList from "../../arrowList";

function EnemyHand() {

  console.log("EnemyHand");
  const enemyCard = useGame((state) => state.cardInfomation.enemy);
  const status = useGame((state) => state.gameInfomation.status);

  function choiceAction(index : number){
    console.log(enemyCard[index]);
  }
  
  return (
    <Hand>
        <CardList host="enemy" />
        <ArrowList host="enemy" status="playerAttackTurn" onClick={choiceAction}/>
    </Hand>
  )
}

export default EnemyHand
