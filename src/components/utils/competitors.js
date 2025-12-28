import {Cuber} from '../services/cuber.js'

export const addCompetitor = (competitorList, c) => {
  if (isCuberInList(competitorList, c)) {
    console.log("Cuber already registered")
    return competitorList;
  } else {
    console.log("Cuber added succesfully")
    const c_obj = new Cuber(c.name, c.id)
    c_obj.genTimes("333");
    return [...competitorList, c_obj];
  }

}

export const isCuberInList = (competitorList, c) => {
  for (let other of competitorList) {
    if (other.id == c.id && other.name == c.name) {
      return true;
    }
  }
  return false;
}
