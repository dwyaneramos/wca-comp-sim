

export const countryToContinent = {
  // africa
  DZ: "africa",
  AO: "africa",
  BJ: "africa",
  BW: "africa",
  BF: "africa",
  BI: "africa",
  CV: "africa",
  CM: "africa",
  CF: "africa",
  TD: "africa",
  KM: "africa",
  CG: "africa",
  CD: "africa",
  CI: "africa",
  DJ: "africa",
  EG: "africa",
  GQ: "africa",
  ER: "africa",
  SZ: "africa",
  ET: "africa",
  GA: "africa",
  GM: "africa",
  GH: "africa",
  GN: "africa",
  GW: "africa",
  KE: "africa",
  LS: "africa",
  LR: "africa",
  LY: "africa",
  MG: "africa",
  MW: "africa",
  ML: "africa",
  MR: "africa",
  MU: "africa",
  MA: "africa",
  MZ: "africa",
  NA: "africa",
  NE: "africa",
  NG: "africa",
  RW: "africa",
  ST: "africa",
  SN: "africa",
  SC: "africa",
  SL: "africa",
  SO: "africa",
  ZA: "africa",
  SS: "africa",
  SD: "africa",
  TZ: "africa",
  TG: "africa",
  TN: "africa",
  UG: "africa",
  ZM: "africa",
  ZW: "africa",

  // asia
  AF: "asia",
  AM: "asia",
  AZ: "asia",
  BH: "asia",
  BD: "asia",
  BT: "asia",
  BN: "asia",
  KH: "asia",
  CN: "asia",
  CY: "asia",
  GE: "asia",
  IN: "asia",
  ID: "asia",
  IR: "asia",
  IQ: "asia",
  IL: "asia",
  JP: "asia",
  JO: "asia",
  KZ: "asia",
  KW: "asia",
  KG: "asia",
  LA: "asia",
  LB: "asia",
  MY: "asia",
  MV: "asia",
  MN: "asia",
  MM: "asia",
  NP: "asia",
  KP: "asia",
  OM: "asia",
  PK: "asia",
  PH: "asia",
  QA: "asia",
  SA: "asia",
  SG: "asia",
  KR: "asia",
  LK: "asia",
  SY: "asia",
  TW: "asia",
  TJ: "asia",
  TH: "asia",
  TL: "asia",
  TR: "asia",
  TM: "asia",
  AE: "asia",
  UZ: "asia",
  VN: "asia",
  YE: "asia",

  // europe
  AL: "europe",
  AD: "europe",
  AT: "europe",
  BY: "europe",
  BE: "europe",
  BA: "europe",
  BG: "europe",
  HR: "europe",
  CZ: "europe",
  DK: "europe",
  EE: "europe",
  FI: "europe",
  FR: "europe",
  DE: "europe",
  GR: "europe",
  HU: "europe",
  IS: "europe",
  IE: "europe",
  IT: "europe",
  LV: "europe",
  LI: "europe",
  LT: "europe",
  LU: "europe",
  MT: "europe",
  MD: "europe",
  MC: "europe",
  ME: "europe",
  NL: "europe",
  MK: "europe",
  NO: "europe",
  PL: "europe",
  PT: "europe",
  RO: "europe",
  RU: "europe",
  SM: "europe",
  RS: "europe",
  SK: "europe",
  SI: "europe",
  ES: "europe",
  SE: "europe",
  CH: "europe",
  UA: "europe",
  GB: "europe",
  VA: "europe",

  // north america
  AG: "north america",
  BS: "north america",
  BB: "north america",
  BZ: "north america",
  CA: "north america",
  CR: "north america",
  CU: "north america",
  DM: "north america",
  DO: "north america",
  SV: "north america",
  GD: "north america",
  GT: "north america",
  HT: "north america",
  HN: "north america",
  JM: "north america",
  MX: "north america",
  NI: "north america",
  PA: "north america",
  KN: "north america",
  LC: "north america",
  VC: "north america",
  TT: "north america",
  US: "north america",

  // south america
  AR: "south america",
  BO: "south america",
  BR: "south america",
  CL: "south america",
  CO: "south america",
  EC: "south america",
  GY: "south america",
  PY: "south america",
  PE: "south america",
  SR: "south america",
  UY: "south america",
  VE: "south america",

  // oceania
  AU: "oceania",
  FJ: "oceania",
  KI: "oceania",
  MH: "oceania",
  FM: "oceania",
  NR: "oceania",
  NZ: "oceania",
  PW: "oceania",
  PG: "oceania",
  WS: "oceania",
  SB: "oceania",
  TO: "oceania",
  TV: "oceania",
  VU: "oceania"
};


const applyRecord(records, recordType, result, country) {
  if (isRecord === "NR" || isRecord === "CR" || isRecord === "WR") {
    records.nationalRecords[country] = {
      ...records.nationalRecords[country],
      [recordType] : result,
    }
  }

  if (isRecord === "CR" || isRecord === "WR") {
    const continent = countryToContinent[country]      
    records.continentalRecords[continent] = {
      ...currRecords.continentalRecords[continent],
      [recordType] : result,
    }
  }

  if (isRecord === "WR") {
    currRecords.worldRecords = {
      ...currRecords.worldRecords,
      [recordType] : result,
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
        if (isRecord !== false) {
          applyRecord(currRecords, isSinRecord, c.times[i], c.country)
        }

      }
    // check average if applicable
    if (solveNum === numSolvesInRound) {
        const isAvgRecord = checkIfAvgRecord(c.avg, currRecords, c.country);
        if (isAvgRecord !== false) {
        applyRecord(currRecords, isAvgRecord, c.avg, c.country)
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
  } else if (time <= records.continentalRecords[countryToContinent[country]].avg) {
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
  } else if (time <= records.continentalRecords[countryToContinent[country]].sin) {
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

    if (!(countryToContinent[c.country] in records.continentalRecords) && (c.country != null)) {
       
      const avgResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/${countryToContinent[c.country]}/average/${event}.json`);
      const sinResult = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/rank/${countryToContinent[c.country]}/single/${event}.json`);
      const avgJson = await avgResult.json();
      const sinJson = await sinResult.json();

      const crAvg = parseFloat(avgJson.items[0].best) / 100
      const crSin = parseFloat(sinJson.items[0].best) / 100
      records.continentalRecords[countryToContinent[c.country]] = {"avg" : crAvg, "sin" : crSin}

    } 
  }
  return records
}



