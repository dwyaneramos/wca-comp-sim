import {useState, useEffect} from "react";
import { FaArrowRight } from "react-icons/fa";
import {createPlayer} from "../services/cuber.js"
import {createPlayerWithNewTime, savePlayerTimes} from "../utils/competitors.js"
import { randomScrambleForEvent } from "cubing/scramble";

const PLAYER_ID = "Player"
const DNF = 999



const genScramble = async (event) => {
  const scramble = await randomScrambleForEvent(event);
  return scramble.toString()
}



export const Game = (props) => {
  const competitors = props.competitors;
  const setCompetitors = props.setCompetitors;
  const event = props.event
  const setStats = props.setStats
  const stats = props.stats
  const setPopup = props.setPopup
  const resetCompetitors = props.resetCompetitors

  const [solveNum, setSolveNum] = useState(0)
  const [canViewOtherTimes, setViewOtherTimes] = useState(true)
  const [canViewPotentialAvg, setViewPotentialAvg] = useState(true)
  const numSolvesInRound = 5
  const [toggleButtonDisabled, setToggleDisability] = useState(false);
  const [showPopup, setShowPopup] = useState({cuber: null, solveIdx: null});
  const [timeInput, setTime] = useState("")
  const [scramble, setScramble] = useState("Loading scramble...")

  useEffect(()=> {
    console.log(competitors)
  }, [competitors])
  

  useEffect(() => {
    if (solveNum == numSolvesInRound) {
      setViewOtherTimes(true);
      setToggleDisability(true);

    } else {
      setScramble(genScramble(event));
    }

  }, [solveNum])


  function editTime (time, idx) {
    if (time.includes("+")) {
      time = time.slice(0, -1)
    } else if (time === "DNF") {
      time = DNF
    }

    setCompetitors(prev => 
      prev.map(c => {
        if (c.id !== PLAYER_ID) {
          return c 
        }

        return createPlayerWithNewTime(c, idx + 1, time)
        
      }))
    setShowPopup({cuber : null, solveIdx : null})
  }

  function saveTimes() {
    const playerRank = sortedCompetitors.findIndex((c) => c.id == PLAYER_ID) + 1
    const player = sortedCompetitors[playerRank - 1]
    setStats(prev => savePlayerTimes(player, event, prev, playerRank, competitors.length))
  }

  function submitTime (time) {
    if ( (isNaN(time) && !time.includes("+") && time !== "DNF" ) || time <= 0) {
      console.log("Not a number")
      setPopup("Invalid Time Input")
    } else {

      if (time === "DNF") {
        time = DNF;
      } else if (time.includes("+")) {
        time = time.slice(0, -1)
      }

      const nextSolveNum = solveNum + 1 
      setSolveNum(nextSolveNum)
      setCompetitors(prev => 
        prev.map(c => {
          if (c.id !== PLAYER_ID) {
            return c 
          }

          return createPlayerWithNewTime(c, nextSolveNum, time)
          
        }))
      setTime("")
    }
  }




  async function resetRound() {
    saveTimes()
    setSolveNum(0)
    await resetCompetitors()
    
  }


  let sortedCompetitors = [...competitors];
  if (solveNum >= 1 && solveNum <= numSolvesInRound - 1) {
    sortedCompetitors = [...competitors].sort(function(c1, c2) {return Math.min(...c1.times.slice(0,solveNum)) - Math.min(...c2.times.slice(0,solveNum))} )
  } else if (solveNum == numSolvesInRound) {
    sortedCompetitors = [...competitors].sort(function(c1, c2) {return c1.avg - c2.avg})
  }
  return (
    <section className = "flex flex-col pt-20 items-center gap-3  w-screen h-screen bg-white">
      <h1 className="text-3xl pt-20 px-20">{scramble}</h1> 
      <div className = "flex flex-row gap-2 mt-10 mb-4">
        <input type="text"  className ="border-2 border-gray-400 rounded-md w-md h-10  px-2 "  name="time" value={timeInput} onChange={(e) => setTime(e.target.value)}/>
        <button onClick={() => submitTime(timeInput)} type="" className = "bg-blue-200 cursor-pointer  w-10 h-10 flex justify-center items-center rounded-md">
          <FaArrowRight/>
        </button>
      </div>

      <div className = "flex flex-row gap-5">
        <div className = "flex flex-row text-lg justify-center items-center gap-3">
          <Toggle disabled = {toggleButtonDisabled} variable = {canViewOtherTimes} setterFunc = {setViewOtherTimes}/>
          <h1>Hide other times</h1>
        </div>
        <div className = "flex flex-row text-lg justify-center items-center gap-3">
          <Toggle disabled = {toggleButtonDisabled} variable = {canViewPotentialAvg} setterFunc = {setViewPotentialAvg}/>
          <h1>Hide BPAs/WPAs</h1>
        </div>
        {/*
        <button type="" className = "bg-green-500 p-2 rounded-md cursor-pointer text-white" onClick = {() => saveTimes(setStats, event, competitors)}>Rematch</button>
        */}
        <button type="" className = "bg-green-500 p-2 rounded-md cursor-pointer text-white" onClick = {() => resetRound()}>Rematch</button>
      </div>

      <TimeHeaders/>
      <DisplayCuberTimes solveNum = {solveNum} canViewOtherTimes = {canViewOtherTimes} competitors = {sortedCompetitors} canViewPotentialAvg = {canViewPotentialAvg} setShowPopup = {setShowPopup}/>
      {showPopup.cuber !== null && <EditTimePopup cuber = {showPopup.cuber} idx = {showPopup.solveIdx} onClick={editTime}/>}
    </section>
  )
}



