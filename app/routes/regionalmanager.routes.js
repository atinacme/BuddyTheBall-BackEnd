const controller = require("../controllers/regionalmanager.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getRegionalManagers", controller.getRegionalManagers);

    app.get("/api/findParticularRegionalManager/:id", controller.findParticularRegionalManager);

    app.get("/api/getCoachesOfParticularRegionalManager/:id", controller.getCoachesOfParticularRegionalManager);

    app.get("/api/getCoachOfParticularRegionalManager/:coachId/:regionalManagerId", controller.getCoachOfParticularRegionalManager);

    app.put("/api/updateRegionalManager/:userId/:regionalManagerId", controller.updateRegionalManager);

    app.delete("/api/deleteRegionalManager", controller.deleteRegionalManager);
};