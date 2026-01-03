import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {SelectCubers} from './components/sections/SelectCubers'
import {Game} from './components/sections/Game'
import {NavBar} from './components/NavBar'
import {createPlayer} from './components/services/cuber.js'
import {simulateAllCompetitors, addUser} from './components/utils/competitors.js'

function App() {
  const [page, setPage] = useState("Home")
  const [ disabledEventDropdown, setDisabledEventDropdown] = useState(false)
  const [competitors, setCompetitors] = useState(() => {
    return JSON.parse(localStorage.getItem("competitors")) ?? []
  });
  const [event, setEvent] = useState("333")
  const lookup = {"Home" : SelectCubers,
            "Game" : Game}

  useEffect(() => {
    localStorage.setItem("competitors", JSON.stringify(competitors))
  }, [competitors])

  const Simulate = async () => {
    const simmedCompetitors = await simulateAllCompetitors(competitors, event)
    console.log(simmedCompetitors, "AYeeeE")
    setCompetitors(simmedCompetitors)
    return simmedCompetitors
  }

  const changePage = async (page) => {
    if (page === "Game") {
      const simmedCompetitors = await Simulate()
      setCompetitors(addUser(simmedCompetitors))
      setDisabledEventDropdown(true)
      setPage("Game")
    } else {
      setDisabledEventDropdown(false)
      setPage(page)
    }
  }
  


  const CurrentPage = lookup[page]


  return (
    <>
      <NavBar setPage = {setPage} disabledEventDropdown = {disabledEventDropdown} setEvent = {setEvent}/>
      <CurrentPage changePage = {changePage} setCompetitors = {setCompetitors} competitors = {competitors} event={event}/>
    </>
  )

}

export default App
