const mongoose = require("mongoose");

const SuperAdmin = mongoose.model(
    "SuperAdmin",
    new mongoose.Schema({
        user_id: String,
        email: String,
        password: String,
        super_admin_name: String
    })
);

module.exports = SuperAdmin;