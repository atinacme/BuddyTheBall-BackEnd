const db = require("../models");
const School = db.school;
const fs = require('fs');
var html_to_pdf = require('html-pdf-node');
const moment = require('moment');
const { sendEmailService } = require("../middlewares/sendEmailService");

const billingEmail = async (req, res) => {
    try {
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
                const htmlData = () => {
                    let t = '';
                    if (data.length > 0) {
                        for (let i in data) {
                            const v = data[i];
                            if (v.classes.length > 0) {
                                for (let u in v?.classes) {
                                    const q = v?.classes[u];
                                    for (let w in q?.schedules) {
                                        const e = q?.schedules[w];
                                        for (let y in e?.coaches) {
                                            const p = e?.coaches[y];
                                            t = t +

                                                `
                                    <div style="display: flex; flex-direction: column;">
                                    
                                    <h1>${v?.school_name}</h1>
        
                                        <h4>Number of Players:</h4> <p>${v?.customers.length}</p>
        
                                        <h4>Number of Couches:</h4> <p>${v?.coaches.length}</p>
        
                                        <h4>Name of Director:</h4> <p>${v?.director_name}</p>
        
                                        <h4>Email of Director:</h4> <p>${v?.director_email}</p>
        
                                        <h4>Phone of Director:</h4> <p>${v?.director_phone}</p>
        
                                        <h4>Established Date:</h4> <p>${moment(v?.time).format("YYYY-MM-DD h:mm A")}</p>
        
                                        <h4>Total Revenue for the Month:</h4> <p></p>
        
                                        <h4>Total Revenue Year to Date:</h4> <p></p>
        
                                        <h4>Total number of Students:</h4> <p>${v?.customers.map(r => r.children_data.length)}</p>
        
                                        <h4>Total number of Sessions:</h4> <p>${v?.classes.map(r => r.schedules.length)}</p>
        
                                        <h4>Total number of Kids Paused for the Month:</h4> <p>${v?.customers.map(r => r.children_data.length)}</p>
        
                                        <h1>Class</h1>
                                            
                                            <h4>Name, Email and Phone number of the Couch(s):</h4> <p></p>
        
                                            <h4>Number of Completed Sessions:</h4> <p></p>
        
                                            <h4>Number of Kids:</h4> <p></p>
        
                                            <h4>Number of Cancelled Sessions:</h4> <p></p>
        
                                            <h4>Number of Rescheduled Sessions:</h4> <p></p>
        
                                            <h1>Session</h1>
        
                                                <h4>Start Date of the Session:</h4> <p>${e?.date}</p>
        
                                                <h4>End Date of the Session:</h4> <p>${e?.date}</p>
        
                                                <h4>Start Time of the Session:</h4> <p>${e?.start_time}</p>
        
                                                <p>[PHOTO] ${p?.coach_name} ${p?.email}</p>
        
                                                <h4>Number of Absence:</h4> <p></p>
        
                                                <h4>Number of Present:</h4> <p></p>
                                    </div>
                            `;
                                        }
                                    }
                                }
                            } else {
                                t = t +

                                    `
                                    <div style="display: flex; flex-direction: column;">
                                    
                                    <h1>${v?.school_name}</h1>
        
                                        <h4>Number of Players:</h4> <p>${v?.customers.length}</p>
        
                                        <h4>Number of Couches:</h4> <p>${v?.coaches.length}</p>
        
                                        <h4>Name of Director:</h4> <p>${v?.director_name}</p>
        
                                        <h4>Email of Director:</h4> <p>${v?.director_email}</p>
        
                                        <h4>Phone of Director:</h4> <p>${v?.director_phone}</p>
        
                                        <h4>Established Date:</h4> <p>${moment(v?.time).format("YYYY-MM-DD h:mm A")}</p>
        
                                        <h4>Total Revenue for the Month:</h4> <p></p>
        
                                        <h4>Total Revenue Year to Date:</h4> <p></p>
        
                                        <h4>Total number of Students:</h4> <p>${v?.customers.map(r => r.children_data.length)}</p>
        
                                        <h4>Total number of Sessions:</h4> <p>${v?.classes.map(r => r.schedules.length)}</p>
        
                                        <h4>Total number of Kids Paused for the Month:</h4> <p>${v?.customers.map(r => r.children_data.length)}</p>
                                    </div>
                            `;
                            }
                        }
                    } else {
                        t = t + `No School Registered`;
                    }
                    return t;
                };
                let filename = Date.now() + "-billing-invoice" + ".pdf";
                let filepath = __basedir + "/resources/" + filename;
                let options = { format: 'A4', path: filepath };
                let file = { content: htmlData() };
                html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
                    fs.writeFileSync(options.path, pdfBuffer); // Save the PDF buffer to the specified file path
                });
                setTimeout(async () => {
                    await sendEmailService(req.body.email, 'Billing Invoice', 'All School Billing Invoice', filename, filepath);
                }, 5000)
            });
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false });
    }
};

module.exports = { billingEmail }