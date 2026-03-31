import { useState, useEffect } from 'react'
import './index.css'
import { SelectCubers } from './components/sections/SelectCubers'
import { Game } from './components/sections/Game'
import { Stats } from './components/sections/Stats'
import { NavBar } from './components/NavBar'
import { simulateAllCompetitors, addUser, startingStats, defaultStats } from './services/competitors.js'
import { FaGithub } from "react-icons/fa";
import { Toast } from './components/Toast.jsx'

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
    <div className="flex flex-row gap-5 items-center sticky bottom-0 right-0 p-5 text-2xl text-gray-400">
      <h1>
        Website by Dwyane Ramos
      </h1>
      <a target="_blank" href="https://github.com/dwyaneramos/wca-comp-sim">
        <FaGithub color={"gray-400"} size={40} />
      </a>
    </div>

  )
}

function App() {


  const [page, setPage] = useState("Home")
  const [error, setError] = useState(null);
  const [disabledEventDropdown, setDisabledEventDropdown] = useState(false)
  const [event, setEvent] = useLocalStorage("event", "333")
  const [nationality, setNationality] = useLocalStorage("nationality", "NZ")
  const [competitors, setCompetitors] = useLocalStorage("competitors", addUser([]))
  const lookup = {
    "Home": SelectCubers,
    "Game": Game,
    "Stats": Stats
  }

  const [stats, setStats] = useLocalStorage("stats", startingStats)

  const Simulate = async () => {
    const simmedCompetitors = await simulateAllCompetitors(competitors, event, nationality)
    setCompetitors(simmedCompetitors)
    return simmedCompetitors
  }

  const changePage = async (page) => {
    if (page === "Game") {
      try {
        await Simulate()
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
    {/*update ten recent avgs format*/ }
    setStats(prev => {
      let newTenRecentAvgs = prev[event].tenRecentAvgs;

      if (newTenRecentAvgs.length > 0 && typeof newTenRecentAvgs[0] !== "object") {
        newTenRecentAvgs = newTenRecentAvgs.map((time, idx) => ({ time: time, date: "N/A", idx: idx + 1 }))
      }

      return {
        ...prev,
        [event]: {
          ...prev[event],
          tenRecentAvgs: newTenRecentAvgs
        }

      }

    })

    {/*adds new stats to people who used older ver of website*/ }
    setStats(prev => {
      const statsTemplate = defaultStats();
      return {
        ...prev,
        [event]: {
          ...statsTemplate,
          ...prev[event]
        }
      }
    })
  }, [event])


  const CurrentPage = lookup[page]


  return (
    <>
      <NavBar changePage={changePage} disabledEventDropdown={disabledEventDropdown} setEvent={setEvent}
        defaultEvent={event} setNationality={setNationality} defaultNationality={nationality} />

      {error && <Toast text={error} type={"error"} setShowToast={setError} />}

      <CurrentPage changePage={changePage} setPopup={setError} setCompetitors={setCompetitors}
        competitors={competitors} setEvent={setEvent} event={event} setStats={setStats} stats={stats} resetCompetitors={Simulate}
        nationality={nationality} setNationality={setNationality} />
    </>
  )

}

export default App
