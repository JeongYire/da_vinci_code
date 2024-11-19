function Arrow(props : {check : boolean , onClick : () => void}){
    return (
        <div style={{
            width:60,
            height:80,
            textAlign:"center",
        }}>
            {
                props.check? 
                <span 
                    onMouseOver={(obj) => {obj.currentTarget.style.color = "red";}} 
                    onMouseOut={(obj) => {obj.currentTarget.style.color = "black";}} 
                    onClick={props.onClick}
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
                </span> : <></>
            }
        </div>
    )
}

export default Arrow;