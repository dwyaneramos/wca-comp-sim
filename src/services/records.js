import { countries } from "./nationality.js"
import { DNF } from "../utils/constants.js"


const applyRecord = (records, recordType, AvgOrSin, result, country) => {
  if (recordType === "NR" || recordType === "CR" || recordType === "WR") {
    records.nationalRecords[country] = {
      ...records.nationalRecords[country],
      [AvgOrSin]: result,
    }
  }

  if (recordType === "CR" || recordType === "WR") {
    const continent = countries[country].continent
    records.continentalRecords[continent] = {
      ...records.continentalRecords[continent],
      [AvgOrSin]: result,
    }
  }

  if (recordType === "WR") {
    records.worldRecords = {
      ...records.worldRecords,
      [AvgOrSin]: result,
    };
  }
}

export const updateRecords = (prevRecords, competitors, solveNum, numSolvesInRound) => {

  if (!prevRecords) return prevRecords;
  let currRecords = structuredClone(prevRecords);

  for (const c of competitors) {
    // check single
    for (let i = 0; i < solveNum; i++) {
      const isSinRecord = checkIfRecord(c.times[i], currRecords, c.country, "sin");
      if (isSinRecord !== false) {
        applyRecord(currRecords, isSinRecord, "sin", c.times[i], c.country)
      }

    }
    // check average if applicable
    if (solveNum === numSolvesInRound) {
      const isAvgRecord = checkIfRecord(c.avg, currRecords, c.country, "avg");
      if (isAvgRecord !== false) {
        applyRecord(currRecords, isAvgRecord, "avg", c.avg, c.country)
      }
    }
  }



  return currRecords

}

export const checkIfRecord = (time, records, country, recordType) => {
  if (records === null) {
    return false
  } else if (time <= records.worldRecords[recordType]) {
    return "WR"
  } else if (time <= records.continentalRecords[countries[country].continent][recordType]) {
    return "CR"
  } else if (time <= records.nationalRecords[country][recordType]) {
    return "NR"
  } else {
    return false
  }


}




export const fetchRecords = async (competitors, event) => {
  let records = {
    nationalRecords: {},
    continentalRecords: {},
    worldRecords: {}
  }

  const wrAvg = await getRecord("world", "average", event)
  const wrSin = await getRecord("world", "single", event)
  records.worldRecords = { "avg": wrAvg, "sin": wrSin }

  for (const c of competitors) {
    if (!(c.country in records.nationalRecords) && c.country != null) {
      const nrAvg = await getRecord(c.country, "average", event)
      const nrSin = await getRecord(c.country, "single", event)
      records.nationalRecords[c.country] = { "avg": nrAvg, "sin": nrSin }

    }

    const continent = countries[c.country].continent
    if (!(continent in records.continentalRecords) && (c.country != null)) {
      const crAvg = await getRecord(continent, "average", event)
      const crSin = await getRecord(continent, "single", event)
      records.continentalRecords[continent] = { "avg": crAvg, "sin": crSin }

    }
  }
  console.log(records)
  return records
}

const getRecord = async (location, recordType, event) => {
  try {
    const result = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/refs/heads/v1/rank/${location}/${recordType}/${event}.json`)
    console.log(result)
    if (!result.ok) {
      return DNF
    }
    const resultJSON = await result.json();
    const time = parseFloat(resultJSON.items[0].best) / 100
    return time
  } catch (e) {
    console.log("Error innit: ", e)
    return DNF
  }
}



