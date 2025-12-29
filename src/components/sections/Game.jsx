import {useState, useEffect} from "react";
import { FaArrowRight } from "react-icons/fa";
import {createPlayer} from "../services/cuber.js"



export const Game = (props) => {
  const competitors = props.competitors;
  const setCompetitors = props.setCompetitors;
  const [solveNum, setSolveNum] = useState(0)
  const [canViewOtherTimes, setViewOtherTimes] = useState(true)
  const numSolvesInRound = competitors[0].times.length
  const [ toggleButtonDisabled, setToggleDisability] = useState(false);
  const [timeInput, setTime] = useState("")

  useEffect(() => {
    if (solveNum == numSolvesInRound) {
      setViewOtherTimes(true);
      setToggleDisability(true);

    }
  }, [solveNum])

  let sortedCompetitors = [...competitors];
  if (solveNum >= 1 && solveNum <= numSolvesInRound - 1) {
    sortedCompetitors = [...competitors].sort(function(c1, c2) {return Math.min(...c1.times.slice(0,solveNum)) - Math.min(...c2.times.slice(0,solveNum))} )
  } else if (solveNum == numSolvesInRound) {
    sortedCompetitors = [...competitors].sort(function(c1, c2) {return c1.avg - c2.avg})
  }
  return (
    <section className = "flex flex-col pt-20 items-center gap-3  w-screen h-screen bg-white">
      <h1 className="text-3xl">hello</h1> 
      <button type="" onClick={() => setSolveNum(solveNum + 1)} className = "bg-green-500 h-10 p-3 rounded-xl cursor-pointer">gen times</button>
      <ToggleShowOtherTimes disabled = {toggleButtonDisabled} canViewOtherTimes = {canViewOtherTimes} setViewOtherTimes = {setViewOtherTimes}/>
      <div className = "flex flex-row gap-2">
        <input type="text" className ="border-2 border-black w-md h-10 "  name="time" value={timeInput} onChange={(e) => setTime(e.target.value)}/>
        <button onClick={() => submitTime(timeInput, setCompetitors, solveNum)} type="" className = "bg-blue-200 cursor-pointer  w-10 h-10 flex justify-center items-center rounded-md">
          <FaArrowRight/>
        </button>
      </div>
      <TimeHeaders/>
      <DisplayCuberTimes solveNum = {solveNum} canViewOtherTimes = {canViewOtherTimes} competitors = {sortedCompetitors}/>
    </section>
  )
}

function submitTime (time, setCompetitors, solveNum) {
  console.log(time)

  {/*

  setCompetitors(prev => 
    prev.map(c => {
      if (!(c.id == "Player")) {
        return c 
      }
      
      let newTimes = c.times;
      newTimes[solveNum - 1] = time
      const updatedPlayer = new Player(newTimes)
      return updatedPlayer;
    }))
  */}
}

const DisplayCuberTimes = ({solveNum, canViewOtherTimes, competitors}) => {
  return (
    <div className="flex flex-col gap-2  overflow-y-scroll">
      {competitors.map((cuber) => {

        return (
          <div key = {cuber.id}>
            <PlayerRow cuber = {cuber} solveNum = {solveNum} canViewOtherTimes = {canViewOtherTimes}/> 
          </div>
        )
      })}
      
    </div>
  )
}

const TimeHeaders = () => {
  const solves = [1,2,3,4,5]
  return (
    <div className = "flex flex-row w-3xl pl-50 py-2 items-center rounded-md border-2 border-gray-200 gap-5">
      {solves.map((s) => {
        return (
          <h1 key ={s}>Solve {s}</h1>
        )
      })}
      <h1>Average: </h1>
    </div>
  )
}

const ToggleShowOtherTimes = ({disabled, canViewOtherTimes, setViewOtherTimes}) =>  {
  return (
    <button type="" disabled = {disabled} className={` ${canViewOtherTimes ? "bg-gray-300 " : "bg-green-300"} relative  w-20 rounded-3xl h-10`} onClick = {() => setViewOtherTimes(!canViewOtherTimes)}>
      <div className = {`${canViewOtherTimes ? "left-1" : "left-[50%]"} transition-all duration-200 absolute rounded-[99px] top-1 w-8 h-8  bg-white`}>
        
      </div>

    </button>
  )

}

const PlayerRow = ({cuber, solveNum, canViewOtherTimes}) => {
  let avgToDisplay = "";
  if (solveNum == 4) {
      avgToDisplay = cuber.bpa.toFixed(2) + "/" + cuber.wpa.toFixed(2)
  } else if (solveNum > 4 ) {
      avgToDisplay = cuber.avg.toFixed(2)
  } else {
      avgToDisplay = "#####"
  }

  return (
    <div className = "flex flex-row w-3xl p-4 items-center rounded-md border-2 border-gray-200 gap-10">
      <div className = "flex flex-col gap-1">
        <h1 className = "w-40 truncate text-xl">{cuber.name}</h1>
        <h2 className = "text-gray-500">{cuber.id}</h2>
      </div>
      {cuber.times.map((time, idx) => {
        const timeToDisplay = idx + 1 <= solveNum && canViewOtherTimes ? time.toFixed(2) : "#####"
        return (
          <div key = {idx}>
            {timeToDisplay}
          </div>
        )


      })}


      {
        <h1 className = {`${solveNum == cuber.times.length ? "text-black" : "text-gray-500"}`}>
          {canViewOtherTimes ? avgToDisplay : "#####"}
        </h1>
      }
    
    </div>
  )
}
