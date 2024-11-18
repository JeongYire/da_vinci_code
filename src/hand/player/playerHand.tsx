import CardList from "../../cardList";
import Hand from "..";
import PlayerArrowList from "./playerArrowList";



const PlayerHand = () => {

  return (
    <Hand>
        <CardList host="player" />
        <PlayerArrowList/>
    </Hand>
  )
}

export default PlayerHand
