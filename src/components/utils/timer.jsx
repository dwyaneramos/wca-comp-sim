import {useState, useEffect} from "react"


export const InspectionTimer = ({setInspection}) => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
  
    return () => clearInterval(interval)
  }, [])

  let inspectionBG = null;
  if (timeElapsed < 8) {
    inspectionBG = "bg-green-400"
  } else if (timeElapsed >= 8 && timeElapsed < 12) {
    inspectionBG = "bg-yellow-400"
  } else if (timeElapsed >= 12 && timeElapsed < 15) {
    inspectionBG = "bg-red-400"
  } else {
    inspectionBG = "bg-red-900"
  }

  

  return (
    <button onClick={()=>setInspection(false)} className = 
      {`transition-all duration-400 fixed  ${inspectionBG} border-gray-200 border-2 w-[105vw] h-screen z-100`}>
      <div className = " text-[25vw] w-full h-full flex items-center justify-center">
        {timeElapsed}
      </div>
     </button> 
  )
}
