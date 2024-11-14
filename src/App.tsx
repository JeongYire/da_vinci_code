import GameScreen from './gameScreen'
import EnemyHand from './hand/enemyHand'
import PlayerHand from './hand/playerHand'
import InfomationTable from './infomationTable'
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
