import {useState, useEffect, useRef} from "react";
import {validateTime, formatTime, convertTime, convertToMMSS} from "../utils/helper.js"
import {InspectionTimer} from "../Timer"
import { FaArrowRight, FaStopwatch } from "react-icons/fa";
import {createPlayerWithNewTime, savePlayerTimes, rankCompetitors} from "../services/competitors.js"
import { randomScrambleForEvent } from "cubing/scramble";
import {fetchRecords, checkIfRecord, updateRecords} from "../services/records.js"
import {PLAYER_ID, DNF, MO3_EVENTS, BLD_EVENTS} from "../utils/constants.js"


const genScramble = async (event) => {
  const scramble = await randomScrambleForEvent(event);
  return scramble.toString()
}



export const Game = (props) => {
  const competitors = props.competitors;
  const setCompetitors = props.setCompetitors;
  const event = props.event
  const numSolvesInRound = MO3_EVENTS.includes(event) ? 3 : 5
  const setStats = props.setStats
  const stats = props.stats
  const setErrorPopup = props.setPopup
  const resetCompetitors = props.resetCompetitors
  const playerNationality = props.nationality
  const disableApp = props.disableApp
  const disableAppRef = useRef(disableApp)

  useEffect(() => {
    disableAppRef.current = disableApp;
  }, [disableApp]);

  const [solveNum, setSolveNum] = useState(0)
  const solveNumRef = useRef(solveNum);

  const [canViewOtherTimes, setViewOtherTimes] = useState(true)
  const [canViewPotentialAvg, setViewPotentialAvg] = useState(true)
  const [areCubersRanked, setCubersRanked] = useState(true)


  const [showPopup, setShowPopup] = useState({cuber: null, solveIdx: null});
  const [timeInput, setTime] = useState("")
  const [scramble, setScramble] = useState("Loading scramble...")
  const [endOfRound, setEndOfRound] = useState(false);
  const endOfRoundRef = useRef(endOfRound)
  const [inspectionOn, setInspection] = useState(false);

  const [records, setRecords] = useState(null)
  const ogRecordsRef = useRef(null)

  // set records
  useEffect(() => {
    const fetchAllRecords = async () => {
      const r = await fetchRecords(competitors, event);
      setRecords(r);
      ogRecordsRef.current = structuredClone(r);
    }
    fetchAllRecords();
}, [event]);

  useEffect(() => {
    endOfRoundRef.current = endOfRound
  }, [endOfRound])

  useEffect(() => {
    if (records !== null) {

      setRecords(prevRecords => updateRecords(prevRecords, competitors, solveNum, numSolvesInRound));
    }
    solveNumRef.current = solveNum;

    if (solveNum == numSolvesInRound) {
      setViewOtherTimes(true)
      setViewPotentialAvg(true)
      setEndOfRound(true)
    } else {
      setScramble(genScramble(event));
    }



  }, [solveNum])
  
  
  useEffect(() => {
    return () => {
      // Automatically save times when leaving the game page
      if (solveNumRef.current === numSolvesInRound) {
        saveTimes()
      }
    }
  }, [])
  

  function editTime (time, idx) {

    if (validateTime(time)) {
      time = convertTime(time)
      setCompetitors(prev => 
        prev.map(c => {
          if (c.id !== PLAYER_ID) {
            return c 
          }
          return createPlayerWithNewTime(c, idx + 1, time, numSolvesInRound, playerNationality)
          
        }))
      setShowPopup({cuber : null, solveIdx : null})
    } else {
    setErrorPopup("Invalid Time")
    }
  }

  

  function saveTimes() {
    const playerRank = sortedCompetitorsRef.current.findIndex((c) => c.id == PLAYER_ID) + 1
    const player = sortedCompetitorsRef.current[playerRank - 1]
    setStats(prev => savePlayerTimes(player, event, prev, playerRank, competitors.length))
  }

  function submitTime (time) {
    if ( validateTime(time) ) {
      time = convertTime(time) 

      const nextSolveNum = solveNum + 1 
      setSolveNum(nextSolveNum)
      setCompetitors(prev => 
        prev.map(c => {
          if (c.id !== PLAYER_ID) {
            return c 
          }

          return createPlayerWithNewTime(c, nextSolveNum, time, numSolvesInRound, playerNationality)
          
        }))
      setTime("")



    } else {
      setErrorPopup("Invalid Time")
    }
    
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disableAppRef.current) {
        e.preventDefault()
        return
      } 
      if (e.key === " " && !endOfRoundRef.current) setInspection(prev => !prev);
    } ;

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);

  }, []);





  async function resetRound() {
    saveTimes()
    setSolveNum(0)
    setEndOfRound(false);
    setRecords(structuredClone(ogRecordsRef.current))
    await resetCompetitors()
    
  }


  const sortedCompetitorsRef = useRef([]);
  let sortedCompetitors = rankCompetitors(competitors, solveNum, numSolvesInRound, event, areCubersRanked)
  useEffect(() => {
    sortedCompetitorsRef.current = sortedCompetitors;
  }, [sortedCompetitors]);

  return (
    <section className = {`flex flex-col pt-15 items-center gap-3  w-screen h-screen bg-white ${disableApp ? "pointer-events-none blur-xs" : ""}`}>
      {inspectionOn && <InspectionTimer setInspection = {setInspection}/> }
      <h1 className="text-2xl md:text-3xl pt-20 px-20 text-center">{scramble}</h1> 


      <div className = "flex flex-row gap-2 md:mt-10 mb-2">

        <button type="" className={`${endOfRound ?  "bg-gray-300" : "bg-green-500 cursor-pointer"} rounded-md p-1`}
          disabled={endOfRound} onClick={()=>setInspection(prev => !prev)}>
          <FaStopwatch size={30} color = {`${endOfRound ? "#374151" : "white"}`}/>
        </button>

        <input type="text"  className ="border-2 border-gray-400 rounded-md w-3xs md:w-md h-10  px-2 " onKeyPress={(e)=>{if(e.key=="Enter" && !endOfRound) submitTime(timeInput)}}
          name="time" value={timeInput} onChange={(e) => setTime(e.target.value.trim())} />

        <button disabled={endOfRound} onClick={() => submitTime(timeInput)} type="" 
          className = {`${endOfRound ?  "bg-gray-300" : "bg-green-500 cursor-pointer"}   w-10 h-10 flex justify-center items-center rounded-md`}>
          <FaArrowRight color = {`${endOfRound ? "#374151" : "white"}`}/>
        </button>
      </div>


        

        <button type="" disabled={!endOfRound} 
          className = {`${endOfRound ? "cursor-pointer bg-green-500 text-white" : "bg-gray-200 text-gray-700"} mb-2 w-xs md:w-sm p-2 rounded-md `} 

          onClick = {() => resetRound()}>Rematch</button>


      <div className = "flex flex-row gap-5">
        <Toggle disabled = {endOfRound} variable = {canViewOtherTimes} setterFunc = {setViewOtherTimes} text = {"Hide other times"}/>

        <Toggle disabled = {endOfRound} variable = {canViewPotentialAvg} setterFunc = {setViewPotentialAvg} text = {"Hide BPAs/WPAs"}/>

        <Toggle disabled = {endOfRound} variable = {areCubersRanked} setterFunc = {setCubersRanked} text = {"Hide provisional rankings"}/>
        {/*
        <button type="" className = "bg-green-500 p-2 rounded-md cursor-pointer text-white" onClick = {() => saveTimes(setStats, event, competitors)}>Rematch</button>
        */}
      </div>
      

      <TimeHeaders numSolvesInRound = {numSolvesInRound}/>

      <div className="overflow-y-scroll h-[50vh]">
        {/*


        <DisplayCuberTimes solveNum = {solveNum} canViewOtherTimes = {canViewOtherTimes}
          competitors = {sortedCompetitors} canViewPotentialAvg = {canViewPotentialAvg} setShowPopup = {setShowPopup} numSolvesInRound = {numSolvesInRound}
          setRecords = {setRecords} records = {records}/>
        {showPopup.cuber !== null && <EditTimePopup cuber = {showPopup.cuber} idx = {showPopup.solveIdx} onClick={editTime}/>}
        */}
      </div>
    </section>
  )
} 