const DisplayCuberTimes = ({solveNum, canViewOtherTimes, competitors, canViewPotentialAvg, setShowPopup}) => {
  return (
    <div className="flex flex-col gap-2  overflow-y-scroll">
      {competitors.map((cuber, idx) => {

        return (
          <div key = {cuber.id}>
            <PlayerRow cuber = {cuber} solveNum = {solveNum} canViewOtherTimes = {canViewOtherTimes} canViewPotentialAvg = {canViewPotentialAvg} setShowPopup={setShowPopup} rank = {idx}/> 
          </div>
        )
      })}
      
    </div>
  )
}

const TimeHeaders = () => {
  const solves = [1,2,3,4,5]
  return (
     <div className = "grid w-3xl text-center grid-cols-9 border-2 border-gray-200 rounded-md p-2 items-center">
      <h1>Rank</h1>
      <h1 className="col-span-2">Competitor</h1>

      {solves.map((s) => {
        return (
          <h1 key ={s}>Solve {s}</h1>
        )
      })}
      <h1>Average: </h1>
    </div>
  )
}
const Toggle = ({disabled, variable, setterFunc}) => {
  return (
    <button type="" disabled = {disabled} className={` ${variable ? "bg-gray-300 " : "bg-green-300"} relative  w-14 rounded-3xl h-7`} onClick = {() => setterFunc(!variable)}>
      <div className = {`${variable ? "left-1" : "left-[55%]"} transition-all duration-200 absolute rounded-[99px] top-1 w-5 h-5  bg-white`}/>
    </button>
  )
}


