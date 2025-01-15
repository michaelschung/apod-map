const express = require('express');
const YearlyData = require("../models/YearlyData");

module.exports = (mongo) => {
    const router = express.Router();

    router.post("/get-month", async (req, res) => {
        try {
            const {year, month} = req.body;

            // Get existing data document
            let existingData = await YearlyData.findOne();

            // Check if data exists
            if (existingData) {
                console.log("Data exists");
                // Data exists; check if year exists
                if (existingData.yearlyData.has(year)) {
                    console.log("Year exists");
                    // Year exists; check if month exists
                    const yearData = existingData.yearlyData.get(year);
                    console.log(yearData);
                    if (yearData[month]) {
                        res.status(200).json({
                            message: "Retrieved cached data",
                            data: yearData[month]
                        });
                        return;
                    }
                }
            }
            res.status(404).json({ message: "Month not cached" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong fetching requested month" });
        }
    });

    router.post("/add-month", async (req, res) => {
        try {
            const { year, month, data } = req.body;
            
            // Get existing data document
            let existingData = await YearlyData.findOne();
            
            // Check if data exists
            if (existingData) {
                // Data exists; check if year already exists
                if (existingData.yearlyData.has(year)) {
                    // Year exists; set month
                    const yearData = existingData.yearlyData.get(year);
                    yearData[month] = data;
                } else {
                    // Year doesn't exist; create year and add month
                    existingData.yearlyData.set(year, {
                        [month]: data
                    });
                }
                await existingData.save();
                res.status(200).json({ message: 'Data updated successfully' });
            } else {
                // No data exists; create a new document with given data
                const newData = new YearlyData({
                    yearlyData: {
                        [year]: {
                            [month]: data,
                        },
                    },
                });
                await newData.save();
                res.status(201).json({ message: 'Data created successfully' });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Unable to add month" });
        }
    });

    return router;
};