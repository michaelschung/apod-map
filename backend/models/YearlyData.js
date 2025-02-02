import mongoose from "mongoose";

const yearlyDataSchema = new mongoose.Schema(
    {
        yearlyData: {
            type: Map,
            of: Map,
            required: true
        }
    },
    { timestamps: true }
);

const YearlyData = mongoose.model("YearlyData", yearlyDataSchema);

export default YearlyData;