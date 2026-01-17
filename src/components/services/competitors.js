import {createSimCuber, createPlayer, genPlayerWPABPA, genPlayerAvg} from '../services/cuber.js'
import {PLAYER_ID, MO3_EVENTS} from "../utils/constants.js"




export const simulateAllCompetitors = async (competitorList, event) => {
   const numSolves = MO3_EVENTS.includes(event) ? 3 : 5
   const simmedCompetitors = await Promise.all (
    competitorList.map((c) => {
    if (c.id !== PLAYER_ID) {
      try {
        return createSimCuber(c, event, numSolves)
        } catch (err) {
          throw err;
        }
    } else {
      let timeSlots = new Array(numSolves); for (let i = 0; i < numSolves; i++) timeSlots[i] = -1
      return createPlayer(timeSlots) 
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

export const createPlayerWithNewTime = (c, solveNum, time, numSolvesInRound) => {
  let newTimes = [...c.times];
  newTimes[solveNum - 1] = (parseFloat(time));

  let updatedPlayer = null
  if (solveNum >= 4  || newTimes[-2] !== -1) {
    const timesWOLastSolve = newTimes.slice(0, -1)
    const {bpa, wpa} = genPlayerWPABPA(timesWOLastSolve, numSolvesInRound);
    const avg = genPlayerAvg(newTimes, numSolvesInRound);
    console.log(avg)
    updatedPlayer = createPlayer(newTimes, bpa, wpa, avg);
    
  } else {
    updatedPlayer = createPlayer(newTimes,)
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

export const savePlayerTimes = (player, event, prevStats, rank, competitorsInRound) => {
  function compareNumbers(a, b) {
    return a - b
  }

    const eventStats = prevStats[event]
    const currDate = new Date(Date.now()).toLocaleString().split(",")[0]
    const timesWithDates =  Array.from(
                            player.times.map(t => ({
                              time : t, 
                              date: currDate 
                                })
                          ))
    
    const newSolves = [...eventStats.solves, ...timesWithDates]

    let newBestTimes = [...eventStats.bestTimes, ...player.times]
    newBestTimes.sort(compareNumbers)
    newBestTimes = newBestTimes.slice(0, 5)


    let newBestAvgs = [...eventStats.bestAvgs, player.avg]
    newBestAvgs.sort(compareNumbers)
    newBestAvgs = newBestAvgs.slice(0, 5)
    
    const newNumRoundsDone = eventStats.numRoundsDone + 1
    const newAvgRank = (eventStats.avgPlacing * eventStats.numRoundsDone + rank) / newNumRoundsDone
    const newNumCompetitors = (eventStats.avgCompetitorsInRound * eventStats.numRoundsDone + competitorsInRound) / newNumRoundsDone
    const newPrAvgHistory = eventStats.prAvgHistory.length == 0 ? [{time: player.avg, date: currDate }] : 
                        (eventStats.prAvgHistory[eventStats.prAvgHistory.length - 1].time <= player.avg ? eventStats.prAvgHistory : [...eventStats.prAvgHistory, {time: player.avg, date: currDate}])
    
    const bestSingleThatRound = Math.min(...player.times)
    const newPrSinHistory = eventStats.prSinHistory.length == 0 ? [{time: bestSingleThatRound, date: currDate}] : 
                        (eventStats.prSinHistory[eventStats.prSinHistory.length - 1].time <= bestSingleThatRound ? eventStats.prSinHistory : [...eventStats.prSinHistory, {time: bestSingleThatRound, date: currDate}])
    let newPodiumCount = [...eventStats.podiumCount] 
    if (rank >= 1 && rank <= 3) {
      newPodiumCount[rank - 1]++;
    }

    console.log("new podium count ",newPodiumCount)
    return {
      ...prevStats,
      [event] : {
        bestTimes : newBestTimes,
        bestAvgs: newBestAvgs,
        solves: newSolves,
        numRoundsDone : newNumRoundsDone,
        avgPlacing : newAvgRank,
        avgCompetitorsInRound : newNumCompetitors,
        podiumCount : newPodiumCount,
        prAvgHistory : newPrAvgHistory,
        prSinHistory : newPrSinHistory
        
      }
    }
  

}
