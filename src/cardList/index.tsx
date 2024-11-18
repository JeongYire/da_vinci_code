import Card from "./card";
import { useGame } from "../store";

const CardList = (props : {host : "player" | "enemy"}) => {

    const cardList = props.host == "player" ? useGame((state) => state.cardInfomation.player) : useGame((state) => state.cardInfomation.enemy);

    return (
        <div style={{
            width : "100%",
            height : "100%",
            position : "absolute",
            display : "flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
        {
            cardList.map(obj=>{
                return <Card host={props.host} key={obj.id} isDetect={obj.isDetect} isOpen={props.host == "player" ? true : obj.isDetect} color={obj.valueInfo.color} value={obj.valueInfo.value} id={obj.id}/>
            })
            
        }
        </div>
    )
}


export default CardList;