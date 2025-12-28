import {useState} from "react";

export const Game = (props) => {
  const competitors = props.competitors;
  const [solveNum, setSolveNum] = useState(1)
  console.log(competitors)
  return (
    <section className = "flex pt-20 justify-center w-screen h-screen bg-white">
      <h1 className="text-3xl">hello</h1> 
      <button type="" className = "bg-green-500 h-10 p-3 rounded-xl cursor-pointer">gen times</button>
      <div className="flex flex-col gap-2 bg-red-200 overflow-y-scroll">
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
    <div className = "flex flex-row w-3xl p-4 items-center rounded-md border-2 border-gray-200 gap-5">
      <div className = "flex flex-col gap-1">
        <h1 className = "w-40 truncate text-xl">{cuber.name}</h1>
        <h2 className = "text-gray-500">{cuber.id}</h2>
      </div>
      {cuber.times.map((time, idx) => {
        return (
          <div key = {idx}>
            {time}
          </div>
        )
      })}
    </div>
  )
}
