import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

var coords = [4.899431, 52.379189];
var view = new View({
    center: [0, 0],
    zoom: 2
});

// Create a vector source and layer for the pin
var vectorSource = new VectorSource({
    features: []
});

// Create a pin (point feature) at the given coordinates
var pin = new Feature({
    geometry: new Point(fromLonLat(coords)) // Convert lon/lat to map projection
});

// Style for the pin (you can customize it)
pin.setStyle(new Style({
    image: new Icon({
        src: "https://openlayers.org/en/v4.6.5/examples/data/icon.png", // Pin icon image URL
        scale: 1
    })
}));

vectorSource.addFeature(pin);

// Create a vector layer with the pin
var vectorLayer = new VectorLayer({
    source: vectorSource
});

// Create the map
var map = new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM()  // OpenStreetMap base layer
        }),
        vectorLayer
    ],
    view: view
});

// apodReq("2024-12-25").then((data) => {
//     console.log(data);
//     // openaiReq(data).then((locations) => {
//     //     console.log(locations);
//     // });
// });