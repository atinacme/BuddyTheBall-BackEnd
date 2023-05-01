const db = require("../models");
const Coach = db.coach;
const User = db.user;
const Role = db.role;
const Customer = db.customer;
const Messages = db.messages;

const createAndUpdateMessage = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to create can not be empty!"
        });
    }

    if (req.body.receiver_role === 'customer') {
        Customer.find(
            {
                _id: { $in: req.body.receiver_id }
            },
            (err, player) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                } else {
                    var player_name = player.map(player => player.player_name);
                    var player_profile_url = player.map(player => player.profile_data.url);
                    console.log("hgxd--->", req.body.receiver_id);
                    Messages.find(
                        {
                            receiver_id: { $in: req.body.receiver_id }
                        },
                        (err, data) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            } else {
                                console.log("customer data--->", data, req.body);
                                if (data.length > 0) {
                                    const messages = [{
                                        messanger_id: req.body.messanger_id,
                                        role: req.body.role,
                                        url: req.body.url,
                                        message: req.body.message,
                                        messanger_name: req.body.messanger_name
                                    }];
                                    Messages.findByIdAndUpdate(req.body.message_id, {
                                        time: new Date,
                                        last_message: req.body.message,
                                        last_messanger: req.body.messanger_name,
                                        $push: {
                                            messages: messages
                                        }
                                    }, { new: true })
                                        .then(data => {
                                            if (!data)
                                                res.status(404).send({ message: "Can't send message with message id " + req.body.message_id });
                                            else res.send(data);
                                        })
                                        .catch(err => {
                                            res
                                                .status(500)
                                                .send({ message: "Error sending message with message id=" + req.body.message_id });
                                        });
                                } else {
                                    const messages = [{
                                        messanger_id: req.body.sender_id,
                                        role: req.body.sender_role,
                                        url: req.body.sender_profile_url,
                                        message: req.body.message,
                                        messanger_name: req.body.sender_name,
                                    }];
                                    const message = new Messages({
                                        sender_id: req.body.sender_id,
                                        sender_name: req.body.sender_name,
                                        sender_role: req.body.sender_role,
                                        sender_profile_url: req.body.sender_profile_url,
                                        receiver_id: req.body.receiver_id,
                                        receiver_name: player_name[0],
                                        receiver_role: 'customer',
                                        receiver_profile_url: player_profile_url[0],
                                        messages: messages,
                                        last_message: req.body.message,
                                        last_messanger: req.body.sender_name
                                    });
                                    message
                                        .save(message)
                                        .then(data => {
                                            res.status(200).send(data);
                                        })
                                        .catch(err => {
                                            res.status(500).send({
                                                message:
                                                    err.message || "Some error occurred while creating the Message."
                                            });
                                        });
                                }
                            }
                        });
                }
            }
        );
    } else if (req.body.receiver_role === 'coach') {
        Coach.find(
            {
                _id: { $in: req.body.receiver_id }
            },
            (err, coach) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                } else {
                    var coach_name = coach.map(coach => coach.coach_name);
                    var coach_profile_url = coach.map(coach => coach.profile_data.url);
                    Messages.find({ receiver_id: req.body.receiver_id })
                        .then(data => {
                            console.log("coach data--->", data, req.body, coach_profile_url);
                            if (data.length > 0) {
                                const messages = [{
                                    messanger_id: req.body.messanger_id,
                                    role: req.body.role,
                                    url: req.body.url,
                                    message: req.body.message,
                                    messanger_name: req.body.messanger_name
                                }];
                                Messages.findByIdAndUpdate(req.body.message_id, {
                                    time: new Date,
                                    last_message: req.body.message,
                                    last_messanger: req.body.messanger_name,
                                    $push: {
                                        messages: messages
                                    }
                                }, { new: true })
                                    .then(data => {
                                        if (!data)
                                            res.status(404).send({ message: "Can't send message with message id " + req.body.message_id });
                                        else res.send(data);
                                    })
                                    .catch(err => {
                                        res
                                            .status(500)
                                            .send({ message: "Error sending message with message id=" + req.body.message_id });
                                    });
                            } else {
                                const messages = [{
                                    messanger_id: req.body.sender_id,
                                    role: req.body.sender_role,
                                    url: req.body.sender_profile_url,
                                    message: req.body.message,
                                    messanger_name: req.body.sender_name
                                }];
                                const message = new Messages({
                                    sender_id: req.body.sender_id,
                                    sender_name: req.body.sender_name,
                                    sender_role: req.body.sender_role,
                                    sender_profile_url: req.body.sender_profile_url,
                                    receiver_id: req.body.receiver_id,
                                    receiver_name: coach_name[0],
                                    receiver_role: 'coach',
                                    receiver_profile_url: coach_profile_url[0],
                                    messages: messages,
                                    last_message: req.body.message,
                                    last_messanger: req.body.sender_name
                                });
                                message
                                    .save(message)
                                    .then(data => {
                                        res.status(200).send(data);
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                            message:
                                                err.message || "Some error occurred while creating the Message."
                                        });
                                    });
                            }
                        });
                }
            }
        );
    } else {
        Role.find({ name: 'superadmin' },
            (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                } else {
                    User.find({ roles: role[0]._id },
                        (err, receiver_id) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            } else {
                                Messages.find({ receiver_id: receiver_id[0]._id })
                                    .then(data => {
                                        console.log("superadmin data--->", data);
                                        if (data.length > 0) {
                                            const messages = [{
                                                messanger_id: req.body.messanger_id,
                                                role: req.body.role,
                                                url: req.body.url,
                                                message: req.body.message,
                                                messanger_name: req.body.messanger_name
                                            }];
                                            Messages.findByIdAndUpdate(req.body.message_id, {
                                                time: new Date,
                                                last_message: req.body.message,
                                                last_messanger: req.body.messanger_name,
                                                $push: {
                                                    messages: messages
                                                }
                                            }, { new: true })
                                                .then(data => {
                                                    if (!data)
                                                        res.status(404).send({ message: "Can't send message with message id " + req.body.message_id });
                                                    else res.send(data);
                                                })
                                                .catch(err => {
                                                    res
                                                        .status(500)
                                                        .send({ message: "Error sending message with message id=" + req.body.message_id });
                                                });
                                        } else {
                                            const messages = [{
                                                messanger_id: req.body.sender_id,
                                                role: req.body.sender_role,
                                                url: req.body.sender_profile_url,
                                                message: req.body.message,
                                                messanger_name: req.body.sender_name,
                                            }];

                                            const message = new Messages({
                                                sender_id: req.body.sender_id,
                                                sender_name: req.body.sender_name,
                                                sender_role: req.body.sender_role,
                                                sender_profile_url: req.body.sender_profile_url,
                                                receiver_id: receiver_id[0]._id,
                                                receiver_name: 'Super Admin',
                                                receiver_role: 'superadmin',
                                                receiver_profile_url: null,
                                                messages: messages,
                                                last_message: req.body.message,
                                                last_messanger: req.body.sender_name
                                            });
                                            message
                                                .save(message)
                                                .then(data => {
                                                    res.status(200).send(data);
                                                })
                                                .catch(err => {
                                                    res.status(500).send({
                                                        message:
                                                            err.message || "Some error occurred while creating the Message."
                                                    });
                                                });
                                        }
                                    });
                            }
                        });
                }
            });
    }
};

