import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {SelectCubers} from './components/sections/SelectCubers'
import {Game} from './components/sections/Game'
import {NavBar} from './components/NavBar'
import {createPlayer} from './components/services/cuber.js'
import {simulateAllCompetitors} from './components/utils/competitors.js'

function App() {
  const [page, setPage] = useState("Home")
  const [competitors, setCompetitors] = useState([]);
  const lookup = {"Home" : SelectCubers,
            "Game" : Game}

  const Simulate = async () => {
    const simmedCompetitors = await simulateAllCompetitors(competitors)
    setCompetitors(simmedCompetitors)
  }

  const changePage = async (page) => {
    if (page === "Game") {
      await Simulate()
      setPage("Game")
    } else {
      setPage(page)
    }
  }
  


  const CurrentPage = lookup[page]


  return (
    <>
      <NavBar setPage = {setPage}/>
      <CurrentPage changePage = {changePage} setCompetitors = {setCompetitors} competitors = {competitors}/>
    </>
  )

}

export default App
