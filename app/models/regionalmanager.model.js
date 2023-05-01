const mongoose = require("mongoose");

const RegionalManager = mongoose.model(
    "RegionalManager",
    new mongoose.Schema({
        user_id: String,
        email: String,
        password: String,
        regional_manager_name: String,
        assigned_region: String,
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

module.exports = RegionalManager;