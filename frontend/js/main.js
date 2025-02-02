import "../css/style.css";
import { apodReq, llmReq, getFromDB, writeToDB } from "./requests.js";
import { initMap, addPins, clearPins, closePopup } from "./map.js";
import flatpickr from "flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";

// Number of images to process in each batch
const BATCH_SIZE = 5;

const map = initMap();

const loadingModalElement = document.getElementById("loading-modal");
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

// Displays or hides loading modal
function loading(mapLoading, message="") {
    if (mapLoading) {
        const year = monthPicker.currentYear;
        const month = monthPicker.currentMonth;
        const monthStr = new Date(year, month, 1).toLocaleString("default", { month: "long" });

        loadingModalElement.querySelector(".date").innerHTML = `Loading ${monthStr} ${year}`
        loadingModalElement.querySelector(".status").innerHTML = `${message}...`;
        loadingModalElement.style.display = "grid";
        monthPickerElement.disabled = true;
    } else {
        loadingModalElement.style.display = "none";
        monthPickerElement.disabled = false;
    }
}

// Retrieves data for current selected month
function requestMonth() {
    closePopup();
    clearPins(map);

    const today = new Date();
    const year = monthPicker.currentYear;
    const month = monthPicker.currentMonth;

    // Check database first
    getFromDB(year, month).then((data) => {
        // If month is cached and current, use that data
        if (data) {
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

        // Open/update loading modal
        loading(true, "Requesting data from NASA");

        // Request month of data from APOD API
        apodReq(startDate, endDate).then((raw_apod_data) => {
            // Reverse the data so that the newest posts are processed first
            batch_requests(year, month, raw_apod_data.reverse(), BATCH_SIZE);
        });
    });
}

// Make requests in batches for faster page population
function batch_requests(year, month, data, batchSize) {
    loading(true, "Extracting location data");
    const nBatches = Math.ceil(data.length / batchSize);
    var allParsedData = [];
    var finished = 0;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        // Send each batch to LLM for processing
        llmReq(batch).then((parsedData) => {
            allParsedData.push(...parsedData);
            addPins(map, parsedData);
            finished++;
            // Write processed data to db
            if (finished >= nBatches) {
                console.log("Done loading month");
                writeToDB(year, month, allParsedData);
                // Close loading modal
                loading(false);
            }
        });
    }
}

requestMonth();