import GameScreen from './gameScreen'
import EnemyHand from './hand/enemyHand'
import MyHand from './hand/myHand'
import MainScreen from './mainScreen'
import ToolScreen from './toolScreen'

function App() {
  return (
    <GameScreen>
      <MainScreen>
       <>
        <EnemyHand />
        <MyHand />
       </>
      </MainScreen>
      <ToolScreen/>
    </GameScreen>
  )
}

export default App
