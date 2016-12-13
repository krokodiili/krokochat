const mongoose = require("mongoose");
const dburl = "mongodb://test:testing@ds021026.mlab.com:21026/krokochat";

mongoose.connect(dburl);

mongoose.connection.on("connected", function () {
    console.log("Mongoose connected to " + dburl);
});

mongoose.connection.on("disconnected", function () {
    console.log("Mongoose disconnected" + dburl);
});

mongoose.connection.on("error", function (err) {
    console.log("Mongoose connection error: " + err);
});

// CAPTURE APP TERMINATION / RESTART EVENTS
function gracefulShutdown(msg, callback) {
    mongoose.connection.close(function() {
        console.log("Mongoose disconnected through " + msg);
        callback();
    });
}

// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('App termination (SIGINT)', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('App termination (SIGTERM)', function() {
        process.exit(0);
    });
});

//schemas and models
require("./models/message");
require("./models/user");