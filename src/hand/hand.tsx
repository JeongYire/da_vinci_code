function Hand(props : {children : any}) {
  return (
    <div style={{
        height : 100,
        display : "flex",
    }}>
      {props.children}
    </div>
  )
}

export default Hand
