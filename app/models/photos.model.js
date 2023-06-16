const mongoose = require("mongoose");

const Photos = mongoose.model(
    "Photos",
    new mongoose.Schema({
        user_id: String,
        customer_id: String,
        class_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        },
        schedule_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule"
        },
        school_id: String,
        coach_id: String,
        photo_id: String,
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: String,
        upload_date: String,
        upload_for: String,
        messages: [{ messanger_id: String, url: String, message: String, time: { type: Date, default: Date.now }, messanger_name: String }]
    })
);

module.exports = Photos;