const DisplayCuberTimes = ({solveNum, canViewOtherTimes, competitors, canViewPotentialAvg, setShowPopup, numSolvesInRound, setRecords, records}) => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      {competitors.map((cuber, idx) => {

        return (
          <div key = {cuber.id}>
            <PlayerRow cuber = {cuber} solveNum = {solveNum} canViewOtherTimes = {canViewOtherTimes}
              canViewPotentialAvg = {canViewPotentialAvg} setShowPopup={setShowPopup} rank = {idx} numSolvesInRound = {numSolvesInRound}
              setRecords = {setRecords} records={records}/> 
          </div>
        )
      })}
      
    </div>
  )
}

const TimeHeaders = ({numSolvesInRound}) => {
  let solves = new Array(numSolvesInRound); for (let i = 1; i <= numSolvesInRound; i++) solves[i - 1] = i
  
  const isMobile = window.screen.width < 768
  console.log(isMobile, "RAH")
  return (
     <div className = {`grid w-full md:w-3xl place-content-around text-center grid-cols-5 ${numSolvesInRound == 3 ? `md:grid-cols-7` : `md:grid-cols-9`} border-2 border-gray-200 rounded-md p-2 items-center`}>
      <h1>Rank</h1>
      <h1 className="col-span-2 text-left">Competitor</h1>
        {isMobile &&
            <h1>
             Best
            </h1>
        }

        {!isMobile && solves.map((s) => {
          return (
            <h1 key ={s}>Solve {s}</h1>
          )
        })}
      <h1>Average </h1>
    </div>
  )
}
const Toggle = ({disabled, variable, setterFunc, text}) => {
  return (



    <div className = "flex flex-row text-lg justify-center items-center gap-3">
      <button type="" disabled = {disabled} className={` ${variable ? "bg-gray-300 " : "bg-green-300"} relative  w-14 rounded-3xl h-7`} onClick = {() => setterFunc(!variable)}>
        <div className = {`${variable ? "left-1" : "left-[55%]"} transition-all duration-200 absolute rounded-[99px] top-1 w-5 h-5  bg-white`}/>
      </button>
      <h1>{text}</h1>
    </div>
  )
}


