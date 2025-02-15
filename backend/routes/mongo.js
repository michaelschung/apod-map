import express from "express";
import YearlyData from "../models/YearlyData.js";

export default (mongo) => {
    const router = express.Router();

    router.post("/get-month", async (req, res) => {
        try {
            const {year, month} = req.body;

            const yearKey = year.toString();
            const monthKey = month.toString();

            // Get existing data document
            let existingData = await YearlyData.findOne();

            // Check if data exists
            if (existingData) {
                // Data exists; check if year exists
                if (existingData.yearlyData.has(yearKey)) {
                    // Year exists; check if month exists
                    const yearData = existingData.yearlyData.get(yearKey);
                    if (yearData.get(monthKey)) {
                        res.status(200).json(yearData.get(monthKey));
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

            const yearKey = year.toString();
            const monthKey = month.toString();
            
            // Get existing data document
            let existingData = await YearlyData.findOne();
            
            // Check if data exists
            if (existingData) {
                // Data exists; check if year already exists
                if (existingData.yearlyData.has(yearKey)) {
                    // Year exists; set month
                    const yearData = existingData.yearlyData.get(yearKey);
                    yearData.set(monthKey, data);
                    existingData.yearlyData.set(yearKey, yearData);
                } else {
                    // Year doesn't exist; create year and add month
                    existingData.yearlyData.set(yearKey, {
                        [monthKey]: data
                    });
                }
                existingData.markModified("yearlyData");
                await existingData.save();
                res.status(200).json({ message: "Data updated successfully" });
            } else {
                // No data exists; create a new document with given data
                const newData = new YearlyData({
                    yearlyData: {
                        [yearKey]: {
                            [monthKey]: data,
                        },
                    },
                });
                await newData.save();
                res.status(201).json({ message: "Data created successfully" });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Unable to add month" });
        }
    });

    return router;
};