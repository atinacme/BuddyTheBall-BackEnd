const db = require("../models");
const Awards = db.awards;

const createAwards = async (req, res) => {
    try {
        var awards_data = []
        req.body.forEach(element => {
            const awards = new Awards({
                award_name: element.award_name,
                award_description: element.award_description
            });

            awards
                .save(awards)
                .then(data => {
                    awards_data.push(data)
                    console.log(data);
                })
        });
        res.status(200).send(awards_data)
    } catch (error) {
        console.log(error);
    }
};

const getAwards = async (req, res) => {
    try {
        const data = await Awards.find()
        if (data) {
            res.status(200).send(data)
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createAwards, getAwards };