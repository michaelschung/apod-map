import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";
import { drawPins } from "./map.js";

const coordSet = [
    [4.899431, 52.379189],
    [-74.006, 40.7128],
    [139.6917, 35.6895],
    [-3.703790, 40.416775],
    [151.2093, -33.8688]
];

drawPins(coordSet);

// apodReq("2024-12-25").then((data) => {
//     console.log(data);
//     // openaiReq(data).then((locations) => {
//     //     console.log(locations);
//     // });
// });