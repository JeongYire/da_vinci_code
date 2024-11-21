import { DavinciCardColorType, DavinciCardValueType } from "../../types"


export default (props : {host : "player" | "enemy",isOpen : boolean,color : DavinciCardColorType,value : DavinciCardValueType,id : number,isDetect : boolean}) => {

    

    return (
        <div style={{
            width:60,
            height:80,
            outline:1,
            outlineColor:"red",
            outlineStyle:"groove",
            position:"relative",
        }}>
            <span style={{
                position:"absolute",
                top:5,
                right:5,
                color:props.color == "black" ? "white" : "black"
            }}>{props.id}</span>
            <div style={{
                width:"100%",
                height:"100%",
                display: "flex",
                justifyContent:"center",
                alignItems:"center",
                backgroundColor:props.color == "black" ? "black" : "white"
            }}>
                {
                    props.isOpen ?
                    <span style={{
                        fontSize:"xxx-large",
                        color:(props.host == "player" && props.isDetect) ? "red" : props.color == "black" ? "white" : "black"
                    }}>{props.value == "joker" ? "ㅡ" : props.value}</span>
                    :<></>
                    //<h5 style={{color:"red"}}>{props.value == "joker" ? "ㅡ" : props.value}</h5>
                }
            </div>
        </div>
    ) 
   
}