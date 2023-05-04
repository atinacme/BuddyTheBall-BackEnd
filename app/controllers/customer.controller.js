const db = require("../models");
var bcrypt = require("bcryptjs");
const User = db.user;
const Customer = db.customer;

exports.getCustomers = (req, res) => {
    Customer.find()
        .populate("children_data.school", "-__v")
        .populate("coach", "-__v")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
};

exports.getRegionWiseCustomers = (req, res) => {
    Customer.find()
        .populate("children_data.school", "-__v")
        .populate("coach", "-__v")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
};

exports.findCustomerWithSchoolId = (req, res) => {
    const id = req.params.id;
    Customer.find({ school: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Customer with School id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Customer with School id=" + id });
        });
};

exports.findParticularCustomer = (req, res) => {
    const id = req.params.id;
    Customer.findById(id)
        .populate("children_data.school", "-__v")
        .populate("children_data.class", "-__v")
        .populate("children_data.coach", "-__v")
        .populate("children_data.schedule", "-__v")
        .populate("coach", "-__v")
        .populate([{
            path: 'children_data.class',
            populate: {
                path: 'schedules',
                model: 'Schedule',
                populate: {
                    path: 'coaches',
                    model: 'Coach'
                },
            }
        }, {
            path: 'children_data.class',
            populate: {
                path: 'school',
                model: 'School'
            },
        }])
        .exec(function (err, data) {
            if (err) return res.status(404).send({ message: "Not found Customer with id " + id });
            res.send(data);
        });
};

exports.updateCustomer = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const userId = req.params.userId;
    const customerId = req.params.customerId;
    const password = bcrypt.hashSync(req.body.password, 8);

    User.findByIdAndUpdate(userId, { email: req.body.email, password: password }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with id=${userId}. Maybe User was not found!`
                });
            } else {
                Customer.findByIdAndUpdate(customerId,
                    {
                        password: req.body.password,
                        email: req.body.email,
                        parent_name: req.body.parent_name,
                        children_data: req.body.children_data,
                        created_by_name: req.body.created_by_name,
                        created_by_user_id: req.body.created_by_user_id,
                    }, { useFindAndModify: false })
                    .then(data => {
                        if (!data) {
                            res.status(404).send({
                                message: `Cannot update Customer with id=${customerId}. Maybe Customer was not found!`
                            });
                        } else res.send({ message: "User Customer was updated successfully." });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Error updating Customer with id=" + customerId
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + userId
            });
        });
};

exports.findCustomerWithSlot = (req, res) => {
    Customer.find({ coach: req.body.coach })
        .then(data => {
            var cust = data.map((element) => {
                return { ...element, children_data: element.children_data.filter((subElement) => subElement.slot === req.body.slot) };
            });
            cust.forEach(v => {
                delete v.$__;
                delete v.$isNew;
            });
            if (!data) {
                res.status(404).send({
                    message: `Maybe Customer was not found!`
                });
            } else {
                res.send(cust);
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not find Customer"
            });
        });
};

exports.deleteCustomer = (req, res) => {
    const id = req.body.id;
    const userId = req.body.user_id;

    Customer.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
                });
            } else {
                User.findByIdAndRemove(userId)
                    .then(data => {
                        if (!data) {
                            res.status(404).send({
                                message: `Cannot delete User with id=${id}. Maybe User was not found!`
                            });
                        } else {
                            res.send({
                                message: "Customer was deleted successfully!"
                            });
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Customer with id=" + id
            });
        });
};