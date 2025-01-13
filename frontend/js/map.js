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
    var defaultView = new View({
        center: [0, 0],
        zoom: 2
    });

    const pinsLayer = new VectorLayer({
        source: new VectorSource({ features: [] })
    });
    pinsLayer.set("name", "pinsLayer");

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

    return map;
}

function addPin(pinsLayer, coords) {
    // Create a pin (point feature) at given coordinates
    var pin = new Feature({
        geometry: new Point(fromLonLat(coords))
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

export function addPins(map, coordSet) {
    // Get pins layer, add all coords
    const pinsLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'pinsLayer');
    coordSet.forEach(coords => addPin(pinsLayer, coords));
}