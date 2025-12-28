const invalidTimes = [-1, -2, 0]

export class Cuber  {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.times = [1,2,3];
  }
  async genTimes(event) {
    const apiLink = "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons/" + this.id + ".json"
    const res = await fetch(apiLink)
    const json = await res.json()
    let recentTimes = []
    for (const [compKey, comp] of Object.entries(json.results)) {
      const eventResults = comp[event]
      if (eventResults) {
        for (const [roundKey, round] of Object.entries(eventResults)) {
          for (const solve of round.solves) {
            if (!(solve in invalidTimes)) {
              recentTimes.push(solve/100)
            }

            if (recentTimes.length >= 50) {
              this.times = recentTimes;
              console.log(this.times)
              return
            }
          }
        }
      }
    }
    this.times = recentTimes;
    console.log(this.times)


  } 
  
}
