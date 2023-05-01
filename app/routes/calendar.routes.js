const controller = require("../controllers/calendar.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/createAgenda", controller.createAgenda);

    app.post("/api/getAgendaByDateAndCoach", controller.getAgendaByDateAndCoach);

    app.get("/api/getAgendaByCoach/:id", controller.getAgendaByCoach);

    app.post("/api/updateAgenda/:id", controller.updateAgenda);
};