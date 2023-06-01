const controller = require("../controllers/awards.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/createAwards", controller.createAwards);

    app.get("/api/getAwards", controller.getAwards);

    // app.put("/api/updateClass/:id", controller.updateClass);

    // app.delete("/api/deleteClass", controller.deleteClass);
};