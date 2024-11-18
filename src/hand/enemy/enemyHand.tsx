import Card from "../../cardList/card";
import { useGame } from "../../store";
import Hand from "..";
import CardList from "../../cardList";
import ArrowList from "../../arrowList";

function EnemyHand() {

  console.log("EnemyHand");
  const enemyCard = useGame((state) => state.cardInfomation.enemy);
  const choiceCard = useGame((state) => state.memoryStorage.player.setChoiceCard);
  const status = useGame((state) => state.gameInfomation.status);

  function choiceAction(index : number){
    console.log(enemyCard[index]);
    choiceCard(enemyCard[index]);
  }
  
  return (
    <Hand>
        <CardList host="enemy" />
        <ArrowList host="enemy" status="playerAttackTurn" onClick={choiceAction}/>
    </Hand>
  )
}

export default EnemyHand
