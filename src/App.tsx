import GameScreen from './gameScreen'
import EnemyHand from './hand/enemy/enemyHand'
import PlayerHand from './hand/player/playerHand'
import InfomationTable from './infomationTable/index'
import MainScreen from './mainScreen'
import ToolScreen from './toolScreen'

function App() {
  return (
    <GameScreen>
      <MainScreen>
       <>
        <EnemyHand />
        <InfomationTable />
        <PlayerHand />
       </>
      </MainScreen>
      <ToolScreen/>
    </GameScreen>
  )
}

export default App