const EditTimePopup = ({cuber, idx, onClick}) => {
  let initNewTime = cuber.times[idx] == DNF ? "DNF" : cuber.times[idx].toFixed(2)
  const [newTime, setNewTime] = useState(initNewTime)
  const [ogTime] = useState(cuber.times[idx].toFixed(2))
  return (
    <div className = "bg-white border-2 border-gray-200 flex gap-2 justify-center items-center flex-col
      w-100 h-50 absolute right-0 left-0 mx-auto top-0 bottom-0 my-auto">
      <h1>Edit Time</h1>
      <input className="bg-gray-100 text-center w-50 p-3 rounded-md" type=""
        name="edit time input" value={newTime} onChange={(e)=>setNewTime(e.target.value)}/>
      <div className = "flex flex-row gap-2">
        <button type="" onClick={() => togglePenalty(ogTime, newTime, "DNF", setNewTime)} className ="bg-green-500 p-2 w-20 rounded-md text-white cursor-pointer">DNF</button>
        <button type="" onClick={()=> onClick(newTime, idx)} className ="bg-green-500 p-2 w-20 rounded-md text-white cursor-pointer">Confirm</button>
        <button type="" onClick={() => togglePenalty(ogTime, newTime, "+2", setNewTime)} className ="bg-green-500 p-2 w-20 rounded-md text-white cursor-pointer">+2</button>
      </div>
      
    </div>
  )
}

const togglePenalty = (ogTime, newTime, penalty, setNewTime) => {
  if (ogTime == DNF) {
    return
  }

  if (penalty == "DNF") {
    if (newTime == "DNF") {
      setNewTime(ogTime)
    } else {
      setNewTime("DNF")
    }
  } else if (penalty == "+2") {
    if (newTime.includes("+")) {
      setNewTime(ogTime)
    } else {
      setNewTime(Number.parseFloat(ogTime) + 2 + "+")
    }
  }
}

const PlayerRow = ({cuber, solveNum, canViewOtherTimes, canViewPotentialAvg, setShowPopup, rank}) => {
  let avgToDisplay = "";
  if (solveNum == 4) {
      const displayedWPA = cuber.wpa == DNF ? "DNF": cuber.wpa.toFixed(2) 
      avgToDisplay = cuber.bpa.toFixed(2) + "/" + displayedWPA
  } else if (solveNum > 4 ) {
      const displayedAvg = cuber.avg == DNF ? "DNF": cuber.avg.toFixed(2) 
      avgToDisplay = displayedAvg;
  } else {
      avgToDisplay = "#####"
  }

  return (
    <div className = "grid w-3xl grid-cols-9 border-2 border-gray-200 rounded-md items-center">

      <h1 className = "text-xl text-center">{rank + 1}</h1>

      <div className = "col-span-2 flex flex-col gap-1 py-1">
        <h1 className = "w-40 truncate text-xl">{cuber.name}</h1>
        <h2 className = "text-gray-500">{cuber.id}</h2>
      </div>



      {/* Display Times */}

      {cuber.id === PLAYER_ID &&

        cuber.times.map((time, idx) => {
          let timeToDisplay = idx + 1 <= solveNum && (canViewOtherTimes || cuber.id === PLAYER_ID) ? time.toFixed(2) : "#####"
          if (timeToDisplay == DNF) {
            timeToDisplay = "DNF";
          }
          return (
            <button key = {idx} onClick={()=>setShowPopup({cuber: cuber, solveIdx : idx})} className = {`text-center ${cuber.id == PLAYER_ID && idx < solveNum ? "hover:text-gray-600 cursor-pointer": ""}`}>
              {timeToDisplay}
            </button>
          )


        })
      }

      {cuber.id !== PLAYER_ID && 
        cuber.times.map((time, idx) => {
          const timeToDisplay = idx + 1 <= solveNum && (canViewOtherTimes || cuber.id === PLAYER_ID) ? time.toFixed(2) : "#####"
          return (
            <div key = {idx} className = "text-center">
              {timeToDisplay}
            </div>
          )
        })
      }

      {/* Display BPA/WPA */}

      {
        <h1 className = {`${solveNum == cuber.times.length ? "text-black" : "text-gray-500"} text-center`}>
          {((canViewOtherTimes || cuber.id === PLAYER_ID) && canViewPotentialAvg) ? avgToDisplay : "#####"}
        </h1>
      }



      
    </div>

  )
}
