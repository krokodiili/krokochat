const mongoose = require("mongoose");
const Message = mongoose.model("Message");


module.exports.getAllMessages = function (req, res) {
    Message
        .find()
        .exec(function(err, messages) {
           console.log(err);
           if (err) {
               console.log("Error finding messages");
               res
                   .status(500)
                   .json(err);
           } else {
               console.log("Found messages", messages.length);
               res
                   .json(messages);
           }
        });

};

module.exports.getOneMessage = function (req, res) {

};

module.exports.addOneMessage = function (req, res) {

    console.log("post new message");

    Message
        .create({
            username : req.body.username,
            message : req.body.message,
            time: req.body.time
        }, function (err, message) {
            if (err) {
                console.log("Error creating message");
                res
                    .status(400)
                    .json(err);
            } else {
                console.log("Message created"), message;
                res
                    .status(201)
                    .json(message);
            }
        });

};
