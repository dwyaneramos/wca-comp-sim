import {createSimCuber, createPlayer, genPlayerWPABPA, genPlayerAvg} from '../services/cuber.js'
import {PLAYER_ID, MO3_EVENTS, EVENTS, BLD_EVENTS} from "../utils/constants.js"

export const rankCompetitors = (competitors, solveNum, numSolvesInRound, event, areCubersRanked) => {
  let sortedCompetitors = [...competitors];
  if ((solveNum >= 1 && solveNum <= numSolvesInRound - 1 && areCubersRanked) || BLD_EVENTS.includes(event)) {
    sortedCompetitors = sortedCompetitors.sort(function(c1, c2) {return Math.min(...c1.times.slice(0,solveNum)) - Math.min(...c2.times.slice(0,solveNum))} )
  } else if (solveNum == numSolvesInRound) {
    sortedCompetitors = sortedCompetitors.sort(function(c1, c2) {return c1.avg - c2.avg})
  }
  return sortedCompetitors
}

export const simulateAllCompetitors = async (competitorList, event, nationality) => {
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
      return createPlayer(timeSlots, nationality) 
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

export const createPlayerWithNewTime = (c, solveNum, time, numSolvesInRound, nationality) => {
  let newTimes = [...c.times];
  newTimes[solveNum - 1] = (parseFloat(time)); 

  let updatedPlayer = null
  if (solveNum >= 4  || newTimes[-2] !== -1) {
    const timesWOLastSolve = newTimes.slice(0, -1)
    const {bpa, wpa} = genPlayerWPABPA(timesWOLastSolve, numSolvesInRound);
    const avg = genPlayerAvg(newTimes, numSolvesInRound);
    updatedPlayer = createPlayer(newTimes, nationality, bpa, wpa, avg);
    
  } else {
    updatedPlayer = createPlayer(newTimes, nationality) 
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


export const defaultStats = () => {
  return { bestTimes: [], bestAvgs: [], solves: [], numRoundsDone: 0, avgPlacing: 0, avgCompetitorsInRound: 0, podiumCount : [0, 0, 0], tenRecentAvgs: [], prAvgHistory: [], prSinHistory: [] }
}


export const startingStats = Object.fromEntries(
  EVENTS.map(ev => [ev, defaultStats()])
)

export const savePlayerTimes = (player, event, prevStats, rank, competitorsInRound) => {
  function compareNumbers(a, b) {
    return a - b
  }

    const eventStats = prevStats[event]
    const currDate = new Date(Date.now()).toLocaleString().split(",")[0]
    let startIdx = eventStats.solves.length == 0 ? 1 : (eventStats.solves[eventStats.solves.length - 1]).idx + 1
    const timesWithInfo =  Array.from(
                            player.times.map((t, i) => ({
                              time : t, 
                              date: currDate,
                              idx: startIdx + i

                                })
                          ))
    
    const newSolves = [...eventStats.solves, ...timesWithInfo]

    let newBestTimes = [...eventStats.bestTimes, ...player.times]
    newBestTimes.sort(compareNumbers)
    newBestTimes = newBestTimes.slice(0, 5)


    let newBestAvgs = [...eventStats.bestAvgs, player.avg]
    newBestAvgs.sort(compareNumbers)
    newBestAvgs = newBestAvgs.slice(0, 5)
    
    const newNumRoundsDone = eventStats.numRoundsDone + 1
    const newAvgRank = (eventStats.avgPlacing * eventStats.numRoundsDone + rank) / newNumRoundsDone
    const newNumCompetitors = (eventStats.avgCompetitorsInRound * eventStats.numRoundsDone + competitorsInRound) / newNumRoundsDone
    const newPrAvgHistory = eventStats.prAvgHistory.length == 0 ? [{time: player.avg, date: currDate, idx : 1 }] : 
                        (eventStats.prAvgHistory[eventStats.prAvgHistory.length - 1].time <= player.avg ? eventStats.prAvgHistory :
                          [...eventStats.prAvgHistory, {time: player.avg, date: currDate, idx : eventStats.prAvgHistory[eventStats.prAvgHistory.length - 1].idx + 1}])
    
    const bestSingleThatRound = Math.min(...player.times)
    const newPrSinHistory = eventStats.prSinHistory.length == 0 ? [{time: bestSingleThatRound, date: currDate, idx : 1}] : 
                        (eventStats.prSinHistory[eventStats.prSinHistory.length - 1].time <= bestSingleThatRound ? eventStats.prSinHistory :
                      [...eventStats.prSinHistory, {time: bestSingleThatRound, date: currDate, idx : eventStats.prSinHistory[eventStats.prSinHistory.length - 1].idx + 1}])
    
    // Save BO3/5 instead of Avg of 5 for BLD events
    const avgToSubmit = BLD_EVENTS.includes(event) ? Math.min(...player.times) : player.avg 

    let newTenRecentAvgs = eventStats.tenRecentAvgs

    const lastIdx = newTenRecentAvgs.length == 0 ? 1 : newTenRecentAvgs[newTenRecentAvgs.length - 1].idx
    newTenRecentAvgs = newTenRecentAvgs.length == 0 ? [{time : avgToSubmit, date: currDate, idx : 1}] :
                            newTenRecentAvgs.length >= 10 ? [...(newTenRecentAvgs.slice(1)), 
                              {time: avgToSubmit, date: currDate, idx : lastIdx + 1}] : 
                            [...newTenRecentAvgs, {time: avgToSubmit, date: currDate, idx : lastIdx + 1}]
    


    let newPodiumCount = [...eventStats.podiumCount] 
    if (rank >= 1 && rank <= 3) {
      newPodiumCount[rank - 1]++;
    }

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
        tenRecentAvgs : newTenRecentAvgs,
        prAvgHistory : newPrAvgHistory,
        prSinHistory : newPrSinHistory
        
      }
    }
  

}
