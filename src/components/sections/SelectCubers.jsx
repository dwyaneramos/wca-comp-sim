import {useState, useEffect} from "react";
import { IoIosSearch } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import {searchCubers} from "../services/searchCubers.js"
import {addCompetitor} from "../utils/competitors.js"

export const SelectCubers = ({changePage, setCompetitors, competitors}) => {

  return (
    <div className= "flex content-center h-screen justify-center items-center mt-5">
      
      <div className ="flex items-center flex-col mx-auto gap-5 bg-gray-100 items-center rounded-xl  border-2 border-gray-200
                        w-[95vw] overflow-x-hidden sm:w-3xl h-[85vh]">
          <h1 className="text-2xl pb-3 pt-15">Add your competitors</h1>
          <SearchBar setCompetitors = {setCompetitors} competitors = {competitors}/>
          <button onClick={() => changePage("Game")} type="" className=" bg-green-500 py-2 cursor-pointer px-6 rounded-lg text-white text-lg">Start</button>
        
      <DisplayCompetitors competitors = {competitors} setCompetitors = {setCompetitors}/>

      </div>
    </div>
  )
}

const DisplayCompetitors = ({competitors, setCompetitors}) => {
  
  const removeCuber = (cuber) => {
    let filteredCubers = competitors.filter((c) => c != cuber)
    setCompetitors(filteredCubers)
  }


  return (
    <div className = "z-0  border-2 border-gray-200  py-5 sm:min-w-2xl sm:max-w-2xl w-full">
      <h1 className ="text-xl text-center ">Competitor List</h1>
      <h2 className ="text-lg text-gray-500 text-center border-b-2 border-gray-300 pb-5 mb-5">{competitors.length} registered</h2>

      {
        competitors.length > 0 &&
      <div className = "flex  gap-2 justify-center overflow-y-scroll content-start flex-wrap flex-row h-90">

        {competitors.map((cuber) => {
          return (
            <div key = {cuber.id} className = "flex flex-row h-15 bg-gray-100 w-2xs rounded-md px-1 hover:bg-gray-200 py-1   border-2 border-gray-300 "> 

              <div className = "flex flex-col w-full">
                
                    <h1 className="truncate">{cuber.name}</h1>
                    <h2 className = "text-gray-700">{cuber.id}</h2>
              </div>
              <div className="font-black cursor-pointer  transition p-3" onClick={() => removeCuber(cuber)}>x</div>
            </div>
          )
        })} 
      </div>
      }

      {
        competitors.length == 0 && 
          <div className = "flex items-center flex-col pt-10">
            <IoPersonAddOutline size={50} color={"gray"}/>
            <h1 className = "text-gray-500 text-lg pt-3">No competitors added</h1>
          </div>

      }
    </div>
  )


}




const SearchBar = ({setCompetitors, competitors}) => {
  const [input, setInput] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const Search = async (searchInput) => {
    const results = await searchCubers(input, competitors)
    setSearchResults(results)
  }

  useEffect(() => {
    const t = setTimeout(() => {
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
    setInput("")
    setSearchResults([])
    setCompetitors((prev) => addCompetitor(prev, newPlayer))
  }

  const resultsBorder = searchResults.length > 0 ? "border-2 border-gray-200" : ""
  return (
    <div className = "relative w-sm z-1 flex justify-center ">
      <div className = "flex flex-row justify-center">
        <input onChange={(e) => setInput(e.target.value)} type="text" name="search bar" value={input}
              className = "bg-gray-100 border-2 border-gray-300 rounded-md text-xl p-2 w-2xs sm:w-sm"/>
        <IoIosSearch size={35} className = "absolute ml-60 sm:ml-85 mt-1"/>
      </div>

      <div className = {`absolute flex mt-15 w-70 sm:w-full flex-col bg-gray-100 my-2 ${resultsBorder}`}>
        {searchResults.map((cuber) => {
          return (
            <div  key = {cuber.id} className = "flex flex-row hover:bg-gray-300 p-2 bg-gray-100 cursor-pointer"
                  onClick={() => addPlayer(cuber)}>
              
              <div className =  "w-40 sm:w-3xs truncate text-md sm:text-xl pr-5 ">

                {cuber.name}
              </div>
              <div className = "text-gray-700">
                {cuber.id} 
              </div>
            </div>
          )
        })} 
      </div>
    </div>
  )
}
