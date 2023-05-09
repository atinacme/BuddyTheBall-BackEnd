const controller = require("../controllers/region.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/createRegion", controller.createRegion);

    app.get("/api/getRegions", controller.getRegions);

    app.get("/api/findParticularRegion/:id", controller.findParticularRegion);

    app.put("/api/updateRegion/:id", controller.updateRegion);

    app.delete("/api/deleteRegion", controller.deleteRegion);
};