const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Customer = db.customer;
const School = db.school;
const Coach = db.coach;
const RegionalManager = db.regionalmanager;
const Class = db.class;

exports.signup = (req, res) => {
    const user = new User({
        // username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            if (req.body.roles[0] === "customer") {
                var children_data = [];
                req.body.children_data.forEach(element => {
                    // const current_award = {
                    //     name: element.current_award ? element.current_award.name : null,
                    //     image: element.current_award ? element.current_award.image : null
                    // };
                    children_data.push({
                        player_name: element.player_name,
                        player_age: element.player_age,
                        wristband_level: element.wristband_level ? element.wristband_level : null,
                        class: element.class,
                        handed: element.handed,
                        num_buddy_books_read: element.num_buddy_books_read,
                        jersey_size: element.jersey_size ? element.jersey_size : null,
                        current_award: element.current_award
                    });
                });
                const customer = new Customer({
                    user_id: user._id,
                    email: req.body.email,
                    password: req.body.password,
                    parent_name: req.body.parent_name,
                    created_by: req.body.created_by,
                    created_by_name: req.body.created_by_name,
                    created_by_user_id: req.body.created_by_user_id,
                    coach: req.body.created_by === "coach" ? req.body.coach : null,
                    children_data: children_data
                });

                customer.save((err, customer) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    var schoolsList = [];
                    req.body.children_data.forEach(element => {
                        Class.findById(element.class).then(data => {
                            schoolsList.push(data.school);
                        })
                    });
                    setTimeout(() => {
                        const school_arr = schoolsList.filter((item, index) => schoolsList.indexOf(item) === index);
                        school_arr.forEach(v => {
                            School.findByIdAndUpdate(v, {
                                $push: {
                                    customers: customer._id
                                }
                            })
                                .then();
                        });
                    }, 1000)
                });
            }
            if (req.body.roles[0] === "coach") {
                const coach = new Coach({
                    user_id: user._id,
                    email: req.body.email,
                    password: req.body.password,
                    coach_name: req.body.coach_name,
                    tennis_club: req.body.tennis_club,
                    assigned_region: req.body.assigned_region,
                    assigned_by: req.body.assigned_by,
                    assigned_by_user_id: req.body.assigned_by_user_id,
                    favorite_pro_player: req.body.favorite_pro_player,
                    handed: req.body.handed,
                    favorite_drill: req.body.favorite_drill
                });

                coach.save((err, coach) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    if (req.body.assigned_schools) {
                        School.find(
                            {
                                school_name: { $in: req.body.assigned_schools }
                            },
                            (err, school) => {
                                if (err) {
                                    res.status(500).send({ message: err });
                                    return;
                                }

                                coach.assigned_schools = school.map(school => school._id);
                                coach.save(err => {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                        return;
                                    }
                                });
                            }
                        );
                        req.body.assigned_schools.forEach(v => {
                            School.find({ school_name: v })
                                .then((data => {
                                    School.findByIdAndUpdate(data[0]._id, {
                                        $push: {
                                            coaches: coach
                                        }
                                    })
                                        .then();
                                }));
                        });
                    }
                });
            }
            if (req.body.roles[0] === "regionalmanager") {
                const regionalmanager = new RegionalManager({
                    user_id: user._id,
                    email: req.body.email,
                    password: req.body.password,
                    regional_manager_name: req.body.regional_manager_name,
                    assigned_region: req.body.assigned_region
                });

                regionalmanager.save((err, regionalmanager) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                });
            }
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: "User was registered successfully!" });
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: "User was registered successfully!" });
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ status: 404, message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    status: 401,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            if (authorities[0] === "ROLE_COACH") {
                Coach.findOne({
                    email: req.body.email
                })
                    .populate("assigned_schools", "-__v")
                    .populate("classes", "-__v")
                    .populate("schedules", "-__v")
                    .exec((err, coach_data) => {
                        if (err) {
                            res.status(500).send({ message: err });
                        }
                        return res.status(200).send({
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            roles: authorities,
                            status: 200,
                            coach_data: coach_data,
                            accessToken: token
                        });
                    });
            } else if (authorities[0] === "ROLE_CUSTOMER") {
                Customer.findOne({
                    email: req.body.email
                })
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
                    .exec(function (err, customer_data) {
                        if (err) return res.status(404).send({ message: "Not found Customer with email" + email });
                        return res.status(200).send({
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            roles: authorities,
                            status: 200,
                            customer_data: customer_data,
                            accessToken: token
                        });
                    });
            } else if (authorities[0] === "ROLE_REGIONALMANAGER") {
                RegionalManager.findOne({
                    email: req.body.email
                })
                    .exec((err, regionalmanager_data) => {
                        if (err) {
                            res.status(500).send({ message: err });
                        }
                        return res.status(200).send({
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            roles: authorities,
                            status: 200,
                            regionalmanager_data: regionalmanager_data,
                            accessToken: token
                        });
                    });
            } else {
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            }
        });
};