import { useState, useEffect } from "react"

const typeConfigLookup = {
  "error": { bgColor: "bg-red-500", textColor: "text-white", header: "Uh Oh!" },
}



export const Toast = ({ text, type, setShowToast }) => {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const delayBeforeExit = 300
  const timeElapsedBeforeExit = 5

  useEffect(() => {

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {


    if (timeElapsed > timeElapsedBeforeExit) {
      setIsExiting(true)
      console.log(timeElapsed, isExiting)
      setTimeout(() => setShowToast(null), delayBeforeExit)
    }
  }, [timeElapsed, isExiting])


  const typeConfig = typeConfigLookup[type]
  const animation = isExiting ? "animate-toast-exit" : "animate-toast-enter"
  return (
    <div className={`fixed transition-all left-1/2 -translate-x-1/2 ${animation} flex flex-col bottom-5 z-100 w-xs ${typeConfig.bgColor} ${typeConfig.textColor} p-3 rounded-md shadow-lg`}
      onClick={() => {
        setIsExiting(true)
        setTimeout(() => setShowToast(null), delayBeforeExit)
      }}>
      <span className="text-lg">{typeConfig.header}</span>
      <span className="text-md">{text}</span>
      <span className="transition-all pr-1 absolute top-2 right-2 text-white text-lg cursor-pointer hover:-translate-y-1">x</span>
    </div >
  )
}
