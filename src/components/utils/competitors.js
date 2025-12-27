export const addCompetitor = (competitorList, cuber) => {
  console.log(competitorList)
  console.log(cuber)
  console.log(cuber in competitorList)
  if (isCuberInList(competitorList, cuber)) {
    console.log("Cuber already registered")
    return competitorList;
  } else {
    console.log("Cuber added succesfully")
    return [...competitorList, cuber];
  }

}

export const isCuberInList = (competitorList, cuber) => {
  for (let other of competitorList) {
    if (other.id == cuber.id && other.name == cuber.name) {
      return true;
    }
  }
  return false;
}
