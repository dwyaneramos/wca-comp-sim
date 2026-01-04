import {createSimCuber, createPlayer, genPlayerWPABPA, genPlayerAvg} from '../services/cuber.js'

export const simulateAllCompetitors = async (competitorList, event) => {
  //TODO: not hardcode 333
   const simmedCompetitors = await Promise.all (
    competitorList.map((c) => {
    if (c.id !== "Player") {
      try {
        return createSimCuber(c, event)
        } catch (err) {
          throw err;
        }
    } else {
      return createPlayer() 
    }
    
  })
  ) 
  return simmedCompetitors
}

export const addUser = (competitorList) => {
  
  const user = createPlayer();
  if (isCuberInList(competitorList, user)) {
    return competitorList
  }
  return [...competitorList, user]
}

export const createPlayerWithNewTime = (c, solveNum, time) => {
  let newTimes = [...c.times];
  newTimes[solveNum - 1] = (parseFloat(time));

  let updatedPlayer = null
  if (solveNum >= 4  || newTimes[-2] !== -1) {
    const timesWOLastSolve = newTimes.slice(0, -1)
    const {bpa, wpa} = genPlayerWPABPA(timesWOLastSolve);
    const avg = genPlayerAvg(newTimes);
    console.log(avg)
    updatedPlayer = createPlayer(newTimes, bpa, wpa, avg);
    
  } else {
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

export const savePlayerTimes = (player, event, prevStats) => {
  function compareNumbers(a, b) {
    return a - b
  }

    const eventStats = prevStats[event]
    const newSolves = [...eventStats.solves, ...player.times]
    let newBestTimes = [...eventStats.bestTimes, ...player.times]
    newBestTimes.sort(compareNumbers)
    newBestTimes = newBestTimes.slice(0, 5)


    let newBestAvgs = [...eventStats.bestAvgs, player.avg]
    newBestAvgs.sort(compareNumbers)
    newBestAvgs = newBestAvgs.slice(0, 5)


    return {
      ...prevStats,
      [event] : {
        bestTimes : newBestTimes,
        bestAvgs: newBestAvgs,
        solves: newSolves
      }
    }
  

}
