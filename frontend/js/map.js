import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export function initMap() {
    // Default view: whole world
    var defaultView = new View({
        center: [0, 0],
        zoom: 2
    });

    // Layer for pins
    const pinsLayer = new VectorLayer({
        source: new VectorSource({ features: [] })
    });
    pinsLayer.set("name", "pinsLayer");

    // Create the map
    const map = new Map({
        target: "map",
        layers: [
            new TileLayer({
                source: new OSM()
            }),
            pinsLayer
        ],
        view: defaultView
    });

    map.on('singleclick', (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
            const pinDetails = feature.get('details');
            if (pinDetails) {
                console.log(pinDetails);
            }
        });
    });

    return map;
}

function addPin(pinsLayer, obj) {
    // Create a pin (point feature) at given coordinates
    const lonLat = obj.coords.split(",").map(Number).reverse()
    var pin = new Feature({
        geometry: new Point(fromLonLat(lonLat)),
        details: obj
    });

    // Style for the pin
    pin.setStyle(new Style({
        image: new Icon({
            src: "https://cdn-icons-png.flaticon.com/512/9356/9356230.png",
            scale: 0.07
        })
    }));

    pinsLayer.getSource().addFeature(pin);
}

export function addPins(map, data) {
    // Get pins layer, add all coords
    const pinsLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'pinsLayer');
    for (const obj of data) {
        if (obj.coords) {
            addPin(pinsLayer, obj);
        }
    }
}