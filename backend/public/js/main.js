// import "../css/style.css";
// const Map = require("ol/Map");
// const View = require("ol/View");
// const TileLayer = require("ol/layer/Tile");
// const OSM = require("ol/source/OSM");

import Map from '/node_modules/ol/Map.js';
import OSM from '/node_modules/ol/source/OSM.js';
import TileLayer from '/node_modules/ol/layer/Tile.js';
import View from '/node_modules/ol/View.js';

const map = new Map({
    target: "map",
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});