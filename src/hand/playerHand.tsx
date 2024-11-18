import Hand from "./hand";
import CardList from "./player/cardList";
import ArrowList from "./player/arrowList";



const PlayerHand = () => {

  return (
    <Hand>
        <CardList />
        <ArrowList />
    </Hand>
  )
}

export default PlayerHand
