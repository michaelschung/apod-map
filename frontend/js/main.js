import "../css/style.css";
import { apodReq, openaiReq, getFromDB, writeToDB } from "./requests.js";
import { initMap, addPins, clearPins } from "./map.js";
import flatpickr from "flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";

// Number of images to process in each batch
const BATCH_SIZE = 5;

const map = initMap();

const monthPickerElement = document.getElementById("month-picker");
const monthPicker = flatpickr(monthPickerElement, {
    plugins: [new monthSelectPlugin({ })],
    defaultDate: "today",
    dateFormat: "Y-m-d",
    altFormat: "F Y",
    minDate: "1995-06-01",
    maxDate: "today",
    onChange: requestMonth,
});

function requestMonth() {
    document.getElementById("popup").querySelector(".popup-dismiss").click();
    clearPins(map);

    const today = new Date();

    const year = monthPicker.currentYear;
    const month = monthPicker.currentMonth;

    getFromDB(year, month).then((data) => {
        // If month is cached
        if (data) {
            console.log("CACHED");
            // If current month, make sure db data is up to date
            if (month !== today.getMonth() || data.length >= today.getDate()) {
                addPins(map, data);
                return;
            }
        }

        // Start on first of month, limited by 1995-06-16
        const firstOfMonth = new Date(year, month, 1);
        const selectionStart = new Date(Math.max(firstOfMonth, new Date("1995-06-16")));
        // End on last of month, unless current month (then end on today)
        const lastOfMonth = new Date(year, month+1, 1);
        lastOfMonth.setDate(lastOfMonth.getDate() - 1);
        const selectionEnd = new Date(Math.min(lastOfMonth, today));

        // Format date range to request
        const startDate = selectionStart.toISOString().split("T")[0];
        const endDate = selectionEnd.toISOString().split("T")[0];

        console.log("Requesting month from APOD: ", startDate, endDate);

        monthPickerElement.disabled = true;

        apodReq(startDate, endDate).then((raw_apod_data) => {
            console.log(raw_apod_data);
            // Reverse the data so that the newest posts are processed first
            batch_requests(year, month, raw_apod_data.reverse(), BATCH_SIZE);
        });
    });
}

// Make requests in batches for faster page population
function batch_requests(year, month, data, batchSize) {
    const nBatches = Math.ceil(data.length / batchSize);
    var allParsedData = [];
    var finished = 0;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        openaiReq(batch).then((parsedData) => {
            allParsedData.push(...parsedData);
            addPins(map, parsedData);
            finished++;
            if (finished >= nBatches) {
                console.log("All data processed");
                writeToDB(year, month, allParsedData);
                monthPickerElement.disabled = false;
            }
        });
    }
}

requestMonth();