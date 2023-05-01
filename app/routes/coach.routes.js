const controller = require("../controllers/coach.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getCoaches", controller.getCoaches);

    app.get("/api/getParticularCoach/:id", controller.findParticularCoach);

    app.post("/api/getCustomersOfParticularCoach", controller.findCustomersOfParticularCoach);

    app.get("/api/getCustomersOfParticularCoachOfParticularSchool/:coachId/:schoolId", controller.findCustomersOfParticularCoachOfParticularSchool);

    app.put("/api/updateCoach/:userId/:coachId", controller.updateCoach);

    app.delete("/api/deleteCoach/:id", controller.deleteCoach);
};