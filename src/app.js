const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.options("*", cors());

app.use(bodyParser.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 100000,
}));
app.use(bodyParser.json());

process.env.TZ = "Asia/Kolkata"; // Set timezone

// MongoDB connection
const url = "mongodb+srv://krajan92945_db_user:ZrDEX9g1HIJhRFQ2@trap2win.cjyqqnu.mongodb.net/trap2win?appName=Trap2win";

const connectDB = async () => {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected successfully to server..');
    } catch (err) {
        console.error('Failed to connect to the database. Error:', err);
        process.exit(1); // Exit process with failure
    }
};

connectDB();

// Load routes
require("./router/Admin.js")(app);
require("./router/Report.js")(app);
require("./router/api.js")(app);

module.exports = app;
