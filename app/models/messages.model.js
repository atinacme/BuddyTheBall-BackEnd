const mongoose = require("mongoose");

const Messages = mongoose.model(
    "Messages",
    new mongoose.Schema([{
        sender_id: String,
        sender_name: String,
        sender_role: String,
        sender_profile_url: String,
        receiver_id: String,
        receiver_name: String,
        receiver_role: String,
        receiver_profile_url: String,
        messages: [{ messanger_id: String, role: String, message: String, url: String, time: { type: Date, default: Date.now }, messanger_name: String }],
        last_message: String,
        last_messanger: String,
        time: { type: Date, default: Date.now }
    }])
);

module.exports = Messages;