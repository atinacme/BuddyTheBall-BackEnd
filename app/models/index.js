const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.school = require("./school.model");
db.coach = require("./coach.model");
db.customer = require("./customer.model");
db.regionalmanager = require("./regionalmanager.model");
db.photos = require("./photos.model");
db.messages = require("./messages.model");
db.calendar = require("./calendar.model");
db.attendance = require("./attendance.model");
db.region = require("./region.model");
db.schedule = require("./schedule.model");
db.class = require("./class.model");
db.awards = require("./awards.model");
db.dbConfig = require("../config/db.config");
db.ROLES = ["customer", "superadmin", "coach", "regionalmanager"];

module.exports = db;