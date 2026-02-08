import {useState, useEffect} from "react"
import {SelectEventDropdown} from "../Dropdown.jsx"
import {Chart as ChartJS} from "chart.js/auto"
import {Bar, Line} from "react-chartjs-2"
import {genSuffix, formatTime } from "../utils/helper.js"
import {defaultStats} from "../services/competitors.js"
import {DNF, EVENT_AVERAGE_TYPE, EVENT_NAME_LOOKUP} from "../utils/constants.js"

const NUM_RECENT_SOLVES = 25 

const SolvesLineGraph = (props) => {
  const NUM_RECENT_SOLVES = 25
  const xRecentSolves = props.dataForGraph.data.slice(-NUM_RECENT_SOLVES).map((solve, idx) => ({
    x : idx,
    y : solve.time,
    date: solve.date,
    idx: solve.idx
  }))
  const solvesToDisplay = xRecentSolves.filter((solve) => solve.y != DNF)
  const solveNumsLabelsToDisplay = (solvesToDisplay.map((s) => "Result " + s.idx))
  const graphHeight = props.height
  const graphWidth = props.width


  return (
    <div className = " bg-white rounded-md drop-shadow-lg p-5 border-2 border-gray-200">
      
    <h1 className = "text-xl mb-2  text-gray-600">{props.dataForGraph.title}</h1>
    <div className={`${graphHeight} ${graphWidth}`}>
      
      <Line
        data = {{
        labels: solveNumsLabelsToDisplay,
        datasets: [
          {
            label: "Time",
            data: solvesToDisplay,
            tension: 0.1,
            borderColor: "#35de5d"
          }
        ]

      }}

      options = {{
          layout: {
            autoPadding: true,
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins : {
            legend : {
              display: false
            },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: (data) => {
                const value = data.raw.y 
                const date = data.raw.date
                return [ `Time: ${formatTime(value)}`, 
                         `Date: ${date}`];
                }
              }
            },

          },
          scales : {
            x : {
              ticks : {
                display: false
              }
            }
          }
        }}/>
    </div>
    </div>

  )
}

export const Stats = (props) => {
  const event = props.event
  const setStats = props.setStats
  const stats = props.stats 
  const setEvent = props.setEvent
  const eventStats = stats[event]
  const displayableData = [

    {
      data : eventStats.solves,
      title: "Most recent " + Math.min(25, eventStats.solves.length) + " solves"
    },

    {
      data : eventStats.prAvgHistory,
      title: "History of PR Averages"
    },

    {
      data : eventStats.prSinHistory,
      title: "History of PR Singles"
    },
    {
      data: eventStats.tenRecentAvgs,
      title: `Most recent ${Math.min(10, eventStats.tenRecentAvgs.length)} ${EVENT_AVERAGE_TYPE[event]}s`
    }
  ]
  const [dataForGraphIndex, setDataForGraphIndex] = useState(0)
  

  const resetStats = () => {
    setStats(prev => ({
      ...prev,
      [event]: defaultStats(),
    }))
  }

   return (
    <>

    <div className="block sm:hidden">
       <MobileStatsLayout event={event} setEvent={setEvent} eventStats={eventStats} displayableData={displayableData}
        setDataForGraphIndex={setDataForGraphIndex} dataForGraphIndex = {dataForGraphIndex} resetStats={resetStats}/>
    </div>

    <div className="hidden sm:block">
      <DesktopStatsLayout event={event} setEvent={setEvent} eventStats={eventStats} displayableData={displayableData}
          setDataForGraphIndex={setDataForGraphIndex} dataForGraphIndex = {dataForGraphIndex} resetStats={resetStats}/>
    </div>
    </>

      )
}

