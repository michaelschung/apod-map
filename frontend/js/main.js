import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";
import { initMap, addPins } from "./map.js";

var startDate = "2024-12-25";
var endDate = null;
var todayStr = new Date().toISOString().split("T")[0];

// Number of images to process in each batch
const BATCH_SIZE = 5;

document.getElementById("start-date").innerHTML = startDate;
document.getElementById("end-date").innerHTML = endDate || todayStr;

const map = initMap();

function extractCoordinates(data) {
    var coordSet = [];
    for (const item of data) {
        if (item.coords) {
            // OpenLayers requires coordinates in [lon, lat] format
            coordSet.push(item.coords.split(",").map(Number).reverse());
        }
    }
    return coordSet;
}

// Make requests in batches for faster page population
function batch_requests(data, batchSize) {
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        openaiReq(batch).then((data) => {
            const coordSet = extractCoordinates(data);
            console.log(coordSet);
            addPins(map, coordSet);
        });
    }
}

apodReq(startDate, endDate).then((raw_apod_data) => {
    console.log(raw_apod_data);
    // Reverse the data so that the newest posts are processed first
    batch_requests(raw_apod_data.reverse(), BATCH_SIZE);
});