import Card from "../../card";
import { useGame } from "../../store";

const CardList = () => {

    const cardList = useGame((state) => state.cardInfomation.player);

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
                return <Card key={obj.id} isDetect={obj.isDetect} isOpen={true} color={obj.valueInfo.color} value={obj.valueInfo.value} id={obj.id}/>
            })
            
        }
        </div>
    )
}


export default CardList;