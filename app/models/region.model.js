const mongoose = require("mongoose");

const Region = mongoose.model(
    "Region",
    new mongoose.Schema({
        region_name: String,
        cities: Array
    })
);

module.exports = Region;