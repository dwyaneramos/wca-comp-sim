import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {SelectCubers} from './components/sections/SelectCubers'
import {Game} from './components/sections/Game'
import {Stats} from './components/sections/Stats'
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
            "Game" : Game,
            "Stats" : Stats}



const startingStats = {
  "333":       { bestTimes: [], bestAvgs: [], solves: [] },
  "222":       { bestTimes: [], bestAvgs: [], solves: [] },
  "444":       { bestTimes: [], bestAvgs: [], solves: [] },
  "555":       { bestTimes: [], bestAvgs: [], solves: [] },
  "666":       { bestTimes: [], bestAvgs: [], solves: [] },
  "777":       { bestTimes: [], bestAvgs: [], solves: [] },
  "333bf":     { bestTimes: [], bestAvgs: [], solves: [] },
  "333fm":     { bestTimes: [], bestAvgs: [], solves: [] },
  "333oh":     { bestTimes: [], bestAvgs: [], solves: [] },
  "333ft":     { bestTimes: [], bestAvgs: [], solves: [] },
  "clock":     { bestTimes: [], bestAvgs: [], solves: [] },
  "minx":      { bestTimes: [], bestAvgs: [], solves: [] },
  "pyram":     { bestTimes: [], bestAvgs: [], solves: [] },
  "skewb":     { bestTimes: [], bestAvgs: [], solves: [] },
  "sq1":       { bestTimes: [], bestAvgs: [], solves: [] },
  "444bf":     { bestTimes: [], bestAvgs: [], solves: [] },
  "555bf":     { bestTimes: [], bestAvgs: [], solves: [] }
};

  const [stats, setStats] = useLocalStorage("stats", startingStats)

  const Simulate = async () => {
    const simmedCompetitors = await simulateAllCompetitors(competitors, event)
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
  console.log(stats)



  return (
    <>
      <NavBar changePage = {changePage} disabledEventDropdown = {disabledEventDropdown} setEvent = {setEvent}/>
      {error && <Popup errMsg={error} setError={setError}/>}
      <CurrentPage changePage = {changePage} setCompetitors = {setCompetitors} competitors = {competitors} event={event} setStats={setStats} stats={stats} resetCompetitors = {Simulate}/>
    </>
  )

}

export default App
