require('dotenv').config();

module.exports = {
    HOST: process.env.NODE_ENV === "production" ? process.env.HOST : "0.0.0.0",
    PORT: process.env.NODE_ENV === "production" ? process.env.PORT : 27017,
    DB: process.env.NODE_ENV === "production" ? process.env.DB : "BuddyTheBall",
    imgBucket: process.env.NODE_ENV === "production" ? process.env.imgBucket : "photos",
    awardsBucket: process.env.NODE_ENV === "production" ? process.env.awardsBucket : "awards"
};