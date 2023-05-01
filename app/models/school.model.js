const mongoose = require("mongoose");

const School = mongoose.model(
    "School",
    new mongoose.Schema({
        school_name: String,
        region: String,
        assigned_day: String,
        address: String,
        customers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Customer"
            }
        ],
        coaches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coach"
            }
        ],
        classes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class"
            }
        ]
    })
);

module.exports = School;