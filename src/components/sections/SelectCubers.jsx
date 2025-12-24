import {useState, useEffect} from "react";

export const SelectCubers = () => {
  const [competitors, setCompetitors] = useState([]);


  useEffect(() => {
    console.log(competitors)
  }, [competitors])
 



  return (
    <div className ="flex flex-col items-center">
      <h1>Hello</h1>
      <SearchBar setCompetitors = {setCompetitors}/>
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
      <input onChange={(e) => setInput(e.target.value)} type="text" name="search bar" value={input}
             className = "bg-gray-400"/>
      <div className = "flex flex-col bg-gray-100 w-50">
        {searchResults.map((cuber) => {
          return (
            <div key = {cuber.id} className = "overflow-hidden truncate hover:bg-gray-200 cursor-pointer"
                 onClick={() => addPlayer(cuber)}>
              {cuber.name}
            </div>
          )
        })} 
      </div>
    </div>
  )
}
