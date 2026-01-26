import {countryToContinent, countries} from "./nationality.js"


const applyRecord = (records, recordType, AvgOrSin, result, country) => {
    if (recordType === "NR" || recordType === "CR" || recordType === "WR") {
      records.nationalRecords[country] = {
        ...records.nationalRecords[country],
        [AvgOrSin] : result,
      }
    }

    if (recordType === "CR" || recordType === "WR") {
      const continent = countries[country].continent   
      records.continentalRecords[continent] = {
        ...records.continentalRecords[continent],
        [AvgOrSin] : result,
      }
    }

    if (recordType === "WR") {
      records.worldRecords = {
        ...records.worldRecords,
        [AvgOrSin] : result,
      };
    }
  }

export const updateRecords = (prevRecords, competitors, solveNum, numSolvesInRound) => {

  if (!prevRecords) return prevRecords;
    let currRecords = structuredClone(prevRecords);

    for (const c of competitors) {
      // check single
      for (let i = 0; i < solveNum; i++) {
        const isSinRecord = checkIfSinRecord(c.times[i], currRecords, c.country);
        if (isSinRecord !== false) {
          applyRecord(currRecords, isSinRecord, "sin", c.times[i], c.country)
        }

      }
    // check average if applicable
    if (solveNum === numSolvesInRound) {
        const isAvgRecord = checkIfAvgRecord(c.avg, currRecords, c.country);
        if (isAvgRecord !== false) {
        applyRecord(currRecords, isAvgRecord, "avg", c.avg, c.country)
      }
    }
  }



  return currRecords

}

export const checkIfAvgRecord = (time, records, country) => {
  if (records === null) {
    return false
  } else if (time <= records.worldRecords.avg) {
    return "WR"
  } else if (time <= records.continentalRecords[countries[country].continent].avg) {
    return "CR"
  } else if (time <= records.nationalRecords[country].avg) {
    return "NR"
  } else {
    return false
  }
}
export const checkIfSinRecord = (time, records, country) => {
  if (records === null) {
    return false
  } else if (time <= records.worldRecords.sin) {
    return "WR"
  } else if (time <= records.continentalRecords[countries[country].continent].sin) {
    return "CR"
  } else if (time <= records.nationalRecords[country].sin) {
    return "NR"
  } else {
    return false
  }
}



export const fetchRecords = async (competitors, event) => {
  let records = {
    nationalRecords : {},
    continentalRecords : {},
    worldRecords : {}
  }

  const avgResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/world/average/${event}.json`);
  const sinResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/world/single/${event}.json`);
  const avgJson = await avgResult.json();
  const sinJson = await sinResult.json();

  const wrAvg = parseFloat(avgJson.items[0].best) / 100
  const wrSin = parseFloat(sinJson.items[0].best) / 100
  records.worldRecords = {"avg" : wrAvg, "sin" : wrSin}

  for (const c of competitors) {
    if (!(c.country in records.nationalRecords) && c.country != null) {
      const avgResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/${c.country}/average/${event}.json`);
      const sinResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/${c.country}/single/${event}.json`);
      const avgJson = await avgResult.json();
      const sinJson = await sinResult.json();

      const nrAvg = parseFloat(avgJson.items[0].best) / 100
      const nrSin = parseFloat(sinJson.items[0].best) / 100
      records.nationalRecords[c.country] = {"avg" : nrAvg, "sin" : nrSin}

    }

    if (!(countries[c.country].continent in records.continentalRecords) && (c.country != null)) {
       
      const avgResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/${countries[c.country].continent}/average/${event}.json`);
      const sinResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/${countries[c.country].continent}/single/${event}.json`);
      const avgJson = await avgResult.json();
      const sinJson = await sinResult.json();

      const crAvg = parseFloat(avgJson.items[0].best) / 100
      const crSin = parseFloat(sinJson.items[0].best) / 100
      records.continentalRecords[countries[c.country].continent] = {"avg" : crAvg, "sin" : crSin}

    } 
  }
  return records
}



