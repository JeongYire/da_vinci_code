function Hand(props : {children : any}) {
  return (
    <div style={{
        height : 100,
        justifyContent:"center",
        alignItems:"center",
        display:"flex",
        position:"relative"
    }}>
      {props.children}
    </div>
  )
}

export default Hand
