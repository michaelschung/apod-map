import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";
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
    clearPins(map);

    const today = new Date();

    const year = monthPicker.currentYear;
    const month = monthPicker.currentMonth;

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

    console.log("Requesting month: ", startDate, endDate);

    monthPickerElement.disabled = true;

    apodReq(startDate, endDate).then((raw_apod_data) => {
        console.log(raw_apod_data);
        // Reverse the data so that the newest posts are processed first
        batch_requests(raw_apod_data.reverse(), BATCH_SIZE);
    });
}

// Make requests in batches for faster page population
function batch_requests(data, batchSize) {
    const nBatches = Math.ceil(data.length / batchSize);
    var finished = 0;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        openaiReq(batch).then((parsed_data) => {
            addPins(map, parsed_data);
            finished++;
            if (finished >= nBatches) {
                console.log("All data processed");
                monthPickerElement.disabled = false;
            }
        });
    }
}

requestMonth();