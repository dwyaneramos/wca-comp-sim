
export const searchCubers = async (searchInput) => {
  let results = [] 
  const dataURL = "../../../public/cubers.json"
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
  return results
}
