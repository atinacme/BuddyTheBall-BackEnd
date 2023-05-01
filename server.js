const express = require("express");
const cors = require("cors");

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

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});