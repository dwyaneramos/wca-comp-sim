const invalidTimes = [-1, -2, 0]


export const createCuber = (id, name, times = [], avg = null, bpa = null, wpa = null) => {
  return {
    id: id,
    name: name,
    times: times,
    avg: avg,
    bpa: bpa,
    wpa: wpa,
  }
}

export const createPlayer = (times = []) => {
  return createCuber("Player", "Player", times)

}

export const genPlayerWPABPA = (player) => {
  const bpa = (timesWOLastSolve.reduce((acc, curr) => acc + curr, 0 ) - Math.max(...timesWOLastSolve)) / 3;
  const wpa = (timesWOLastSolve.reduce((acc, curr) => acc + curr, 0 ) - Math.min(...timesWOLastSolve)) / 3;
  return [bpa, wpa]
}

export const createSimCuber = async (cuber, event) => {
  const officialTimes = await fetchTimes(cuber, event)
  const mean = officialTimes.reduce((acc, curr) => acc + curr, 0) / officialTimes.length;


  let times = []
  for (let i = 0; i < 5; i++) {
    const time = genRandomTime(mean);
    times.push(time)
  }
  times = times;
  const avg = (times.reduce((acc, curr) => acc + curr, 0) - Math.min(...times) - Math.max(...times)) / 3;
  const timesWOLastSolve = times.slice(0, -1);
  const bpa = (timesWOLastSolve.reduce((acc, curr) => acc + curr, 0 ) - Math.max(...timesWOLastSolve)) / 3;
  const wpa = (timesWOLastSolve.reduce((acc, curr) => acc + curr, 0 ) - Math.min(...timesWOLastSolve)) / 3;

  return createCuber(cuber.id, cuber.name, times, avg, bpa, wpa)

}


export const genRandomTime = (mean) => {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()

  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  const stdDev = 0.2
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
          if (!(invalidTimes.includes(solve))) {
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




  

  


  

