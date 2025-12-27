import {isCuberInList} from '../utils/competitors.js'

export const searchCubers = async (searchInput, competitors) => {
  let results = [] 
  const dataURL = "../../../public/cubers.json"
  const data = await fetch(dataURL)
  const dataJSON = await data.json()

  for (let cuber of dataJSON.cubers) {
    if (cuber.name.toLowerCase().includes(searchInput.toLowerCase()) && !isCuberInList(competitors, cuber)) {
      results.push(cuber)
      if (results.length >= 10) {
        break
      }
    }
  }
  return results
}
