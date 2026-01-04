import {useState, useEffect} from "react";


export const NavBar = ({changePage, disabledEventDropdown, setEvent}) => {
  const selectEventCallback = (newEvent) => {
    setEvent(newEvent.target.value)
  }

  const isSmall = window.innerWidth < 500

  return (
    <div className = "flex flex-col sm:place-content-between bg-white drop-shadow-sm sm:px-30 text-lg py-3 fixed top-0 w-screen">

      {isSmall && 
        <div className="flex flex-col justify-center items-center gap-2">

            <div className="flex flex-row gap-2">
              
              <h1 className = "text-lg py-2 font-bold">WCA Comp Sim</h1>
              <a href="" className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Home</a>
              <a href="" onClick={()=>changePage("")} className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Stats</a>
            </div>
              
              <SelectEventDropdown disabled = {disabledEventDropdown} onChange = {selectEventCallback}/> 
        </div>


      }

      {!isSmall && 
        <div className = "flex place-content-between">
          <div>
            <h1 className = "text-xl py-2 ">WCA Comp Sim</h1>
          </div>

          <div className = "flex flex-row gap-2">
            <a href="#" onClick={()=>changePage("Home")} className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Home</a>
            <a href="#" onClick={()=>changePage("Stats")}  className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Stats</a>
          <SelectEventDropdown disabled = {disabledEventDropdown} onChange = {selectEventCallback}/> 
          </div>
        </div>


      }

    </div>

  )
}



const SelectEventDropdown = ({ disabled, onChange }) => {
  const wcaEvents = [
    { name: "3x3x3 Cube", code: "333" },
    { name: "2x2x2 Cube", code: "222" },
    { name: "4x4x4 Cube", code: "444" },
    { name: "5x5x5 Cube", code: "555" },
    { name: "6x6x6 Cube", code: "666" },
    { name: "7x7x7 Cube", code: "777" },
    { name: "3x3x3 Blindfolded", code: "333bf" },
    { name: "3x3x3 Fewest Moves", code: "333fm" },
    { name: "3x3x3 One-Handed", code: "333oh" },
    { name: "Clock", code: "clock" },
    { name: "Megaminx", code: "minx" },
    { name: "Pyraminx", code: "pyram" },
    { name: "Skewb", code: "skewb" },
    { name: "Square-1", code: "sq1" },
    { name: "4x4x4 Blindfolded", code: "444bf" },
    { name: "5x5x5 Blindfolded", code: "555bf" },
    { name: "3x3x3 Multi-Blind", code: "333mbf" }
  ];
  return (
    <select disabled = {disabled} className = "border-2 border-gray-300 rounded-md cursor-pointer p-1 text-center w-3xs sm:w-f" onChange={onChange}>
      {wcaEvents.map((event) => {
        return (
          <option key={event.code} value={event.code}>{event.name}</option>
        )
      })}
      
    </select>
  )
}
