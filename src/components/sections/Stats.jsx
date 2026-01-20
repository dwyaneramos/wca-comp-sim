import {useState, useEffect} from "react"
import {Chart as ChartJS} from "chart.js/auto"
import {Bar, Line} from "react-chartjs-2"
import {genSuffix, formatTime } from "../utils/helper.js"
import {defaultStats} from "../services/competitors.js"
import {DNF} from "../utils/constants.js"


const SolvesLineGraph = (props) => {
  const numRecentSolves = 10
  const xRecentSolves = props.dataForGraph.data.slice(-numRecentSolves).map((solve, idx) => ({
    x : idx,
    y : solve.time,
    date: solve.date,
    idx: solve.idx
  }))
  console.log(xRecentSolves)
  const solvesToDisplay = xRecentSolves.filter((solve) => solve.y != DNF)
  console.log(solvesToDisplay)
  const solveNumsLabelsToDisplay = (solvesToDisplay.map((s) => "Result " + s.idx))


  return (
    <div className = " bg-white rounded-md drop-shadow-lg p-5 border-2 border-gray-200">
      
    <h1 className = "text-xl mb-2  text-gray-600">{props.dataForGraph.title}</h1>
    <div className="h-85">
      
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
                return [ `Time: ${value.toFixed(2)}`, 
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
  const eventNameLookup = {
  "333": "3x3x3 Cube",
  "222": "2x2x2 Cube",
  "444": "4x4x4 Cube",
  "555": "5x5x5 Cube",
  "666": "6x6x6 Cube",
  "777": "7x7x7 Cube",
  "333bf": "3x3x3 Blindfolded",
  "333fm": "3x3x3 Fewest Moves",
  "333oh": "3x3x3 One-Handed",
  "clock": "Clock",
  "minx": "Megaminx",
  "pyram": "Pyraminx",
  "skewb": "Skewb",
  "sq1": "Square-1",
  "444bf": "4x4x4 Blindfolded",
  "555bf": "5x5x5 Blindfolded",
  "333mbf": "3x3x3 Multi-Blind"
}
  const stats = props.stats 
  const eventStats = stats[event]
  const displayableData = [

    {
      data : eventStats.solves,
     title: "Most recent " + Math.min(10, eventStats.solves.length) + " solves"
    },

    {
      data : eventStats.prAvgHistory,
      title: "History of PR Averages"
    },

    {
      data : eventStats.prSinHistory,
      title: "History of PR Singles"
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
    <section className="mt-12 p-5 flex items-center flex-col gap-2">
      <h1 className = "bg-white w-2xl p-3 m-3 border-gray-200 
        drop-shadow-md border-2 text-center font-medium text-3xl rounded-lg">
        Competition Stats for {eventNameLookup[event]}</h1>
      <div className="grid grid-cols-5 gap-2 auto-rows-max w-full">
          
        <span className="col-span-1">
          <TopResultsSection className=""  type = {"Averages"} topTimes = {eventStats.bestAvgs}/>
        </span> 
        <span className="col-span-3">
          <SolvesLineGraph dataForGraph ={displayableData[dataForGraphIndex]}/>
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
    <button type="" onClick = {() => setDataForGraphIndex(newIndex)} className = "bg-green-400 p-2 h-full w-full text-white drop-shadow-md rounded-md text-2xl">Change Displayed Data</button>
  )
}

const ResetButton = ({resetStats}) => {
  return (
    <button onClick = {resetStats} className = "bg-red-500 text-2xl drop-shadow-md cursor-pointer h-full w-full rounded-md text-white" type="">
      Reset Stats
    </button>
  )
}

const CompSummaryStats = ({eventStats, event, times}) => {
  const roundedAvgPlacing = Math.round(eventStats.avgPlacing)
  const roundedAvgCompetitors = Math.round(eventStats.avgCompetitorsInRound)

  const moXAo5 = eventStats.tenRecentAvgs.length == 0 ? "N/A" : formatTime(eventStats.tenRecentAvgs.reduce((acc, curr) => acc + curr, 0 ) / eventStats.tenRecentAvgs.length)
  
  const mean = times.map((res) => res.time).reduce((acc, curr) => acc + curr, 0) / times.length 
  console.log(mean)
  return (
    <div className = " flex gap-4 text-center flex-row text-lg items-center w-full place-content-between bg-white drop-shadow-lg  rounded-md p-3 border-2 border-gray-200">
      <div className = "">
        <h2 className = "text-gray-600">Competitions</h2>
        <p>Simulated {eventStats.numRoundsDone} rounds</p>
      </div>

      <div className = "">
        <h2 className = "text-gray-600">Total Solves Done</h2>
        <p>{eventStats.solves.filter((solve) => solve.time != DNF).length} solves</p>
      </div>

      <div className = "flex flex-col items-center">
        <h2 className = "text-gray-600">Podium Count</h2>
        <div className = "flex flex-row bg-gray-100 gap-5 p-2 items-center justify-center rounded-md">
          <div className = "flex flex-col items-center ">
            <span className="text-3xl">🥇</span> 
            <span className="text-xl">{eventStats.podiumCount[0]}</span>
          </div>

          <div className = "flex flex-col items-center ">
            <span className="text-3xl">🥈</span> 
            <span className="text-xl">{eventStats.podiumCount[1]}</span>
          </div>

          <div className = "flex flex-col items-center ">
            <span className = "text-3xl">🥉</span> 
            <span className = "text-xl">{eventStats.podiumCount[2]}</span>
          </div>
          
        </div>

      </div>

      <div className = "">
        <h2 className = "text-gray-600">Mo{Math.min(10, eventStats.tenRecentAvgs.length)}Ao5</h2>
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
  return (
    <div className = "white p-2 pb-5 h-full rounded-md drop-shadow-md border-2 border-gray-200 bg-white">
      <h1 className = "text-xl mb-5 text-center font-medium text-gray-600 pl-2 pt-2">Top 5 {type}</h1>

      <div className = "flex flex-col items-center gap-2">
        <h2 className = "bg-green-400 drop-shadow-lg py-3 lg:w-45 w-30 text-center rounded-lg text-white font-semibold text-6xl">
          {formatTime(topTimes[0])}
        </h2>
        <h3 className = "font-semibold mb-4 text-gray-600 ">Personal Best</h3>

        {(topTimes.slice(1, 5)).map((time, idx) => {
          return (
            <div key = {idx} className = "flex place-content-between 
              py-1 px-2 w-40 bg-gray-100 border-2 border-gray-100 rounded-lg text-xl">
              <span className = "text-gray-500">
                {idx + 2}{genSuffix(idx + 2)}  
              </span>

              <span className = "">
                {formatTime(time)} 
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
  
}


const Top5Section = ({type, topTimes}) => {
  const rankColors = {0 : "bg-[#ebcc34]",
                      1 : "bg-[#9e9e9e]",
                      2 : "bg-[#f2a750]",
                      3 : "bg-gray-100",
                      4 : "bg-gray-100"}


  return (
    <div className = "w-3xs flex pt-3 flex-col items-center h-85 bg-white rounded-md border-2 border-gray-200 mb-5">
      <h1 className = "text-xl mb-3">Top 5 {type}:</h1>
      
      <div className = "flex flex-col gap-2">
        
        {topTimes.map((time, idx) => {
          return (
            <div key={idx} className={`flex place-content-between text-md rounded-xl  w-50 p-2 ${rankColors[idx]}`}>
              <span className = {`${rankColors[idx]} rounded-[100px] mr-2`}>{idx + 1}</span> 
              <span>{time.toFixed(2)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

}
