const controller = require("../controllers/messages.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/createAndUpdateMessage", controller.createAndUpdateMessage);

    app.get("/api/getMessagesBySenderId/:id", controller.getMessagesBySenderId);

    app.get("/api/getMessagesBySenderIdReceiverId/:sender_id/:receiver_id", controller.getMessagesBySenderIdReceiverId);
};