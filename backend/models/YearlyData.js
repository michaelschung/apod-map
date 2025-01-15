const mongoose = require("mongoose");

function getValue(value) {
    const parsedMap = new Map();
    for (const [year, months] of value) {
        const parsedMonths = {};
        for (const [month, data] of Object.entries(months)) {
            parsedMonths[parseInt(month, 10)] = data;
        }
        parsedMap.set(parseInt(year, 10), parsedMonths);
    }
    return parsedMap;
}

function setValue(value) {
    // Convert keys (year and month) to strings when saving
    const stringifiedMap = new Map();
    for (const [year, months] of Object.entries(value)) {
        const stringifiedMonths = {};
        for (const [month, data] of Object.entries(months)) {
        stringifiedMonths[month.toString()] = data;
        }
        stringifiedMap.set(year.toString(), stringifiedMonths);
    }
    return stringifiedMap;
}

const yearlyDataSchema = new mongoose.Schema(
    {
        yearlyData: {
            type: Map,
            of: Map,
            required: true,
            get: getValue,
            set: setValue
        }
    },
    { timestamps: true }
);

const YearlyData = mongoose.model('YearlyData', yearlyDataSchema);

module.exports = YearlyData;