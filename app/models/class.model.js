const mongoose = require("mongoose");

const Class = mongoose.model(
    "Class",
    new mongoose.Schema({
        created_by: String,
        created_by_name: String,
        created_by_user_id: String,
        schedules: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule"
        }],
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School"
        },
        topic: String,
        time: { type: Date, default: Date.now }
    })
);

module.exports = Class;