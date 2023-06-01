const mongoose = require("mongoose");

const Awards = mongoose.model(
    "Awards",
    new mongoose.Schema([{
        award_name: String,
        award_description: String,
        file_type: { type: String, default: 'award' },
        time: { type: Date, default: Date.now }
    }])
);

module.exports = Awards;