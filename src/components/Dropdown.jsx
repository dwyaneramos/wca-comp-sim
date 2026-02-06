import Select from "react-select"
import {countryToFlag, countries} from "./services/nationality.js"

export const SelectEventDropdown = ({setEvent, defaultEvent }) => {
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
      defaultValue = {{value : defaultEvent, label : wcaEvents.find((e) => e.value === defaultEvent).label}} menuPortalTarget={document.body}

      classNames = {{
          control: ({isFocused}) => `w-55 h-10`,
        }}

    />

  
  )
}

export const NationalityDropdown = ({defaultNationality, setNationality}) => {
  const options =  Object.entries(countries).map(([id, c]) => ({value: id, label: `${c.flag} ${c.name}`}))
  return (
  <Select options={options} onChange={(option) => setNationality(option.value)}
    defaultValue={{value : defaultNationality, label: `${countryToFlag(defaultNationality)} ${countries[defaultNationality].name}`}} menuPortalTarget={document.body}

    classNames={{
        control: ({ isFocused }) => `w-3xs h-10`,
      
      }}/>
  )
}