const getMessagesBySenderId = (req, res) => {
    const id = req.params.id;
    Messages.find({ sender_id: id })
        .then(data => {
            if (data.length > 0) {
                res.send(data);
            } else {
                Messages.find({ receiver_id: id })
                    .then(data => {
                        if (!data)
                            res.status(404).send({ message: "Not found Sender with id " + id });
                        else res.send(data);
                    })
                    .catch(err => {
                        res
                            .status(500)
                            .send({ message: "Error retrieving Sender with id=" + id });
                    });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Sender with id=" + id });
        });
};

const getMessagesBySenderIdReceiverId = (req, res) => {
    const sender_id = req.params.sender_id;
    const receiver_id = req.params.receiver_id;
    Messages.find({ sender_id: sender_id, receiver_id: receiver_id })
        .then(data => {
            if (data.length > 0) {
                res.send(data);
            } else {
                Messages.find({ sender_id: receiver_id, receiver_id: sender_id })
                    .then(data => {
                        if (!data)
                            res.status(404).send({ message: "Not found Sender with id " + id });
                        else res.send(data);
                    })
                    .catch(err => {
                        res
                            .status(500)
                            .send({ message: "Error retrieving Sender with id=" + id });
                    });
            }
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Sender with id=" + id });
        });
};

module.exports = {
    createAndUpdateMessage,
    getMessagesBySenderId,
    getMessagesBySenderIdReceiverId
};