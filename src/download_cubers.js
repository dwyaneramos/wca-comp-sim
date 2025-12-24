import fs from "fs";

const dataURL = "../public/cubers.json";
const data = fs.readFileSync(dataURL);
const dataJSON = JSON.parse(data)
dataJSON.cubers.push({
  "name" : "Jason Yo",
  "id" : "2032YOJA23"
})


export const ExtractPlayers =  async () => {

    

  const apiLink = `https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons.json`;
  let pageNum = 1;
  let maxPageNum = 100;
  try {

    while (pageNum <= maxPageNum) {

      const res = await fetch(`https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/persons-page-${pageNum}.json`);
      const json = await res.json();
      maxPageNum = Math.ceil(json.total / 1000)
      for (const cuber of json.items) {
        const dataToPush = {
          "name" : cuber.name,
          "id" : cuber.id
        }
        dataJSON.cubers.push(dataToPush)
        //console.log(dataToPush)

      }
      console.log(`Extracted all of page ${pageNum}`)


      pageNum += 1;
    } 
    fs.writeFileSync(dataURL, JSON.stringify(dataJSON, null, 2))
    console.log("Cuber extraction saved successfully to JSON")
  } catch (e) {
    console.error("Error: ", e);
  }
}

ExtractPlayers();
