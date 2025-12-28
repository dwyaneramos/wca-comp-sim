const invalidTimes = [-1, -2, 0]

export class Cuber  {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.officialTimes = [1,2,3];
    this.sd = -1;
    this.mean = -1;
  }

  
  calcSDandMean() {
    this.mean = this.officialTimes.reduce((acc, curr) => acc + curr, 0) / this.officialTimes.length;

    const arr = this.officialTimes.map((k) => {
      return (k - this.mean) ** 2
    })

    let sum = arr.reduce((acc, curr) => acc + curr, 0);
    this.sd = Math.sqrt((sum / this.officialTimes.length))

    console.log(this.mean)
    console.log(this.sd)
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
              this.officialTimes = recentTimes;
              this.calcSDandMean();
              console.log(this.officialTimes)
              return
            }
          }
        }
      }
    }
    this.officialTimes = recentTimes;
    this.calcSDandMean();
  } 

  
}
