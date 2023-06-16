const db = require("../models");
const RegionalManager = db.regionalmanager;
const Schedule = db.schedule;
const Coach = db.coach;

const createSchedule = async (req, res) => {
    try {
        const schedule = new Schedule({
            created_by: req.body.created_by,
            created_by_name: req.body.created_by_name,
            created_by_user_id: req.body.created_by_user_id,
            coaches: req.body.coaches,
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            // school: req.body.school,
            topic: req.body.topic
        });
        schedule.save(schedule);
        Coach.findByIdAndUpdate(req.body.coach,
            {
                $push: {
                    schedules: schedule
                }
            }, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    console.log(`Cannot update Coach with id=${req.body.user_id}. Maybe Coach was not found!`);
                } else console.log("User Coach was updated successfully.");
            })
            .catch(err => {
                console.log("Error updating Coach with id=" + req.body.user_id);
            });
        return res.status(200).send({
            data: schedule,
            message: 'Schedule Created Successfully !!'
        });
    } catch (error) {
        console.log(error);
    }
};

const getSchedules = async (req, res) => {
    try {
        const data = await Schedule.find().populate("coaches", "-__v").populate("school", "-__v").populate("school.customers", "-__v");
        if (data.length === 0)
            res.status(404).send({ message: 'No Schedule found' });
        else res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
};

const getScheduleByDateAndCoach = async (req, res) => {
    try {
        const data = await Schedule.find({ date: req.body.date, created_by_user_id: req.body.created_by_user_id }).populate("school", "-__v").populate("school.customers", "-__v");
        if (data.length === 0)
            res.status(404).send({ message: 'No Schedule found on date ' + req.body.date });
        else res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
};

const getScheduleByRegionalManagerAndSchool = async (req, res) => {
    try {
        Schedule.find({ created_by_user_id: req.body.created_by_user_id, school: req.body.school_id })
            .populate("coach", "-__v")
            .populate("school", "-__v")
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving coaches."
                });
            });
    } catch (error) {
        console.log(error);
    }
};

const getScheduleByCoach = async (req, res) => {
    try {
        Schedule.find({ created_by_user_id: { $in: [req.body.coach_id, req.body.regional_manager_id] } })
            .populate("school", "-__v")
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving coaches."
                });
            });
    } catch (error) {
        console.log(error);
    }
};

const getScheduleCreatedByUserId = async (req, res) => {
    try {
        Schedule.find({ created_by_user_id: req.params.id })
            .populate("coaches", "-__v")
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving coaches."
                });
            });
    } catch (error) {
        console.log(error);
    }
};

const updateSchedule = async (req, res) => {
    const scheduleId = req.params.id;
    try {
        var schedule = {
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            topic: req.body.topic
        };
        Schedule.findByIdAndUpdate(scheduleId, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    console.log(`Cannot update Schedule with id=${scheduleId}`);
                } else res.status(200).send("Schedule updated successfully.");
            });
    } catch (error) {
        console.log(error);
    }
};

const deleteSchedule = async (req, res) => {
    const id = req.body.id;

    Schedule.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Schedule with id=${id}. Maybe Schedule was not found!`
                });
            } else {
                res.send({
                    message: "Schedule was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Schedule with id=" + id
            });
        });
};

module.exports = {
    createSchedule,
    getSchedules,
    getScheduleByDateAndCoach,
    getScheduleByRegionalManagerAndSchool,
    getScheduleByCoach,
    getScheduleCreatedByUserId,
    updateSchedule,
    deleteSchedule
};