import { DavinciCardColorType, DavinciCardValueType, DavinciGameStatus } from "../types"


export default (props : {isOpen : boolean,color : DavinciCardColorType,value : DavinciCardValueType,id : number,isDetect : boolean,children? : JSX.Element[]}) => {

    

    return (
        <div style={{
            width:60,
            height:80,
            border:1,
            borderColor:"red",
            borderStyle:"groove",
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
                <span style={{
                    fontSize:"xxx-large",
                    color:props.color == "black" ? "white" : "black"
                }}>{props.value == "joker" ? "ㅡ" : props.value}</span>
            </div>
            {props.children}
        </div>
    ) 
   
}