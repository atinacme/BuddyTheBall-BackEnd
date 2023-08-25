const mongoose = require("mongoose");

const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
        user_id: String,
        email: String,
        password: String,
        parent_name: String,
        children_data: [{
            player_name: String,
            player_age: String,
            wristband_level: String,
            handed: String,
            num_buddy_books_read: String,
            jersey_size: String,
            class: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class"
            },
            school: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "School"
            },
            coach: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coach"
            },
            schedule: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Schedule"
            },
            current_award: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Awards"
            }],
            attendance: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Attendance"
            }],
            total_absent: String,
            total_present: String
        }],
        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coach"
        },
        created_by: String,
        created_by_name: String,
        created_by_user_id: String,
        profile_data: {
            photo_id: String,
            fieldname: String,
            originalname: String,
            encoding: String,
            mimetype: String,
            filename: String,
            size: String,
            url: String,
            upload_date: { type: Date, default: Date.now },
        }
    })
);

module.exports = Customer;