const MobileStatsLayout = ({event, setEvent, eventStats, displayableData, setDataForGraphIndex, dataForGraphIndex, resetStats}) => {

  return (
    <section className="mt-12 p-5 flex items-center flex-col gap-2">

      <div className="mt-3 mb-2 w-full sm:w-2xl text-xl sm:text-2xl p-3 flex flex-row bg-white border-gray-200 drop-shadow-md border-2 text-center items-center gap-3 justify-center font-medium rounded-lg">
        <h1 className="text-xl">Stats for </h1> 
        <SelectEventDropdown defaultEvent={event} setEvent={setEvent} width={"w-50"} height={"h-10"}/>      
      </div>
      
          
        <SolvesLineGraph dataForGraph ={displayableData[dataForGraphIndex]} height={"h-50"} />
        <ChangeGraphDataButton setDataForGraphIndex = {setDataForGraphIndex} dataForGraphIndex = {dataForGraphIndex} numTypesOfData = {displayableData.length}/> 

        <div className="flex flex-row overflow-x-scroll gap-1 w-full justify-center">
          <TopResultsSection className=""  type = {"Averages"} topTimes = {eventStats.bestAvgs}/>
          <TopResultsSection   type = {"Singles"} topTimes = {eventStats.bestTimes}/>
        </div>

        
      <CompSummaryStats eventStats = {eventStats} event = {event} times = {eventStats.solves}/>
      <ResetButton resetStats = {resetStats}/>

    </section>

  )
}

const DesktopStatsLayout = ({event, setEvent, eventStats, displayableData, setDataForGraphIndex, dataForGraphIndex, resetStats}) => {

  return (
    <section className="mt-12 p-5 flex items-center flex-col gap-2">

      <div className="mt-3 mb-2 w-sm sm:w-2xl text-xl sm:text-2xl p-3 flex flex-row bg-white border-gray-200 drop-shadow-md border-2 text-center items-center gap-3 justify-center font-medium rounded-lg">
        <h1 className="text-3xl">Stats for </h1> 
        <SelectEventDropdown defaultEvent={event} setEvent={setEvent} width={"w-80"} height={"h-15"}/>      </div>
      
      <div className="sm:grid sm:grid-cols-5 gap-2 sm:auto-rows-max w-full">
          
        <span className="col-span-1">
          <TopResultsSection className=""  type = {"Averages"} topTimes = {eventStats.bestAvgs}/>
        </span> 
        <span className="col-span-3">
          <SolvesLineGraph dataForGraph ={displayableData[dataForGraphIndex]} height={"h-85"}/>
        </span>
        
        <span className="col-span-1">
          <TopResultsSection   type = {"Singles"} topTimes = {eventStats.bestTimes}/>
        </span>
      </div>

      <div className = "grid grid-cols-7 gap-2 w-full">
        <span className = "col-span-1">
          <ChangeGraphDataButton setDataForGraphIndex = {setDataForGraphIndex} dataForGraphIndex = {dataForGraphIndex} numTypesOfData = {displayableData.length}/> 
        </span>
        <span className = "col-span-5">
          <CompSummaryStats eventStats = {eventStats} event = {event} times = {eventStats.solves}/>
        </span>


        <span className = "col-span-1">
          <ResetButton resetStats = {resetStats}/>
        </span>
      </div>
        

    </section>

  )
}


const ChangeGraphDataButton = ({setDataForGraphIndex, dataForGraphIndex, numTypesOfData}) => {
  const newIndex = (dataForGraphIndex + 1) % numTypesOfData

  return (
    <button type="" onClick = {() => setDataForGraphIndex(newIndex)} className = "bg-green-400 p-2 h-full w-full 
      text-white drop-shadow-md rounded-md text-xl">Change Displayed Data</button>
  )
}

const ResetButton = ({resetStats}) => {
  return (
    <button onClick = {resetStats} className = "bg-red-500 py-2 text-xl drop-shadow-md cursor-pointer h-full w-full rounded-md text-white" type="">
      Reset Stats
    </button>
  )
}

