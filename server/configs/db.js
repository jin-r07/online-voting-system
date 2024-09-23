require("dotenv").config();
const mongoose = require("mongoose");

const mongodb_url = process.env.MONGODB_URL;

mongoose.connect(mongodb_url, {
    serverSelectionTimeoutMS: 5000
});

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", () => {
    console.log("Error connecting to MongoDB");
});

module.exports = mongoose;