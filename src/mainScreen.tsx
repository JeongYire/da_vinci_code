

function App(props : { children : any }) {
  return (
    <div style={{
        width : 800,
        height : 600,
        borderWidth : 1,
        borderColor : "black",
        borderStyle: "groove",
        display : "flex",
        flexDirection : "column",
        justifyContent : "space-between"
    }}>
        {
            props.children
        }
    </div>
  )
}

export default App
