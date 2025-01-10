import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

function getPinsLayer(coordSet) {
    // Create vector source to hold pin features
    var vectorSource = new VectorSource({
        features: []
    });

    for (const coords of coordSet) {
        // Create a pin (point feature) at given coordinates
        var pin = new Feature({
            geometry: new Point(fromLonLat(coords))
        });
        
        // Style for the pin
        pin.setStyle(new Style({
            image: new Icon({
                src: "https://cdn-icons-png.flaticon.com/512/9356/9356230.png",
                // src: "https://openlayers.org/en/v4.6.5/examples/data/icon.png", // Pin icon image URL
                scale: 0.07
            })
        }));
        
        vectorSource.addFeature(pin);
    }

    // Create/return vector layer with the pins
    return new VectorLayer({ source: vectorSource });
}

export function initMap() {
    var defaultView = new View({
        center: [0, 0],
        zoom: 2
    });

    const map = new Map({
        target: "map",
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        view: defaultView
    });

    return map;
}

export function addPins(map, coordSet) {
    var pinsLayer = getPinsLayer(coordSet);
    map.addLayer(pinsLayer);
}