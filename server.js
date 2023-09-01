const express = require("express");
const cors = require("cors");
const moment = require('moment');

const app = express();

global.__basedir = __dirname;

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const db = require("./app/models");
const Role = db.role;
const Schedule = db.schedule;
const dbConfig = db.dbConfig;

const uri = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;
db.mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "customer"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'customer' to roles collection");
            });

            new Role({
                name: "coach"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'coach' to roles collection");
            });

            new Role({
                name: "superadmin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'superadmin' to roles collection");
            });

            new Role({
                name: "regionalmanager"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'regionalmanager' to roles collection");
            });
        }
    });
}

const UpdateSchedulesRegularly = async (req, res) => {
    try {
        Schedule.find()
            // .populate("coach", "-__v")
            // .populate("school", "-__v")
            .then(data => {
                data.forEach(v => {
                    function getYear(timestamp) {
                        return (new Date(timestamp * 1000)).getFullYear();
                    }
                    function getMon(timestamp) {
                        return (new Date(timestamp * 1000)).getMonth();
                    }
                    function getDate(timestamp) {
                        return (new Date(timestamp * 1000)).getDate();
                    }
                    function convertDateFormat(inputDate) {
                        // Split the input date string into components
                        var components = inputDate.split('-');

                        if (components.length === 3) {
                            var year = components[0];
                            var day = components[1];
                            var month = components[2];

                            // Create the new date string in "YYYY-MM-DD" format
                            var newDate = year + '-' + month + '-' + day;
                            return newDate;
                        } else {
                            // Handle invalid input format
                            return "Invalid date format";
                        }
                    }
                    var local = new Date(v.date).toLocaleDateString();
                    var newdate = local.split("/").reverse().join("-");
                    var dateStringFormat = process.env.NODE_ENV === 'production' ? convertDateFormat(newdate) : newdate;
                    var timestamp = new Date(dateStringFormat).getTime() / 1000;
                    var startTime = moment(v.start_time, ["h:mm A"]).format("HH:mm");
                    var startTimeSplit = startTime.split(":");
                    var dateTimeStartString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), startTimeSplit[0], startTimeSplit[1]);
                    var parsedTimeStartString = Date.parse(dateTimeStartString);
                    var endTime = moment(v.end_time, ["h:mm A"]).format("HH:mm");
                    var endTimeSplit = endTime.split(":");
                    var dateTimeEndString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), endTimeSplit[0], endTimeSplit[1]);
                    var parsedTimeEndString = Date.parse(dateTimeEndString);
                    var parsedCurrentDateTimeString = Date.parse(moment().utcOffset("+05:30").format());
                    if (v.status !== 'Completed') {
                        if (parsedCurrentDateTimeString >= parsedTimeStartString && parsedCurrentDateTimeString <= parsedTimeEndString) {
                            var schedule = {
                                status: 'Incomplete'
                            };
                            Schedule.findByIdAndUpdate(v._id, schedule, { useFindAndModify: false })
                                .then(data => {
                                    if (!data) {
                                        console.log(`Cannot update Schedule with id=${v._id}`);
                                    } else console.log("Schedule updated successfully.");
                                });
                        } else if (parsedCurrentDateTimeString <= parsedTimeStartString) {
                            var schedule = {
                                status: 'Upcoming'
                            };
                            Schedule.findByIdAndUpdate(v._id, schedule, { useFindAndModify: false })
                                .then(data => {
                                    if (!data) {
                                        console.log(`Cannot update Schedule with id=${v._id}`);
                                    } else console.log("Schedule updated successfully.");
                                });
                        } else {
                            var schedule = {
                                status: 'Ended'
                            };
                            Schedule.findByIdAndUpdate(v._id, schedule, { useFindAndModify: false })
                                .then(data => {
                                    if (!data) {
                                        console.log(`Cannot update Schedule with id=${v._id}`);
                                    } else console.log("Schedule updated successfully.");
                                });
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    } catch (error) {
        console.log(error);
    }
};

function UpdateSchedule() {
    let interval;
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        UpdateSchedulesRegularly().then(() => {
            console.log("Schedules Updated");
        });
    }, 5000);
}

UpdateSchedule();

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/school.routes')(app);
require('./app/routes/coach.routes')(app);
require('./app/routes/customer.routes')(app);
require('./app/routes/file.routes')(app);
require('./app/routes/photos.routes')(app);
require('./app/routes/messages.routes')(app);
require('./app/routes/calendar.routes')(app);
require('./app/routes/attendance.routes')(app);
require('./app/routes/regionalmanager.routes')(app);
require('./app/routes/region.routes')(app);
require('./app/routes/schedule.routes')(app);
require('./app/routes/class.routes')(app);
require('./app/routes/awards.routes')(app);
require('./app/routes/billing.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});