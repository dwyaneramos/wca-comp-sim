import {createSimCuber, createPlayer, genPlayerWPABPA, genPlayerAvg} from '../services/cuber.js'

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

export const addUser = (competitorList) => {
  const user = createPlayer();
  return [...competitorList, user]
}

export const createPlayerWithNewTime = (c, solveNum, time) => {
  let newTimes = [...c.times];
  newTimes[solveNum - 1] = (parseFloat(time));

  let updatedPlayer = null
  if (solveNum == 4) {
    const timesWOLastSolve = newTimes.slice(0, -1)
    const {bpa, wpa} = genPlayerWPABPA(timesWOLastSolve)
    updatedPlayer = createPlayer(newTimes, bpa, wpa);
    
  } else if (solveNum == 5) {
    const avg = genPlayerAvg(newTimes);
    updatedPlayer = createPlayer(newTimes, null, null, avg);
  }

  else {
    updatedPlayer = createPlayer(newTimes)
  }

  return updatedPlayer;
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
    if (other.id === c.id && other.name === c.name) {
      return true;
    }
  }
  return false;
}
