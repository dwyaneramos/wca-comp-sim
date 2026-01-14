
import {DNF} from "./constants.js"
const TEN_MINS = 600

const MMSSFORMAT = /^0?\d:[0-5]?\d\.\d*\d$/ 

export const genSuffix = (number) => {
  const conversion = {
    0 : "th",
    1 : "st",
    2 : "nd",
    3 : "rd",
    4 : "th",
    5 : "th",
    6 : "th",
    7 : "th",
    8 : "th",
    9 : "th"
    }

  if (number in conversion) {
    return conversion[number]
  } else if (number >= 11 && number <= 19) {
    return "th"
  } else {
    return conversion[number % 10]
  }
  
}

export const convertTime = (time) => {
  console.log(time, 'sajdsa')
  if (time === "DNF") {
    time = DNF;
  } else if (time.includes("+")) {
    time = time.slice(0, -1)
  }


  if (MMSSFORMAT.test(time)) {
    time = convertFromMMSSFormat(time)
  } else {
    time = Number.parseFloat(time)
  }
  return time
}

const convertFromMMSSFormat = (time) => {
  const [min, secs] = time.split(":")
  return Number.parseFloat(min) * 60 + Number.parseFloat(secs)
}

export const validateTime = (time) => {
  console.log(MMSSFORMAT.test(time), "TEE")
  if ( (isNaN(time) && !time.includes("+") && time !== "DNF" && !MMSSFORMAT.test(time) ) || time <= 0) {
    console.log("Not a number")
    return false
  } else if (Number.parseFloat(time) > TEN_MINS) {
    console.log("Number too big")
    return false
  }

  else {
    return true;
  }
}

export const formatTime = (time) => {
  if (isNaN(time)) {
    return time
  }

  if (time == DNF) {
    time = "DNF";
  } else if (time > 60) {
    time = convertToMMSS(time)
  } else {
    time = time.toFixed(2)
  }
  return time

}

export const convertToMMSS = (time) => {
  const s = (time % 60) < 10 ? "0" + (time % 60).toFixed(2) : (time % 60).toFixed(2)
  const mins = Math.floor(time / 60)
  return mins + ":" + s
}

