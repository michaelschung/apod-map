import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";
import { drawPins } from "./map.js";

// const exampleCoords = [
//     [4.899431, 52.379189],
//     [-74.006, 40.7128],
//     [139.6917, 35.6895],
//     [-3.703790, 40.416775],
//     [151.2093, -33.8688]
// ];

function extractLocations(data) {
    var coordSet = [];
    for (const item of data) {
        if (item.coords) {
            coordSet.push(item.coords.split(",").map(Number).reverse());
        }
    }
    return coordSet;
}

apodReq("2024-12-25").then((raw_apod_data) => {
    console.log(raw_apod_data);
    openaiReq(raw_apod_data).then((data) => {
        const coordSet = extractLocations(data);
        console.log(coordSet);
        drawPins(coordSet);
    });
});