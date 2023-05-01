const mongoose = require("mongoose");

const Calendar = mongoose.model(
    "Calendar",
    new mongoose.Schema({
        coach_id: String,
        user_id: String,
        agenda: Object,
        agenda_date: String,
        agenda_data: Array,
        time: { type: Date, default: Date.now }
    })
);

module.exports = Calendar;