import {useState} from "react";

export const Game = (props) => {
  const competitors = props.competitors;
  const [solveNum, setSolveNum] = useState(1)
  const solves = [1,2,3,4,5]
  console.log(competitors)
  console.log(solveNum)
  return (
    <section className = "flex flex-col pt-20 items-center justify-center w-screen h-screen bg-white">
      <h1 className="text-3xl">hello</h1> 
      <button type="" onClick={() => setSolveNum(solveNum + 1)} className = "bg-green-500 h-10 p-3 rounded-xl cursor-pointer">gen times</button>
      <div className="flex flex-col gap-2  overflow-y-scroll">
        <div className = "flex flex-row w-3xl pl-50 py-2 items-center rounded-md border-2 border-gray-200 gap-5">
          {solves.map((s) => {
            return (
              <h1 key ={s}>Solve {s}</h1>
            )
          })}
          <h1>Average: </h1>

          
        </div>
        {competitors.map((cuber) => {
          return (
            <div key = {cuber.id}>
              <PlayerRow cuber = {cuber} solveNum = {solveNum}/> 
            </div>
          )
        })}
        
      </div>
    </section>
  )
}

const PlayerRow = ({cuber, solveNum}) => {
  return (
    <div className = "flex flex-row w-3xl p-4 items-center rounded-md border-2 border-gray-200 gap-10">
      <div className = "flex flex-col gap-1">
        <h1 className = "w-40 truncate text-xl">{cuber.name}</h1>
        <h2 className = "text-gray-500">{cuber.id}</h2>
      </div>
      {cuber.times.map((time, idx) => {
        const timeToDisplay = idx + 1 <= solveNum ? time.toFixed(2) : "#####"
        return (
          <div key = {idx}>
            {timeToDisplay}
          </div>
        )
      })}
    </div>
  )
}
