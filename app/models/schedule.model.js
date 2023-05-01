const mongoose = require("mongoose");

const Schedule = mongoose.model(
    "Schedule",
    new mongoose.Schema({
        created_by: String,
        created_by_name: String,
        created_by_user_id: String,
        coaches: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coach"
        }],
        date: String,
        start_time: String,
        end_time: String,
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School"
        },
        topic: String,
        status: { type: String, default: 'Upcoming' },
        time: { type: Date, default: Date.now }
    })
);

module.exports = Schedule;