const PodiumCount = ({eventStats}) => {
  const medalSize = "text-md"
  return (
  <div className = "flex flex-col items-center">
    <div className = "flex flex-row bg-gray-100 gap-5 p-2 items-center justify-center rounded-md">
      <div className = "flex flex-col items-center ">
        <span className={`${medalSize} text-gray-600`}>Gold</span> 
        <span className="text-xl">{eventStats.podiumCount[0]}</span>
      </div>

      <div className = "flex flex-col items-center ">
        <span className={`${medalSize}  text-gray-600`}>Silver</span> 
        <span className="text-xl">{eventStats.podiumCount[1]}</span>
      </div>

      <div className = "flex flex-col items-center ">
        <span className = {`${medalSize}  text-gray-600`}>Bronze</span> 
        <span className = "text-xl">{eventStats.podiumCount[2]}</span>
      </div>
      
    </div>

  </div>

  )
}

const CompSummaryStats = ({eventStats, event, times}) => {
  const roundedAvgPlacing = Math.round(eventStats.avgPlacing)
  const roundedAvgCompetitors = Math.round(eventStats.avgCompetitorsInRound)
  
  const averageType = EVENT_AVERAGE_TYPE[event] 
  const moXAo5 = eventStats.tenRecentAvgs.length == 0 ? "N/A" :
    eventStats.tenRecentAvgs.includes(DNF) ? "DNF" : 
      formatTime(eventStats.tenRecentAvgs.map((res)=>res.time).reduce((acc, curr) => acc + curr, 0 ) / eventStats.tenRecentAvgs.length)
  
  const mean = times.map((res) => res.time).reduce((acc, curr) => acc + curr, 0) / times.length 
  console.log(mean)
  return (
    <div className = " flex gap-4 text-center flex-wrap w-full flex-col sm:flex-row text-lg items-center  w-full sm:place-content-between bg-white drop-shadow-lg  rounded-md p-3 border-2 border-gray-200">
      <div className = "">
        <h2 className = "text-gray-600">Competitions</h2>
        <p>Simulated {eventStats.numRoundsDone} rounds</p>
      </div>

      <div className = "">
        <h2 className = "text-gray-600">Total Solves Done</h2>
        <p>{eventStats.solves.filter((solve) => solve.time != DNF).length} solves</p>
      </div>

      <PodiumCount eventStats={eventStats}/>

      
      <div className = "">
        <h2 className = "text-gray-600">Mo{Math.min(10, eventStats.tenRecentAvgs.length)}{averageType}</h2>
        <p>{moXAo5}</p>
      </div>

      <div className = "">
        <h2 className = "text-gray-600">Average Placing</h2>
        <p>{roundedAvgPlacing}{genSuffix(roundedAvgPlacing)} out of {roundedAvgCompetitors} competitors</p>
      </div>
      




    </div>
  )
}

const TopResultsSection = ({type, topTimes}) => {
  let topTimesWithPlaceHolders = [...topTimes]
  while (topTimesWithPlaceHolders.length < 5) {
    topTimesWithPlaceHolders.push("N/A")
  }
  return (
    <div className = "white p-2 pb-5 h-full w-150 sm:w-full rounded-md drop-shadow-md border-2 border-gray-200 bg-white">
      <h1 className = "text-lg mb-5 text-center font-medium text-gray-600 pl-2 pt-2">Top 5 {type}</h1>

      <div className = "flex flex-col items-center gap-2">
        <h2 className = "bg-green-400 drop-shadow-lg py-3 px-2 text-center rounded-lg text-white font-semibold text-3xl sm:text-6xl">
          {formatTime(topTimesWithPlaceHolders[0])}
        </h2>
        <h3 className = "font-semibold mb-4 text-gray-600 ">Personal Best</h3>

        {(topTimesWithPlaceHolders.slice(1, 5)).map((time, idx) => {
          return (
            <div key = {idx} className = "flex place-content-between 
              py-1 px-2 w-35 sm:w-40 bg-gray-100 border-2 border-gray-100 rounded-lg text-xl">
              <span className = "text-gray-500">
                {idx + 2}{genSuffix(idx + 2)}  
              </span>

              <span className = "">
                {`${time === "N/A" ? "N/A" : formatTime(time)}`} 
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
  
}


