import {Chart as ChartJS} from "chart.js/auto"
import {Bar, Line} from "react-chartjs-2"


const SolvesLineGraph = (props) => {
  const solveNums = Array.from({length: props.eventStats.solves.length}, (_, i ) => i + 1)
  const xRecentSolves = 10
  const solvesToDisplay = props.eventStats.solves.slice(-xRecentSolves)
  const solveNumsLabelsToDisplay = (solveNums.slice(-xRecentSolves)).map((s) => "Solve " + s)
  console.log(solveNumsLabelsToDisplay)


  return (
    <div className="w-200 bg-white h-full p-5 rounded-md border-2 border-gray-200">
      <h1 className = "text-xl m-2">Most Recent {solvesToDisplay.length} solves</h1>
      
      <Line data = {{
        labels: solveNumsLabelsToDisplay,
        datasets: [
          {
            label: "Time",
            data: solvesToDisplay,
            tension: 0.3
          }
        ]

      }}

      options = {{
          responsive: true,
          plugins : {
            legend : {
              display: false
            }
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

  )
}

export const Stats = (props) => {
  const event = props.event
  const stats = props.stats 
  const eventStats = stats[event]

   return (
    <section className="mt-15 p-5">

      <div className="flex flex-col justify-center items-center place-content-around">

        <div className = "flex flex-row ">
          <Top5Section type = {"Averages"} topTimes = {eventStats.bestAvgs}/>
          <CompStats eventStats = {eventStats} event = {event}/>
          <Top5Section type = {"Singles"} topTimes = {eventStats.bestTimes}/>
        </div>
        <SolvesLineGraph eventStats ={eventStats}/>
      </div>
    </section>
  )
}

const CompStats = ({eventStats, event}) => {
  return (
    <div className = "bg-white w-2xs h-85 rounded-md p-3 border-2 border-gray-200">
      <h1 className = "text-lg">Competition Stats for {event}</h1>
      <div className = "my-2">
        <h2 className = "text-gray-600">Competitions</h2>
        <p>Simulated {eventStats.numRoundsDone} rounds</p>
      </div>

      <div className = "my-2">
      <h2 className = "text-gray-600">Total Solves Done</h2>
      <p>{eventStats.solves.length} solves</p>
      </div>

      <div className = "my-2">
      <h2 className = "text-gray-600">Average Placing</h2>
      <p>{eventStats.avgPlacing.toFixed(2)} out of {eventStats.avgCompetitorsInRound}</p>
      </div>
      



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
  )
}

const Graph = () => {
  return (
    <div className="bg-red-200 w-200 h-200">
      aj
    </div>
  )
}


const Top5Section = ({type, topTimes}) => {
  const rankColors = {0 : "bg-[#ebcc34]",
                      1 : "bg-[#9e9e9e]",
                      2 : "bg-[#f2a750]",
                      3 : "bg-[#d1d1d1]",
                      4 : "bg-[#d1d1d1]"}


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
