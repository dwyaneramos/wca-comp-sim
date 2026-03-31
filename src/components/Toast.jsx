const typeConfigLookup = {
  "error": { bgColor: "bg-red-500", textColor: "text-white", header: "Uh Oh!" },
}



export const Toast = ({ text, type, setShowToast }) => {
  const typeConfig = typeConfigLookup[type]
  console.log(typeConfig)
  return (
    <div className={`fixed transition-all left-1/2 -translate-x-1/2 animate-toast flex flex-col bottom-5 z-100 w-xs ${typeConfig.bgColor} ${typeConfig.textColor} p-3 rounded-md shadow-lg`} >
      <span className="text-lg">{typeConfig.header}</span>
      <span className="text-md">{text}</span>
      <span onClick={() => setShowToast(null)} className="transition-all pr-1 absolute top-2 right-2 text-white text-lg cursor-pointer hover:-translate-y-1">x</span>
    </div >
  )
}
