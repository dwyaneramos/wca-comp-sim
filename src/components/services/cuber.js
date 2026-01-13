import {DNF, INVALID_TIMES} from "../utils/constants.js"

export const createCuber = (id, name, times = [-1,-1,-1,-1,-1],  bpa = null, wpa = null, avg = null) => {
  return {
    id: id,
    name: name,
    times: times,
    avg: avg,
    bpa: bpa,
    wpa: wpa,
  }
}

export const createPlayer = (times = [-1,-1,-1,-1,-1], bpa = null, wpa = null, avg = null) => {
  return createCuber("Player", "Player", times, bpa, wpa, avg)

}

export const genPlayerWPABPA = (timesWOLastSolve, numSolves) => {
{/*
  Instead of a wpa and bpa for MO3 events, it will just be the average of the first 2 solves, hence why wpa and bpa are the same
*/}
  const bpa = numSolves == 5 ? ((timesWOLastSolve.reduce((acc, curr) => acc + curr, 0 ) - Math.max(...timesWOLastSolve)) / 3) : 
                                (timesWOLastSolve.reduce((acc, curr) => acc + curr, 0) / 2);

  let wpa = -1;
  if (timesWOLastSolve.includes(DNF)) {
    wpa = DNF
  } else {
    
    wpa = numSolves == 5 ? (timesWOLastSolve.reduce((acc, curr) => acc + curr, 0 ) - Math.min(...timesWOLastSolve)) / 3 :
                           bpa
  }
  return {bpa, wpa}
}

export const genPlayerAvg = (times, numSolves) => {

  const hasMultipleDNFs = (times) => {
    let dnfCount = 0;
    for (const t of times) {
      if (t == DNF) {
        dnfCount++;
      }

      if (dnfCount > 1) {
        return true;
      }
    }
    return false;

  }

  
  const avg = hasMultipleDNFs(times) ? DNF : 
              (numSolves == 5 ?  (times.reduce((acc, curr) => acc + curr, 0) - Math.min(...times) - Math.max(...times)) / 3 :
                                (times.reduce((acc, curr) => acc + curr, 0) / 3))
  return avg
}

export const createSimCuber = async (cuber, event, numSolves) => {
  const officialTimes = await fetchTimes(cuber, event)
  if (officialTimes.length <= 5) {
    throw new Error(`Insufficient official results to do simulations for ${cuber.name}`)

  }

  const mean = officialTimes.reduce((acc, curr) => acc + curr, 0) / officialTimes.length;


  let times = []
  for (let i = 0; i < numSolves; i++) {
    const time = genRandomTime(mean);
    times.push(time)
  }
  times = times;
  const timesWOLastSolve = times.slice(0, -1);
  const avg = genPlayerAvg(times, numSolves);
  const {bpa, wpa} = genPlayerWPABPA(timesWOLastSolve, numSolves);

  return createCuber(cuber.id, cuber.name, times, bpa, wpa, avg)

}


export const genRandomTime = (mean) => {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()

  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  const stdDev = 0.8
  const time = z * stdDev + mean;
  return time
}

export const fetchTimes = async (cuber, event) => {
  const apiLink = "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/" + cuber.id + ".json"
  const res = await fetch(apiLink)
  const json = await res.json()
  let recentTimes = []
  for (const [compKey, comp] of Object.entries(json.results)) {
    const eventResults = comp[event]
    if (eventResults) {
      for (const [roundKey, round] of Object.entries(eventResults)) {
        for (const solve of round.solves) {
          if (!(INVALID_TIMES.includes(solve))) {
            recentTimes.push(solve/100)
          }

          if (recentTimes.length >= 50) {
            return recentTimes
          }
        }
      }
    }
  }
  return recentTimes
} 




  

  


  

