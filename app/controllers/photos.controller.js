const upload = require("../middlewares/upload");
const dbConfig = require("../config/db.config");
const db = require("../models");
const Coach = db.coach;
const Customer = db.customer;
const Photos = db.photos;
const School = db.school;
const RegionalManager = db.regionalmanager;
const Schedule = db.schedule;
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const Db = require('mongodb').Db;
const mongoose = require("mongoose");

const baseUrl = process.env.NODE_ENV === "production" ? "https://buddytheball-backend.herokuapp.com/api/files/" : "http://localhost:8080/api/files/";
const uri = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;
const mongoClient = new MongoClient(uri);

const uploadCustomerPhotos = async (req, res) => {
    try {
        await upload(req, res);
        if (req.files.length <= 0) {
            return res
                .status(400)
                .send({ message: "You must select at least 1 file." });
        }

        const userId = await Customer.findById(req.body.customer_id);

        if (req.body.file_type === "profile") {
            if (req.body.role === 'ROLE_COACH') {
                const profile_data = {
                    photo_id: req.files[0].id,
                    fieldname: req.files[0].fieldname,
                    originalname: req.files[0].originalname,
                    encoding: req.files[0].encoding,
                    mimetype: req.files[0].mimetype,
                    filename: req.files[0].filename,
                    size: req.files[0].size,
                    url: baseUrl + req.files[0].filename
                };
                await Coach.findByIdAndUpdate(req.body.coach_id, {
                    $set: {
                        profile_data: profile_data,
                    }
                }, { new: true }, function (err, docs) {
                    if (err) {
                        console.log(err);
                    } else {
                        // return res.status(200).send({
                        //     message: "Profile Picture has been uploaded.",
                        // });
                    }
                }).clone();
            }
            if (req.body.role === 'ROLE_REGIONALMANAGER') {
                const profile_data = {
                    photo_id: req.files[0].id,
                    fieldname: req.files[0].fieldname,
                    originalname: req.files[0].originalname,
                    encoding: req.files[0].encoding,
                    mimetype: req.files[0].mimetype,
                    filename: req.files[0].filename,
                    size: req.files[0].size,
                    url: baseUrl + req.files[0].filename
                };
                await RegionalManager.findByIdAndUpdate(req.body.regional_manager_id, {
                    $set: {
                        profile_data: profile_data,
                    }
                }, { new: true }, function (err, docs) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("sxcdedsc");
                        // return res.status(200).send({
                        //     message: "Profile Picture has been uploaded.",
                        // });
                    }
                }).clone();
            } else {
                const profile_data = {
                    photo_id: req.files[0].id,
                    fieldname: req.files[0].fieldname,
                    originalname: req.files[0].originalname,
                    encoding: req.files[0].encoding,
                    mimetype: req.files[0].mimetype,
                    filename: req.files[0].filename,
                    size: req.files[0].size,
                    url: baseUrl + req.files[0].filename
                };
                await Customer.findByIdAndUpdate(req.body.customer_id, {
                    $set: {
                        profile_data: profile_data,
                    }
                }, { new: true }, function (err, docs) {
                    if (err) {
                        console.log(err);
                    } else {
                        // return res.status(200).send({
                        //     message: "Profile Picture has been uploaded.",
                        // });
                    }
                }).clone();
            }
        } else if (req.body.file_type === "award") {
            req.files.forEach(element => {
                const customerPhotos = new Photos({
                    photo_id: element.id,
                    fieldname: element.fieldname,
                    originalname: element.originalname,
                    encoding: element.encoding,
                    mimetype: element.mimetype,
                    destination: element.destination,
                    filename: element.filename,
                    path: element.path,
                    size: element.size,
                    upload_for: 'award',
                    upload_date: element.uploadDate
                });
                customerPhotos.save(customerPhotos);
            });
        } else {
            req.files.forEach(element => {
                const customerPhotos = new Photos({
                    user_id: userId.user_id,
                    customer_id: req.body.customer_id,
                    school_id: req.body.school_id,
                    coach_id: req.body.coach_id,
                    class_id: req.body.class_id,
                    schedule_id: req.body.schedule_id,
                    photo_id: element.id,
                    fieldname: element.fieldname,
                    originalname: element.originalname,
                    encoding: element.encoding,
                    mimetype: element.mimetype,
                    destination: element.destination,
                    filename: element.filename,
                    path: element.path,
                    size: element.size,
                    upload_date: element.uploadDate
                });
                customerPhotos.save((err, customerPhotos) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    Schedule.findByIdAndUpdate(customerPhotos.schedule_id, { status: 'Completed' }, { useFindAndModify: false })
                        .then(data => {
                            if (!data) {
                                console.log(`Cannot update Schedule with id=${v._id}`);
                            } else console.log("Schedule updated successfully.");
                        });
                });
            });
        }
        return res.status(200).send({
            message: "Files have been uploaded.",
        });
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload.",
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`,
        });
    }
};

const getAllSchoolPhotos = async (req, res) => {
    try {
        var school_photos = [];
        School.find()
            .then(data => {
                if (!data)
                    res.status(404).send({ message: "Can't send message with Photo id " + id });
                else {
                    data.forEach(v => {
                        var fileInfos = [];
                        Photos.find({ school_id: v._id }).populate("class_id", "-__v").populate("schedule_id", "-__v")
                            .then(photos => {
                                if (!photos)
                                    res.status(404).send({ message: "Can't send message with Photo id " + id });
                                else {

                                    if ((photos.length) === 0) {
                                        return res.status(500).send({
                                            message: "No files found!",
                                        });
                                    }

                                    photos.forEach((doc) => {
                                        fileInfos.push({
                                            _id: doc._id,
                                            user_id: doc.user_id,
                                            customer_id: doc.customer_id,
                                            school_id: doc.school_id,
                                            coach_id: doc.coach_id,
                                            class_id: doc.class_id,
                                            schedule_id: doc.schedule_id,
                                            photo_id: doc.photo_id,
                                            originalname: doc.originalname,
                                            name: doc.filename,
                                            url: baseUrl + doc.filename,
                                            messages: doc.messages
                                        });
                                    });

                                    school_photos.push({
                                        _id: v._id,
                                        school_name: v.school_name,
                                        region: v.region,
                                        photos: fileInfos
                                    });
                                    return res.status(200).send(school_photos);
                                }
                            })
                            .catch(err => {
                                res
                                    .status(500)
                                    .send({ message: "Error sending message with Photo id=" + id });
                            });
                    });
                }
            });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const getParticularSchoolPhotos = async (req, res) => {
    try {
        var fileInfos = [];
        var photos = await Photos.find({ school_id: req.params.id }).populate("class_id", "-__v").populate("schedule_id", "-__v");

        if ((photos.length) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        photos.forEach(async (doc) => {
            fileInfos.push({
                _id: doc._id,
                user_id: doc.user_id,
                customer_id: doc.customer_id,
                school_id: doc.school_id,
                coach_id: doc.coach_id,
                class_id: doc.class_id,
                schedule_id: doc.schedule_id,
                photo_id: doc.photo_id,
                originalname: doc.originalname,
                name: doc.filename,
                url: baseUrl + doc.filename,
                messages: doc.messages
            });
        });
        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const getParticularCustomerPhotos = async (req, res) => {
    try {
        var fileInfos = [];
        var photos = await Photos.find({ customer_id: req.params.id });

        if ((photos.length) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        photos.forEach((doc) => {
            fileInfos.push({
                _id: doc._id,
                user_id: doc.user_id,
                customer_id: doc.customer_id,
                school_id: doc.school_id,
                coach_id: doc.coach_id,
                photo_id: doc.photo_id,
                originalname: doc.originalname,
                name: doc.filename,
                url: baseUrl + doc.filename,
                messages: doc.messages
            });
        });
        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const getAwardPhotos = async (req, res) => {
    try {
        var fileInfos = [];
        var photos = await Photos.find({ upload_for: 'award' });

        if ((photos.length) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        photos.forEach((doc) => {
            fileInfos.push({
                _id: doc._id,
                photo_id: doc.photo_id,
                originalname: doc.originalname,
                name: doc.originalname.replace(".png", ""),
                url: baseUrl + doc.filename,
                messages: doc.messages
            });
        });
        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const getParticularPhoto = async (req, res) => {
    try {
        var data = await Photos.findById(req.params.id);
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const updateCustomerPhotosOnMessage = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    const message = [{
        messanger_id: req.body.messanger_id,
        message: req.body.message,
        messanger_name: req.body.messanger_name,
        url: req.body.url
    }];

    Photos.findByIdAndUpdate(id, {
        $push: {
            messages: message
        }
    }, { new: true })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Can't send message with Photo id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error sending message with Photo id=" + id });
        });
};

const getAnyParticularImage = async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('BuddyTheBall');
        const collection = db.collection('photos.files');
        const queryFile = { filename: req.params.filename };
        const result = await collection.find(queryFile).toArray();
        const id = mongoose.Types.ObjectId(result[0]._id);
        const collectionChunks = db.collection('photos.chunks');
        const query = { files_id: id };
        const chunks = await collectionChunks.find(query).toArray();
        if (!chunks || chunks.length === 0) {
            console.log("No data found");
        }
        let fileData = [];
        for (let i = 0; i < chunks.length; i++) {
            //This is in Binary JSON or BSON format, which is stored
            //in fileData array in base64 endocoded string format
            fileData.push(chunks[i].data.toString('base64'));
        }

        //Display the chunks using the data URI format
        var finalFile = "data:" + result[0].contentType + ";base64," + fileData.join("");
        return res.status(200).send(finalFile);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
    finally {
        await mongoClient.close();
    }
};

const download = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

module.exports = {
    uploadCustomerPhotos,
    getAllSchoolPhotos,
    getParticularSchoolPhotos,
    getAwardPhotos,
    updateCustomerPhotosOnMessage,
    getParticularPhoto,
    getAnyParticularImage,
    getParticularCustomerPhotos
};