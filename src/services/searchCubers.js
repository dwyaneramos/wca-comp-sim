import {isCuberInList} from '../services/competitors.js'

export const searchCubers = async (searchInput, competitors, updateProgress) => {
  let results = [] 
  const dataURL = "/wca-comp-sim/cubers.json"
  const data = await fetch(dataURL)
  const dataJSON = await data.json()
  
  let numCubersTraversed = 0
  const chunkSize = 5000


  for (let i = dataJSON.cubers.length - 1; i >= 0; i--) {
    const cuber = dataJSON.cubers[i]
    if (nameOrIDMatches(searchInput, cuber) && !isCuberInList(competitors, cuber)) {
      results.push(cuber)
      if (results.length >= 10) {
        updateProgress([...results])
        return
      }
    }
    numCubersTraversed++
    if (numCubersTraversed >= chunkSize) {
      updateProgress([...results])
      numCubersTraversed = 0
      await new Promise(r => setTimeout(r, 0))
    }

  }
  updateProgress([...results])
}

const nameOrIDMatches = (searchInput, cuber) => {
  return (cuber.name.toLowerCase().includes(searchInput.toLowerCase())) || (cuber.id.toLowerCase().includes(searchInput.toLowerCase()))


}
