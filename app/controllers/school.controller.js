const db = require("../models");
const School = db.school;

exports.createSchool = (req, res) => {
    if (!req.body.school_name) {
        res.status(400).send({ message: "School Name can not be empty!" });
        return;
    }

    // Create a School
    const school = new School({
        school_name: req.body.school_name,
        region: req.body.region,
        assigned_day: req.body.assigned_day,
        address: req.body.address
    });

    // Save School in the database
    school
        .save(school)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the School."
            });
        });
};

exports.getSchools = (req, res) => {
    School.find()
        .populate("customers coaches classes")
        .populate([{
            path: 'classes', populate: {
                path: 'schedules',
                model: 'Schedule',
                populate: {
                    path: 'coaches',
                    model: 'Coach'
                },
            },
        }, {
            path: 'classes', populate: {
                path: 'school',
                model: 'School'
            },
        }])
        .exec(function (err, data) {
            if (err) return res.status(404).send({ message: "Not found Schools" });
            res.send(data);
        });
};

exports.findParticularSchool = (req, res) => {
    const id = req.params.id;

    School.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found School with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving School with id=" + id });
        });
};

exports.findRegionWiseSchools = (req, res) => {
    School.find({ region: req.body.region }).populate("customers").populate("coaches").exec(function (err, docs) {
        var options = {
            path: 'coaches.schedules',
            model: 'Schedule'
        };
        if (err) return res.status(404).send({ message: "Not found School" });
        School.populate(docs, options, function (err, data) {
            if (err) return res.status(500).send({ message: "Error retrieving School" });
            res.send(data);
        });
    });
};

exports.updateSchool = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    School.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update School with id=${id}. Maybe School was not found!`
                });
            } else res.send({ message: "School was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating School with id=" + id
            });
        });
};

exports.deleteSchool = (req, res) => {
    const id = req.params.id;

    School.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete School with id=${id}. Maybe School was not found!`
                });
            } else {
                res.send({
                    message: "School was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete School with id=" + id
            });
        });
};