import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";
import { initMap, addPins } from "./map.js";

var startDate = "2024-12-25";
var endDate = null;
var todayStr = new Date().toISOString().split("T")[0];

document.getElementById("start-date").innerHTML = startDate;
document.getElementById("end-date").innerHTML = endDate || todayStr;

const map = initMap();

function extractLocations(data) {
    var coordSet = [];
    for (const item of data) {
        if (item.coords) {
            coordSet.push(item.coords.split(",").map(Number).reverse());
        }
    }
    return coordSet;
}

apodReq(startDate, endDate).then((raw_apod_data) => {
    openaiReq(raw_apod_data).then((data) => {
        const coordSet = extractLocations(data);
        addPins(map, coordSet);
    });
});