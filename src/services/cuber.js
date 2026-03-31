import {DNF, INVALID_TIMES, BLD_EVENTS} from "../utils/constants.js"

export const createCuber = (id, name, times = [-1,-1,-1,-1,-1], country, bpa = null, wpa = null, avg = null) => {
  return {
    id: id,
    name: name,
    times: times,
    avg: avg,
    bpa: bpa,
    wpa: wpa,
    country: country,
  }
}

export const createPlayer = (times = [-1,-1,-1,-1,-1], country = "NZ", bpa = null, wpa = null, avg = null) => {
  return createCuber("Player", "Player", times, country, bpa, wpa, avg)

}

const isDNFed = (times, numSolves) => {
  let dnfCount = 0;
  for (const t of times) {
    if (t == DNF) {
      dnfCount++;
    }

    if ((dnfCount > 1) || (dnfCount == 1 & numSolves == 3)) {
      return true;
    }
  }
  return false;
}

export const genPlayerWPABPA = (timesWOLastSolve, numSolves) => {
{/*
  Instead of a wpa and bpa for MO3 events, it will just be the average of the first 2 solves, hence why wpa and bpa are the same
*/}
  let bpa = -1;
  if (isDNFed(timesWOLastSolve, numSolves)) {
      bpa = DNF;
  } else {

    bpa = numSolves == 5 ? ((timesWOLastSolve.reduce((acc, curr) => acc + curr, 0 ) - Math.max(...timesWOLastSolve)) / 3) : 
                                (timesWOLastSolve.reduce((acc, curr) => acc + curr, 0) / 2);
  }
  

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
  const avg = isDNFed(times, numSolves) ? DNF : 
              (numSolves == 5 ?  (times.reduce((acc, curr) => acc + curr, 0) - Math.min(...times) - Math.max(...times)) / 3 :
                                (times.reduce((acc, curr) => acc + curr, 0) / 3))
  return avg
}

export const createSimCuber = async (cuber, event, numSolves) => {
  const officialTimes = await fetchTimes(cuber, event)
  if (officialTimes.length <= 5) {
    throw new Error(`Insufficient official results to do simulations for ${cuber.name}`)

  }
  let times = []
  for (let i = 0; i < numSolves; i++) {
    const time = genRandomTime(officialTimes, event);
    times.push(time)
  }
  times = times;
  const timesWOLastSolve = times.slice(0, -1);
  const avg = genPlayerAvg(times, numSolves);
  const {bpa, wpa} = genPlayerWPABPA(timesWOLastSolve, numSolves);
  return createCuber(cuber.id, cuber.name, times, cuber.country, bpa, wpa, avg)

}


export const genRandomTime = (officialTimes, event) => {
  const eventStdDevFactor = {
    "sprint": 0.3,
    "med": 0.08,
    "big": 0.1,
    "bld": 0.15

  }


  const mean = officialTimes.reduce((acc, curr) => acc + curr, 0) / officialTimes.length;
  const variance = officialTimes.reduce((sum, val) => sum + (val - mean) ** 2, 0) / (officialTimes.length - 1)

  const dnfChance = BLD_EVENTS.includes(event) ? 0.5: 0.03 
  const roll = Math.random()
  if (roll <= dnfChance) {
    return DNF
  }
  
  {/* Using the Marsaglia method only works if for (mean**2 / variance) > 3*/}
  if ((mean ** 2 / variance) <= (1/3)) { 
    return randLogNormal(mean, variance)
  } else {
    return randGamma(mean, variance)
  }
}

const randGamma = (mean, variance) => {
  const gammaA = mean ** 2 / variance 
  const gammaT = variance / mean 

  const d = gammaA - (1/3)
  const c = 1 / (Math.sqrt(9 * d))
  
  while (true) {
    const u = Math.random()
    const n = randNormal()
    const v = (1 + c * n) ** 3 
    if (v > 0 && (Math.log(u) < (n ** 2 / 2 + d - d * v + d * Math.log(v)))) {
      return d * v * gammaT
    }
  }
}

const randNormal = () => {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()

  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return z

}

const randLogNormal = (mean, variance) => {
  // convert desired mean/std to log-space params
  const mu = Math.log(mean ** 2 / Math.sqrt(variance + mean ** 2));
  const sigma = Math.sqrt(Math.log(1 + variance / mean ** 2));

  return Math.exp(mu + sigma * randNormal());
};

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




  

  


  

