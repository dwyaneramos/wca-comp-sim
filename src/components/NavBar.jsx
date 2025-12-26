export const NavBar = () => {
  return (
    <div className = "flex place-content-between bg-white drop-shadow-sm px-30 text-xl py-3 fixed top-0 w-screen">
      <div>
        <h1>WCA Comp Sim</h1>
      </div>

      <div className = "flex flex-row gap-2">
        <a href="" className="py-1">Home</a>
        <a href="" className="py-1">Stats</a>
       <SelectEventDropdown/> 
      </div>

    </div>

  )
}


const SelectEventDropdown = () => {
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
    <select className = "border-2 border-gray-300 rounded-md cursor-pointer p-1 text-center w-f">
      {wcaEvents.map((event) => {
        return (
          <option key={event.code} value={event.code}>{event.name}</option>
        )
      })}
      
    </select>
  )
}
