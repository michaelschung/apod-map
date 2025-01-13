import "../css/style.css";
import { apodReq, openaiReq } from "./requests.js";
import { initMap, addPins } from "./map.js";
import flatpickr from "flatpickr";

// Number of images to process in each batch
const BATCH_SIZE = 5;

const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const today = new Date();

var startDate = firstOfMonth.toISOString().split("T")[0];
var endDate = today.toISOString().split("T")[0];

updateDisplayDates();

function updateDisplayDates() {
    document.getElementById("start-date").innerHTML = startDate;
    document.getElementById("end-date").innerHTML = endDate;
}

const datePicker = flatpickr("#date-picker", {
    altInput: true,
    altFormat: "F Y",
    dateFormat: "Y-m-d",
    minDate: "1995-06-16",
    maxDate: today,
    disable: ["1995-06-17", "1995-06-18", "1995-06-19"],
    mode: "range",
    defaultDate: [firstOfMonth, today],
    inline: true,
    onMonthChange: selectFullMonth,
});

function selectFullMonth() {
    const year = datePicker.currentYear;
    const month = datePicker.currentMonth;

    const firstOfMonth = new Date(year, month, 1);
    // If viewing current month, last of month is today
    const isThisMonth = year === today.getFullYear() && month === today.getMonth();
    const lastOfMonth = new Date(year, month+1, 1);
    lastOfMonth.setDate(lastOfMonth.getDate() - 1);
    const lastOfSelection = isThisMonth ? today : lastOfMonth;
    datePicker.setDate([firstOfMonth, lastOfSelection]);
    startDate = firstOfMonth.toISOString().split("T")[0];
    endDate = lastOfMonth.toISOString().split("T")[0];
    updateDisplayDates();
}

const map = initMap();

// Make requests in batches for faster page population
function batch_requests(data, batchSize) {
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        openaiReq(batch).then((data) => {
            addPins(map, data);
        });
    }
}

apodReq(startDate, endDate).then((raw_apod_data) => {
    console.log(raw_apod_data);
    // Reverse the data so that the newest posts are processed first
    // batch_requests(raw_apod_data.reverse(), BATCH_SIZE);
});