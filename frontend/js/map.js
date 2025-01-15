import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Overlay from "ol/Overlay";

function getImgSrc(date) {
    // Generate URL for image based on date
    var [year, month, day] = date.split("-");
    year = year.slice(2);
    return `https://apod.nasa.gov/apod/ap${year}${month}${day}.html`;
}

export function initMap() {
    // Default view: whole world
    var defaultView = new View({
        center: fromLonLat([0, 20]),
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

    // Create popup overlay
    const popup = document.getElementById("popup");
    const popupContent = popup.querySelector(".popup-content");
    const dismissButton = popup.querySelector(".popup-dismiss");

    const popupOverlay = new Overlay({
        element: popup,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    });

    map.addOverlay(popupOverlay);

    // Close the pop-up when the closer is clicked
    dismissButton.onclick = () => {
        popupOverlay.setPosition(undefined);
        popup.style.display = "none";
        return false;
    };

    map.on("singleclick", (event) => {
        // If no feature is found, close the popup
        if (!map.hasFeatureAtPixel(event.pixel)) {
            closePopup();
            return;
        }

        map.forEachFeatureAtPixel(event.pixel, (feature) => {
            const pinDetails = feature.get("details");
            const src = getImgSrc(pinDetails.date);
            const imgUrl = pinDetails.thumb || pinDetails.url;

            // Update popup
            popupContent.innerHTML = `
                <a href="${src}" target="_blank">
                    <img src="${imgUrl}" alt="Pin Image">
                </a>
                <p>Date: ${pinDetails.date}</p>
                <p>Credit: ${pinDetails.copyright}</p>
            `;
            popupOverlay.setPosition(feature.getGeometry().getCoordinates());
            popup.style.display = "block";
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
    const pinsLayer = map.getLayers().getArray().find(layer => layer.get("name") === "pinsLayer");
    for (const obj of data) {
        if (obj.coords) {
            addPin(pinsLayer, obj);
        }
    }
}

export function clearPins(map) {
    map.getLayers().getArray().find(layer => layer.get("name") === "pinsLayer").getSource().clear();
}

export function closePopup() {
    document.getElementById("popup").querySelector(".popup-dismiss").click();
}