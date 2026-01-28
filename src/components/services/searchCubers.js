import {isCuberInList} from '../services/competitors.js'

export const searchCubers = async (searchInput, competitors) => {
console.log("BASE_URL:", import.meta.env.BASE_URL)  // <-- add this line here
  let results = [] 
  const dataURL = new URL('cubers.json', import.meta.env.BASE_URL)
  const data = await fetch(dataURL)
  const dataJSON = await data.json()

  for (let cuber of dataJSON.cubers) {
    if (nameOrIDMatches(searchInput, cuber) && !isCuberInList(competitors, cuber)) {
      results.push(cuber)
      if (results.length >= 10) {
        break
      }
    }
  }
  return results
}

const nameOrIDMatches = (searchInput, cuber) => {
  return (cuber.name.toLowerCase().includes(searchInput.toLowerCase())) || (cuber.id.toLowerCase().includes(searchInput.toLowerCase()))


}
