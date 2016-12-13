const mongoose = require("mongoose");


var msgSchema = new mongoose.Schema({
    username: {
        type: String
    },
    message: {
        type: String
    },
    time: {
        type: String
    }
});

mongoose.model("Message", msgSchema, "messages");

