import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {SelectCubers} from './components/sections/SelectCubers'
import {Game} from './components/sections/Game'
import {NavBar} from './components/NavBar'
import {createPlayer} from './components/services/cuber.js'
import {simulateAllCompetitors, addUser} from './components/utils/competitors.js'
import { RxCross1 } from "react-icons/rx";

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

const Popup = ({errMsg, setError}) => {
  return (
    <div className ="fixed rounded-md top-0 bottom-0 my-auto right-0 left-0 mx-auto text-center bg-white border-2 border-red-200 w-2xl h-50 pt-10 pb-30 z-100">
      <h1 className = "font-bold text-red-500 underline text-2xl">Error:</h1>
      <p className = "text-xl">
      {errMsg}
      </p>
      <button type="" onClick={()=>setError(null)} className = "absolute right-2 top-2 cursor-pointer hover:bg-gray-100 p-3 text-2xl rounded-md border-2 border-gray-200">
        <RxCross1 size={20}/>
      </button>
    </div>
  )
}

function App() {


  const [page, setPage] = useState("Home")
  const [error, setError] = useState(null);
  const [ disabledEventDropdown, setDisabledEventDropdown] = useState(false)
  const [competitors, setCompetitors] = useLocalStorage("competitors", addUser([]))
  const [event, setEvent] = useState("333")
  const lookup = {"Home" : SelectCubers,
            "Game" : Game}

  const Simulate = async () => {
    const simmedCompetitors = await simulateAllCompetitors(competitors, event)
    console.log(simmedCompetitors, "AYeeeE")
    setCompetitors(simmedCompetitors)
    return simmedCompetitors
  }

  const changePage = async (page) => {
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
  


  const CurrentPage = lookup[page]


  return (
    <>
      <NavBar setPage = {setPage} disabledEventDropdown = {disabledEventDropdown} setEvent = {setEvent}/>
      {error && <Popup errMsg={error} setError={setError}/>}
      <CurrentPage changePage = {changePage} setCompetitors = {setCompetitors} competitors = {competitors} event={event}/>
    </>
  )

}

export default App
