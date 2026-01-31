import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {SelectCubers} from './components/sections/SelectCubers'
import {Game} from './components/sections/Game'
import {Stats} from './components/sections/Stats'
import {NavBar} from './components/NavBar'
import {simulateAllCompetitors, addUser, startingStats} from './components/services/competitors.js'
import { FaGithub } from "react-icons/fa";
import { Popup } from "./components/Popup.jsx"

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}


const Watermark = () => {
  return (
    <div className = "flex flex-row gap-5 items-center absolute bottom-0 right-0 p-5 text-2xl text-gray-400">
      <h1>
        Website by Dwyane Ramos
      </h1>
      <a target="_blank" href="https://github.com/dwyaneramos/wca-comp-sim">
        <FaGithub color={"gray-400"} size={40}/>
      </a>
    </div>

  )
}

function App() {

 
  const [page, setPage] = useState("Home")
  const [error, setError] = useState(null);
  const [ disabledEventDropdown, setDisabledEventDropdown] = useState(false)
  const [event, setEvent] = useLocalStorage("event", "333")
  const [nationality, setNationality] = useLocalStorage("nationality", "NZ")
  const [competitors, setCompetitors] = useLocalStorage("competitors", addUser([]))
  const lookup = {"Home" : SelectCubers,
            "Game" : Game,
            "Stats" : Stats}
  const [disableUpdatePopup, setDisableUpdatePopup] = useLocalStorage("disableUpdatePopup", false)
  const [showUpdatePopup, setShowUpdatePopup] = useState(disableUpdatePopup ? false : true)

  const disableApp = showUpdatePopup || error 


  const [stats, setStats] = useLocalStorage("stats", startingStats)

  const Simulate = async () => {
    const simmedCompetitors = await simulateAllCompetitors(competitors, event, nationality)
    setCompetitors(simmedCompetitors)
    return simmedCompetitors
  }

  const changePage = async (page) => {
    setShowUpdatePopup(false)
    if (page === "Game") {
        try {
          const simmedCompetitors = await Simulate()
          setDisabledEventDropdown(true)
          setPage("Game")
        } catch (err) {
          setError(err.message)
        }
    } else {
      setDisabledEventDropdown(false)
      setPage(page)
    }
  }

  useEffect(() => {
    console.log(disableUpdatePopup)
    
  }, [disableUpdatePopup])

  const CurrentPage = lookup[page]


  return (
    <>
      <NavBar changePage = {changePage} disabledEventDropdown = {disabledEventDropdown} setEvent = {setEvent}
        defaultEvent = {event} setNationality = {setNationality} defaultNationality = {nationality}/>

      {error && <Popup popupHeader={"ERROR"} popupMsg ={error} setPopupOn={setError} popupColor = {"red-500"}/>}

      {showUpdatePopup && <Popup popupHeader={"ATTENTION"} 
        popupMsg={"There has been changes to the way competitors are represented. To avoid any bugs, please go to Inspect, Storage, LocalStorage, delete competitors, then refresh. Thank you for using my website :)"}
        setPopupOn={setShowUpdatePopup}
        popupColor = {"red-500"} setDisableUpdatePopup = {setDisableUpdatePopup}/>}

      <CurrentPage changePage = {changePage} setPopup = {setError} setCompetitors = {setCompetitors} 
        competitors = {competitors} event={event} setStats={setStats} stats={stats} resetCompetitors = {Simulate}
        nationality={nationality} disableApp={disableApp}/>
      <Watermark/>
    </>
  )

}

export default App
