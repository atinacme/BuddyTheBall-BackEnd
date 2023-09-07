const controller = require("../controllers/photos.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/uploadCustomerPhotos", controller.uploadCustomerPhotos);

    app.get("/api/getAllSchoolPhotos", controller.getAllSchoolPhotos);

    app.get("/api/getParticularSchoolPhotos/:id", controller.getParticularSchoolPhotos);

    app.get("/api/getAwardPhotos", controller.getAwardPhotos);

    app.get("/api/getParticularCustomerPhotos/:id", controller.getParticularCustomerPhotos);

    app.post("/api/updateCustomerPhotosOnMessage/:id", controller.updateCustomerPhotosOnMessage);

    app.get("/api/getAnyParticularImage/:filename", controller.getAnyParticularImage);

    app.get("/api/getParticularPhoto/:id", controller.getParticularPhoto);
    // app.get("/api/files/:name", controller.download);
};