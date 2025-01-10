import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";
import { getPinsLayer } from "./map.js";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const coordSet = [
    [4.899431, 52.379189],
    [-74.006, 40.7128],
    [139.6917, 35.6895],
    [-3.703790, 40.416775],
    [151.2093, -33.8688]
];

var defaultView = new View({
    center: [0, 0],
    zoom: 2
});

const pinsLayer = getPinsLayer(coordSet);

// Create the map
var map = new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM()  // OpenStreetMap base layer
        }),
        pinsLayer
    ],
    view: defaultView
});

// apodReq("2024-12-25").then((data) => {
//     console.log(data);
//     // openaiReq(data).then((locations) => {
//     //     console.log(locations);
//     // });
// });