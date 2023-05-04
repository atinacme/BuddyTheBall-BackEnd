const controller = require("../controllers/customer.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/getCustomers", controller.getCustomers);

    app.get("/api/getCustomerWithSchoolId/:id", controller.findCustomerWithSchoolId);

    app.get("/api/getParticularCustomer/:id", controller.findParticularCustomer);

    app.post("/api/findCustomerWithSlot", controller.findCustomerWithSlot);

    app.put("/api/updateCustomer/:userId/:customerId", controller.updateCustomer);

    app.delete("/api/deleteCustomer", controller.deleteCustomer);
};