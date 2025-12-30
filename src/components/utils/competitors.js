import {createSimCuber} from '../services/cuber.js'

export const simulateAllCompetitors = async (competitorList) => {
  //TODO: not hardcode 333
   const simmedCompetitors = await Promise.all (
    competitorList.map((c) => {
    if (c.id !== "Player") {
      return createSimCuber(c, "333")
    } else {
      return createPlayer() 
    }
    
  })
  ) 
  return simmedCompetitors
}

export const addCompetitor = (competitorList, c) => {
  if (isCuberInList(competitorList, c)) {
    console.log("Cuber already registered")
    return competitorList;
  } else {
    console.log("Cuber added succesfully")
  {/*

    const c_obj = createSimCuber(c, "333")
  */}
    
    return [...competitorList, c];
  }

}

export const isCuberInList = (competitorList, c) => {
  for (let other of competitorList) {
    if (other.id == c.id && other.name == c.name) {
      return true;
    }
  }
  return false;
}
