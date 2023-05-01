const mongoose = require("mongoose");

const Attendance = mongoose.model(
    "Attendance",
    new mongoose.Schema({
        coach_id: String,
        school_id: String,
        user_id: String,
        customer_id: String,
        customer: String,
        child_id: String,
        player_name: String,
        session_id: String,
        attendance_date: String,
        attendance: { type: String, default: 'NA' },
        start_time: String,
        end_time: String,
        time: { type: Date, default: Date.now }
    })
);

module.exports = Attendance;