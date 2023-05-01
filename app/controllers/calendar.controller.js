const db = require("../models");
const Calendar = db.calendar;
const Coach = db.coach;

const createAgenda = async (req, res) => {
    try {
        const agenda = { [req.body.agenda_date]: req.body.agenda_data };
        const calendar = new Calendar({
            coach_id: req.body.coach_id,
            user_id: req.body.user_id,
            agenda: agenda,
            agenda_date: req.body.agenda_date,
            agenda_data: req.body.agenda_data
        });
        calendar.save(calendar);
        Coach.findByIdAndUpdate(req.body.coach_id,
            {
                $push: {
                    agendas: calendar
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
            data: calendar,
            message: 'Agenda Created Successfully !!'
        });
    } catch (error) {
        console.log(error);
    }
};

const getAgendaByDateAndCoach = async (req, res) => {
    try {
        const data = await Calendar.find({ agenda_date: req.body.agenda_date, user_id: req.body.user_id });
        if (data.length === 0)
            res.status(404).send({ message: 'No Agenda found on date ' + req.body.agenda_date });
        else res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
};

const getAgendaByCoach = async (req, res) => {
    try {
        const data = await Calendar.find({ user_id: req.params.id });
        if (data.length === 0)
            res.status(404).send({ message: 'No Agenda found for coach ' + req.params.id });
        else res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
};

const updateAgenda = async (req, res) => {
    const agendaId = req.params.id;
    const agenda = { [req.body.agenda_date]: req.body.agenda_data };
    try {
        var calendar = {
            coach_id: req.body.coach_id,
            user_id: req.body.user_id,
            agenda: agenda,
            agenda_date: req.body.agenda_date,
            agenda_data: req.body.agenda_data
        };
        await Calendar.findByIdAndUpdate(agendaId, calendar);
        Coach.findById(req.body.coach_id)
            .then(data => {
                console.log("user--->", data);
                if (data) {
                    Coach.updateOne({ 'agendas._id': agendaId }, {
                        '$set': {
                            'agendas.$.agenda': agenda,
                            'agendas.$.agenda_date': req.body.agenda_date,
                            'agendas.$.agenda_data': req.body.agenda_data
                        }
                    })
                        .then(data => {
                            if (!data) {
                                console.log(`Cannot update Coach with id=${req.body.user_id}. Maybe Coach was not found!`);
                            } else console.log("User Coach was updated successfully.");
                        })
                        .catch(err => {
                            console.log("Error updating Coach with id=" + req.body.user_id);
                        });
                }
            });
        // if (data.length === 0)
        //     res.status(404).send({ message: 'Agenda not Updated on date ' + req.body.agenda_date });
        // else res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createAgenda,
    getAgendaByDateAndCoach,
    getAgendaByCoach,
    updateAgenda
};