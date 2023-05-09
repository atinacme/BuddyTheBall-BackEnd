const controller = require("../controllers/class.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/createClass", controller.createClass);

    app.get("/api/getClasses", controller.getClasses);

    app.post("/api/getClassCreatedByUserId", controller.getClassCreatedByUserId);

    app.put("/api/updateClass/:id", controller.updateClass);

    app.post("/api/getCoachClasses", controller.getCoachClasses);

    app.delete("/api/deleteClass", controller.deleteClass);
};