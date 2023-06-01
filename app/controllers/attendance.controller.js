const db = require('../models');
const Attendance = db.attendance;
const Customer = db.customer;

const createAndUpdateAttendance = async (req, res) => {
    try {
        const check = await Attendance.find({ child_id: req.body.child_id, session_id: req.body.session_id });
        if (check.length > 0) {
            console.log("come update");
            const data = await Attendance.findOneAndUpdate({
                child_id: req.body.child_id, session_id: req.body.session_id
            }, { attendance: req.body.attendance });
            if (!data) {
                res.status(404).send({ message: 'Attendance not updated!!' });
            } else {
                Attendance.find({ child_id: req.body.child_id }).then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update Customer with id=${req.body.customer_id}. Maybe Customer was not found!`
                        });
                    } else {
                        var attendanceRes = data.reduce(function (obj, v) {
                            obj[v.attendance] = (obj[v.attendance] || 0) + 1;
                            return obj;
                        }, {});
                        Customer.findById(req.body.customer_id)
                            .then(newdata => {
                                console.log("user update--->", data, newdata);
                                if (newdata) {
                                    Customer.updateOne({ 'children_data._id': req.body.child_id }, {
                                        '$set': {
                                            // 'children_data.$.attendance': data,
                                            'children_data.$.total_absent': 'A' in attendanceRes ? attendanceRes.A : null,
                                            'children_data.$.total_present': 'P' in attendanceRes ? attendanceRes.P : null
                                        }
                                    })
                                        .then(data => {
                                            if (!data) {
                                                res.status(404).send({
                                                    message: `Cannot update Customer with id=${req.body.customer_id}. Maybe Customer was not found!`
                                                });
                                            } else res.send({ message: "User Customer was updated successfully." });
                                        })
                                        .catch(err => {
                                            res.status(500).send({
                                                message: "Error updating Customer with id=" + req.body.customer_id
                                            });
                                        });
                                }
                            });
                    }
                });
            }
        } else {
            console.log("come create");
            const attendance = new Attendance({
                coach_id: req.body.coach_id,
                school_id: req.body.school_id,
                user_id: req.body.user_id,
                customer_id: req.body.customer_id,
                customer: req.body.customer,
                child_id: req.body.child_id,
                player_name: req.body.player_name,
                session_id: req.body.session_id,
                attendance_date: req.body.attendance_date,
                attendance: req.body.attendance,
                start_time: req.body.start_time,
                end_time: req.body.end_time
            });
            const data = attendance.save(attendance);
            if (!data) {
                res.status(404).send({ message: 'Attendance not created' });
            } else {
                data.then(newData => {
                    console.log("hdgshd--->", data, newData);
                    if (!newData) {
                        res.status(404).send({
                            message: `Cannot update Customer with id=${req.body.customer_id}. Maybe Customer was not found!`
                        });
                    } else {
                        // Attendance.find().then(data => {
                        //     if (!data) {
                        //         res.status(404).send({
                        //             message: `Cannot update Customer with id=${req.body.customer_id}. Maybe Customer was not found!`
                        //         });
                        //     } {
                        var attendanceRes = [newData].reduce(function (obj, v) {
                            obj[v.attendance] = (obj[v.attendance] || 0) + 1;
                            return obj;
                        }, {});
                        Customer.findById(req.body.customer_id)
                            .then(data => {
                                console.log("user--->", data);
                                if (data) {
                                    Customer.updateOne({ 'children_data._id': req.body.child_id }, {
                                        '$set': {
                                            'children_data.$.attendance': [newData._id],
                                            'children_data.$.total_absent': 'A' in attendanceRes ? attendanceRes.A : null,
                                            'children_data.$.total_present': 'P' in attendanceRes ? attendanceRes.P : null
                                        }
                                    })
                                        .then(data => {
                                            if (!data) {
                                                res.status(404).send({
                                                    message: `Cannot update Customer with id=${req.body.customer_id}. Maybe Customer was not found!`
                                                });
                                            } else res.send({ message: "User Customer was updated successfully." });
                                        })
                                        .catch(err => {
                                            res.status(500).send({
                                                message: "Error updating Customer with id=" + req.body.customer_id
                                            });
                                        });
                                }
                            });
                    }
                    //     });
                    // }
                });
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAttendanceByDate = async (req, res) => {
    try {
        const data = await Attendance.find({ attendance_date: req.body.attendance_date });
        if (!data) {
            res.status(404).send({ message: 'Attendance not fetched' });
        } return res.status(200).send({ data: data, message: 'Attendance Fetched Successfully!!' });
    } catch (err) {
        res.status(500).send(err);
    }
};

const getAttendanceBySession = async (req, res) => {
    try {
        const data = await Attendance.find({ session_id: req.body.session_id });
        if (!data) {
            res.status(404).send({ message: 'Attendance not fetched' });
        } return res.status(200).send({ data: data, message: 'Attendance Fetched Successfully!!' });
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteAttendanceByDate = async (req, res) => {
    try {
        const data = await Attendance.findByIdAndDelete(req.params.id);
        if (!data) {
            res.status(404).send({ message: 'Attendance not deleted' });
        } return res.status(200).send({ data: data, message: 'Attendance Deleted Successfully!!' });
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { createAndUpdateAttendance, getAttendanceByDate, getAttendanceBySession, deleteAttendanceByDate };