const EditTimePopup = ({cuber, idx, onClick}) => {
  const initNewTime = cuber.times[idx] == DNF ? "DNF" :  formatTime(cuber.times[idx])
  const [newTime, setNewTime] = useState(initNewTime)
  const [ogTime] = useState(formatTime(cuber.times[idx]))
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
      setNewTime(formatTime(convertTime(ogTime) + 2) + "+")
    }
  }
}

const PlayerRow = ({cuber, solveNum, canViewOtherTimes, canViewPotentialAvg, setShowPopup, rank, numSolvesInRound, setRecords, time, records}) => {
  let avgToDisplay = "";
  if (solveNum == numSolvesInRound - 1) {
      const displayedWPA = cuber.wpa == DNF ? "DNF": cuber.wpa.toFixed(2) 
      avgToDisplay = numSolvesInRound == 3 ? formatTime(cuber.wpa) : formatTime(cuber.bpa) + " / " + formatTime(cuber.wpa)
  } else if (solveNum > numSolvesInRound - 1 ) {
      avgToDisplay = formatTime(cuber.avg)
  } else {
      avgToDisplay = "#####"
  }

  const recordColorLookup = {
            "WR" : "text-red-400",
            "NR" : "text-green-600",
            "CR" : "text-yellow-600",
            false : "text-black"
          }


  const isAvgRecord = solveNum == numSolvesInRound ? checkIfRecord(cuber.avg, records, cuber.country, "avg") : false
  const avgColour = recordColorLookup[isAvgRecord]

  const cuberTimesToDisplay = cuber.id === PLAYER_ID ?  
        cuber.times.map((time, idx) => {
          const timeToDisplay = idx + 1 <= solveNum && (canViewOtherTimes || cuber.id === PLAYER_ID) ? formatTime(time) : "#####"
          const isRecord = idx + 1 <= solveNum ? checkIfRecord(time, records, cuber.country, "sin") : false;

                 return (
            <button key = {idx} onClick={()=>setShowPopup({cuber: cuber, solveIdx : idx})} disabled = {idx + 1 <= solveNum ? false : true}
              className = {`text-center ${recordColorLookup[isRecord]} ${cuber.id == PLAYER_ID && idx < solveNum ? "hover:text-gray-600 cursor-pointer": ""}`}>
              {timeToDisplay}
            </button>
          )


        })

        :

        cuber.times.map((time, idx) => {
          const timeToDisplay = idx + 1 <= solveNum && (canViewOtherTimes || cuber.id === PLAYER_ID) ? formatTime(time) : "#####"
          const isRecord = idx + 1 <= solveNum ? checkIfRecord(time, records, cuber.country, "sin") : false;

         
          return (
            <div key = {idx} className = {`text-center ${recordColorLookup[isRecord]}`}>
              {timeToDisplay}
            </div>
          )
        })

  return (
    <div className = {`grid w-3xl ${numSolvesInRound == 3 ? "grid-cols-7" : "grid-cols-9"} border-2 border-gray-200 rounded-md items-center pr-2`}>

      <h1 className = "text-xl text-center">{rank + 1}</h1>

      <div className = "col-span-2 w-40 flex flex-col gap-1 py-1">
        <h1 className = "truncate text-xl">{cuber.name}</h1>
        <h2 className = "text-gray-500">{cuber.id}</h2>
      </div>



      {/* Display Times */}
      {cuberTimesToDisplay}




      {/* Display BPA/WPA/AVG */}

      {
        <h1 className = {`${solveNum == cuber.times.length ? avgColour : "text-gray-500"} text-wrap text-center`}>
          {((canViewOtherTimes || cuber.id === PLAYER_ID) && canViewPotentialAvg) ? avgToDisplay : "#####"}
        </h1>
      }



      
    </div>

  )
}
