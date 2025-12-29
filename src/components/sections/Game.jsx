import {useState, useEffect} from "react";



export const Game = (props) => {
  const competitors = props.competitors;
  const [solveNum, setSolveNum] = useState(0)
  const [canViewOtherTimes, setViewOtherTimes] = useState(true)
  const solves = [1,2,3,4,5]
  const numSolvesInRound = competitors[0].times.length
  const [ toggleButtonDisabled, setToggleDisability] = useState(false);
  console.log(competitors)

  useEffect(() => {
    console.log(solveNum, numSolvesInRound, "AHHH")
    if (solveNum == numSolvesInRound) {
      setViewOtherTimes(true);
      setToggleDisability(true);

    }
  }, [solveNum])


  if (solveNum >= 1 && solveNum <= numSolvesInRound - 1) {
    competitors.sort(function(c1, c2) {return Math.min(...c1.times.slice(0,solveNum)) - Math.min(...c2.times.slice(0,solveNum))} )
  } else if (solveNum == numSolvesInRound) {
    competitors.sort(function(c1, c2) {return c1.avg - c2.avg})
  }
  return (
    <section className = "flex flex-col pt-20 items-center gap-3  w-screen h-screen bg-white">
      <h1 className="text-3xl">hello</h1> 
      <button type="" onClick={() => setSolveNum(solveNum + 1)} className = "bg-green-500 h-10 p-3 rounded-xl cursor-pointer">gen times</button>
      <ToggleShowOtherTimes disabled = {toggleButtonDisabled} canViewOtherTimes = {canViewOtherTimes} setViewOtherTimes = {setViewOtherTimes}/>
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
              <PlayerRow cuber = {cuber} solveNum = {solveNum} canViewOtherTimes = {canViewOtherTimes}/> 
            </div>
          )
        })}
        
      </div>
    </section>
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
  if (solveNum == cuber.times.length -1) {
      avgToDisplay = cuber.bpa.toFixed(2) + "/" + cuber.wpa.toFixed(2)
  } else if (solveNum == cuber.times.length) {
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
          {avgToDisplay = canViewOtherTimes ? avgToDisplay : "#####"}
        </h1>
      }
    
    </div>
  )
}
