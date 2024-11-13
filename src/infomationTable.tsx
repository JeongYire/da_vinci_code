

function InfomationTable() {
  return (
    <div style={{
        display : "flex",
        flexDirection : "column",
        flexGrow : 1,
        justifyContent : "center",
        alignItems : "center"
    }}>
        <h3>안녕하세요! 게임을 시작하시려면 게임 시작 버튼을 눌러주세요...</h3>
        <h4>남은 카드 : 0</h4>
        <button>카드뽑기</button>
    </div>
  )
}

export default InfomationTable
