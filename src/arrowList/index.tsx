import { DavinciGameStatus } from "../types";
import { useGame } from "../store";

const ArrowList = (props : {host : "player" | "enemy",status : DavinciGameStatus,onClick : (index : number) => void}) => {

    const status = useGame((state) => state.gameInfomation.status);

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
            status == props.status?
            (
                (
                    () => {
                        let elements = [];
                        let length = props.host == "player" ? useGame.getState().cardInfomation.player.length + 1 : useGame.getState().cardInfomation.enemy.length;
                        for(let index = 0; index < length; index++){
                            elements.push(<div key={`${index}_arrow_div`} style={{
                                width:60,
                                height:80,
                                textAlign:"center",
                            }}>
                                <span 
                                    key={`${index}_arrow_span`}
                                    onMouseOver={(obj) => {obj.currentTarget.style.color = "red";}} 
                                    onMouseOut={(obj) => {obj.currentTarget.style.color = "black";}} 
                                    onClick={() => {
                                        props.onClick(index);
                                    }}
                                    style={{
                                        display : "inline-block",
                                        cursor : "pointer",
                                        width : 20,
                                        height : 20,
                                        textAlign:"center",
                                        position:"relative",
                                        top:"100%",
                                    }}>
                                        △
                                </span>
                            </div>);
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