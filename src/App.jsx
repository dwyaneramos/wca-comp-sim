import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {SelectCubers} from './components/sections/SelectCubers'
import {Game} from './components/sections/Game'
import {NavBar} from './components/NavBar'
import {createPlayer} from './components/services/cuber.js'

function App() {
  const [page, setPage] = useState("Home")
  const [competitors, setCompetitors] = useState([]);
  const lookup = {"Home" : SelectCubers,
            "Game" : Game}
  
  useEffect(() => {
    if (page == "Game") {
      setCompetitors(prev => [...prev, createPlayer()])
console.log("competitors length")
    }
  }, [page])
  


  const CurrentPage = lookup[page]


  return (
    <>
      <NavBar setPage = {setPage}/>
      <CurrentPage setPage = {setPage} setCompetitors = {setCompetitors} competitors = {competitors}/>
    </>
  )

}

export default App
