import {useState, useEffect} from "react";
import { IoIosSearch } from "react-icons/io";

export const SelectCubers = () => {
  const [competitors, setCompetitors] = useState([]);


  useEffect(() => {
    console.log(competitors)
  }, [competitors])
 



  return (
    <div className ="flex flex-row justify-center gap-5">
      <div>
        <h1 className="text-2xl py-3">Add your competitors</h1>
        <SearchBar setCompetitors = {setCompetitors}/>
      </div>
      
      <DisplayCompetitors competitors = {competitors}/>

    </div>
  )
}

const DisplayCompetitors = ({competitors}) => {
  return (
    <div>
      <h1 className ="text-xl border-b-2 border-black">Added Competitors</h1>
      <div className = "flex flex-col">
        {competitors.map((cuber) => {
          return (
            <div key = {cuber.id} className = "bg-gray-100 px-2 hover:bg-gray-200 py-1 w-4xs flex place-content-between"> 
              <span>{cuber.name}</span>
              <span className="font-black cursor-pointer hover:scale-125 transition">x</span>
            </div>
          )
        })} 
      </div>
    </div>


  )


}




const SearchBar = ({setCompetitors}) => {
  const [input, setInput] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const dataURL = "../../../public/cubers.json"


  useEffect(() => {
    console.log(searchResults)
  }, [searchResults])

  const Search = async (searchInput) => {
    let results = [] 
    const data = await fetch(dataURL)
    const dataJSON = await data.json()

    for (let cuber of dataJSON.cubers) {
      if (cuber.name.toLowerCase().includes(searchInput.toLowerCase())) {
        results.push(cuber)
        if (results.length >= 10) {
          break
        }
      }
    }
    setSearchResults(results)
  }


  useEffect(() => {
    const t = setTimeout(() => {
      console.log(input)
      if (input) {
        Search(input)
      } else {
        setSearchResults([])
      }

      }, 500);
    return () => {
      clearTimeout(t);
    }

  }, [input])

  const addPlayer = (newPlayer) => {
    console.log("Added player successfully")
    setInput("")
    setSearchResults([])
    setCompetitors((prev) => [...prev, newPlayer])
  }
  return (
    <div className = "">
      <div className = "flex flex-row w-2xs">
        <input onChange={(e) => setInput(e.target.value)} type="text" name="search bar" value={input}
              className = "bg-gray-300 rounded-md text-xl p-2 w-2xs"/>
        <IoIosSearch size={35} className = "absolute ml-62"/>
      </div>
      <div className = "flex flex-col bg-gray-100 my-2">
        {searchResults.map((cuber) => {
          return (
            <div key = {cuber.id} className = "p-2 w-2xs truncate  cursor-pointer
                                              text-xl hover:bg-gray-200"
                 onClick={() => addPlayer(cuber)}>
              {cuber.name}
            </div>
          )
        })} 
      </div>
    </div>
  )
}
