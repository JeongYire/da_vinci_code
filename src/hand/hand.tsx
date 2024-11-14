function Hand(props : {children : any}) {
  return (
    <div style={{
        height : 100,
        display : "flex",
        justifyContent:"center",
        alignItems:"center",
    }}>
      {props.children}
    </div>
  )
}

export default Hand
