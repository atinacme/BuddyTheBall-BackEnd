const controller = require("../controllers/school.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/createSchool", controller.createSchool);

    app.get("/api/getSchools", controller.getSchools);

    app.get("/api/getParticularSchool/:id", controller.findParticularSchool);

    app.post("/api/findRegionWiseSchools", controller.findRegionWiseSchools);

    app.put("/api/updateSchool/:id", controller.updateSchool);

    app.delete("/api/deleteSchool/:id", controller.deleteSchool);
};