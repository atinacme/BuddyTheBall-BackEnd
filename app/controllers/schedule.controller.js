const db = require("../models");
const moment = require('moment');
const Schedule = db.schedule;
const Coach = db.coach;

const createSchedule = async (req, res) => {
    try {
        function getYear(timestamp) {
            return (new Date(timestamp * 1000)).getFullYear();
        }
        function getMon(timestamp) {
            return (new Date(timestamp * 1000)).getMonth();
        }
        function getDate(timestamp) {
            return (new Date(timestamp * 1000)).getDate();
        }
        function convertDateFormat(inputDate) {
            // Split the input date string into components
            var components = inputDate.split('-');

            if (components.length === 3) {
                var year = components[0];
                var day = components[1];
                var month = components[2];

                // Create the new date string in "YYYY-MM-DD" format
                var newDate = year + '-' + month + '-' + day;
                return newDate;
            } else {
                // Handle invalid input format
                return "Invalid date format";
            }
        }
        var status;
        var local = new Date(req.body.date).toLocaleDateString();
        var newdate = local.split("/").reverse().join("-");
        var dateStringFormat = convertDateFormat(newdate);
        var timestamp = new Date(dateStringFormat).getTime() / 1000;
        var startTime = moment(req.body.start_time, ["h:mm A"]).format("HH:mm");
        var startTimeSplit = startTime.split(":");
        var dateTimeStartString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), startTimeSplit[0], startTimeSplit[1]);
        var parsedTimeStartString = Date.parse(dateTimeStartString);
        var endTime = moment(req.body.end_time, ["h:mm A"]).format("HH:mm");
        var endTimeSplit = endTime.split(":");
        var dateTimeEndString = new Date(getYear(timestamp), getMon(timestamp), getDate(timestamp), endTimeSplit[0], endTimeSplit[1]);
        var parsedTimeEndString = Date.parse(dateTimeEndString);
        var parsedCurrentDateTimeString = Date.parse(moment().utcOffset("+05:30").format());
        if (parsedCurrentDateTimeString >= parsedTimeStartString && parsedCurrentDateTimeString <= parsedTimeEndString) {
            status = 'Incomplete';
        } else if (parsedCurrentDateTimeString <= parsedTimeStartString) {
            status = 'Upcoming';
        } else {
            status = 'Ended';
        }
        console.log("xsxxs----->", newdate, timestamp, parsedTimeStartString, parsedCurrentDateTimeString, parsedTimeEndString, status);
        const schedule = new Schedule({
            created_by: req.body.created_by,
            created_by_name: req.body.created_by_name,
            created_by_user_id: req.body.created_by_user_id,
            coaches: req.body.coaches,
            date: req.body.date,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            status: status,
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
                    console.log(`Cannot update Coach. Maybe Coach was not found!`);
                } else console.log("User Coach was updated successfully.");
            })
            .catch(err => {
                console.log("Error updating Coach");
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
        const data = await Schedule.find().populate("coaches", "-__v");
        if (data.length === 0)
            res.status(404).send({ message: 'No Schedule found' });
        else res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
};

const getScheduleByDateAndCoach = async (req, res) => {
    try {
        const data = await Schedule.find({ date: req.body.date, created_by_user_id: req.body.created_by_user_id });
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
            // .populate("school", "-__v")
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
            // .populate("school", "-__v")
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
        // var schedule = {
        //     date: req.body.date,
        //     start_time: req.body.start_time,
        //     end_time: req.body.end_time,
        //     topic: req.body.topic
        // };
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