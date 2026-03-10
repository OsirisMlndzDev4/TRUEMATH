import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomeScreen from './screens/HomeScreen'
import GameOverScreen from './screens/GameOverScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import SyntaxNodeGame from './components/syntax/SyntaxNodeGame'
import SyntaxDifficultyScreen from './screens/SyntaxDifficultyScreen'
import TruthFinderGame from './components/finder/TruthFinderGame'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/syntax-difficulty" element={<SyntaxDifficultyScreen />} />
        <Route path="/syntax" element={<SyntaxNodeGame />} />
        <Route path="/finder" element={<TruthFinderGame />} />
        <Route path="/gameover" element={<GameOverScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
      </Routes>
    </AnimatePresence>
  )
}
