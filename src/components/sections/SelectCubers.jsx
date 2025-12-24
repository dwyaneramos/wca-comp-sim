import {useState, useEffect} from "react";

export const SelectCubers = () => {
  const [competitors, setCompetitors] = useState([]);


  return (
    <div>
      <h1>Hello</h1>
      <SearchBar/>
    </div>
  )
}




const SearchBar = () => {
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

  return (
    <div>
      <input onChange={(e) => setInput(e.target.value)} type="text" name="search bar" value={input}
             className = "bg-gray-400"/>
    </div>
  )
}
