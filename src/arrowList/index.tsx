import { DavinciGameStatus } from "../types";
import { useGame } from "../store";
import Arrow from "./arrow";

const ArrowList = (props : {host : "player" | "enemy",check : boolean,onClick : (index : number) => void}) => {

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
            props.check ?
            (
                (
                    () => {
                        let elements = [];
                        let array = props.host == "player" ? useGame.getState().cardInfomation.player : useGame.getState().cardInfomation.enemy;
                        let length = props.host == "player" ? array.length + 1 : array.length;
                        for(let index = 0; index < length; index++){
                            elements.push(<Arrow key={`Arrow_enemy_${index}`} check={!(props.host == "enemy" && array[index].isDetect == true)} onClick={() => props.onClick(index)}/>); 
                        }
                        return elements;
                    }
                )()
            ) : <></>
        }
        </div>
    )
    
}



export default ArrowList;