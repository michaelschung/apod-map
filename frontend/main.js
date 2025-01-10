import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});

/*
fetch('/api/openai/completion', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify([
        {"role": "user", "content": "write a haiku about ai"}
    ]),
})
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
*/

fetch('/api/apod', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "start_date": "2024-12-25"
    }),
})
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));