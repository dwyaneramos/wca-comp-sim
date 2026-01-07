const DNF = 999
const TEN_MINS = 600

const MMSSFORMAT = /^0?\d:[0-5]?\d\.\d{2}$/ 

export const convertTime = (time) => {
  if (time === "DNF") {
    time = DNF;
  } else if (time.includes("+")) {
    time = time.slice(0, -1)
  } else if (MMSSFORMAT.test(time)) {
    time = convertFromMMSSFormat(time)
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

