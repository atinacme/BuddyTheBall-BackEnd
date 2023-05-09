const db = require("../models");
const Region = db.region;

exports.createRegion = (req, res) => {
    if (!req.body.region_name) {
        res.status(400).send({ message: "Region Name can not be empty!" });
        return;
    }

    // Create a Region
    const region = new Region({
        region_name: req.body.region_name,
        cities: req.body.cities
    });

    // Save Region in the database
    region
        .save(region)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Region."
            });
        });
};

exports.getRegions = (req, res) => {
    Region.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving regions."
            });
        });
};

exports.findParticularRegion = (req, res) => {
    const id = req.params.id;

    Region.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Region with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Region with id=" + id });
        });
};

exports.updateRegion = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Region.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Region with id=${id}. Maybe Region was not found!`
                });
            } else res.send({ message: "Region was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Region with id=" + id
            });
        });
};

exports.deleteRegion = (req, res) => {
    const id = req.body.id;

    Region.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Region with id=${id}. Maybe Region was not found!`
                });
            } else {
                res.send({
                    message: "Region was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Region with id=" + id
            });
        });
};