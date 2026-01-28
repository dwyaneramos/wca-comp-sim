import {useState, useEffect} from "react";
import {countryToFlag, countries} from "./services/nationality.js"
import Select from "react-select"


export const NavBar = ({changePage, disabledEventDropdown, setEvent, defaultEvent, setNationality, defaultNationality}) => {
  const isSmall = window.innerWidth < 500
  

  return (
    <div className = "flex flex-col sm:place-content-between bg-white drop-shadow-sm sm:px-30 text-lg py-3 fixed top-0 w-screen z-100">

      {isSmall && 
        <div className="flex flex-col justify-center items-center gap-2">

            <div className="flex flex-row gap-2">
              
              <h1 className = "text-lg py-2 font-bold">WCA Comp Sim</h1>
              <a href="" className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Home</a>
              <a href="" onClick={()=>changePage("")} className="py-1 hover:bg-gray-200 transition py-2 px-3 rounded-md">Stats</a>
            </div>
              
              <SelectEventDropdown disabled = {disabledEventDropdown} setEvent = {setEvent} defaultEvent={defaultEvent}/> 
          <NationalityDropdown disabled = {disabledEventDropdown} defaultNationality={defaultNationality} setNationality = {setNationality}/>
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
          <SelectEventDropdown disabled = {disabledEventDropdown} setEvent = {setEvent} defaultEvent={defaultEvent}/> 
          <NationalityDropdown disabled = {disabledEventDropdown} defaultNationality={defaultNationality} setNationality = {setNationality}/>
          </div>
        </div>


      }

    </div>

  )
}

const NationalityDropdown = ({disabled, defaultNationality, setNationality}) => {
  const options =  Object.entries(countries).map(([id, c]) => ({value: id, label: `${c.flag} ${c.name}`}))
  return (
  <Select options={options} onChange={(option) => setNationality(option.value)} 
    defaultValue={{value : defaultNationality, label: `${countryToFlag(defaultNationality)} ${countries[defaultNationality].name}`}}
    classNames={{
        control: ({ isFocused }) => `w-3xs h-10`,
      
      }}/>
  )
}



const SelectEventDropdown = ({ disabled, setEvent, defaultEvent }) => {
  const wcaEvents = [
    { label: "3x3x3 Cube", value: "333" },
    { label: "2x2x2 Cube", value: "222" },
    { label: "4x4x4 Cube", value: "444" },
    { label: "5x5x5 Cube", value: "555" },
    { label: "6x6x6 Cube", value: "666" },
    { label: "7x7x7 Cube", value: "777" },
    { label: "3x3x3 Blindfolded", value: "333bf" },
    { label: "3x3x3 Fewest Moves", value: "333fm" },
    { label: "3x3x3 One-Handed", value: "333oh" },
    { label: "Clock", value: "clock" },
    { label: "Megaminx", value: "minx" },
    { label: "Pyraminx", value: "pyram" },
    { label: "Skewb", value: "skewb" },
    { label: "Square-1", value: "sq1" },
    { label: "4x4x4 Blindfolded", value: "444bf" },
    { label: "5x5x5 Blindfolded", value: "555bf" },
  ];
  return (
    <Select options = {wcaEvents} onChange = {(event) => setEvent(event.value)}
      defaultValue = {{value : defaultEvent, label : wcaEvents.find((e) => e.value === defaultEvent).label}}
      classNames = {{
          control: ({isFocused}) => `w-55 h-10`,
        }}

    />

  
  )
}
