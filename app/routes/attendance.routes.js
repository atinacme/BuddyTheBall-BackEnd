const controller = require("../controllers/attendance.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/createAndUpdateAttendance", controller.createAndUpdateAttendance);

    app.post("/api/getAttendanceByDate", controller.getAttendanceByDate);

    app.post("/api/getAttendanceBySession", controller.getAttendanceBySession);

    app.delete("/api/deleteAttendanceByDate/:id", controller.deleteAttendanceByDate);
};