const socketio = require("socket.io");

let videoQueue = [];
let users = [];
let connectCount = 0;
let skipCount = 0;
let counter = 1;
let videoCount = 0;
let timer = null;

module.exports.listen = function (http) {
//connection
    io = socketio.listen(http);

    io.on("connection", function (socket) {
        connectCount++;
        socket.on("user connection", function (user) {
            console.log(user + " has connected");
            users.push({name: user});
            io.emit("user connection", users, connectCount);
        });

        socket.on("user disconnection", function (dcUser) {
            console.log(dcUser + " disconnected");
            for (let i = 0; i < users.length; i++) {
                console.log(users[i].name);
                if (users[i].name === dcUser) {
                    users.splice(i, 1);
                    connectCount--;
                    io.emit("user disconnection", users, connectCount);
                }
            }
        });
//message
        socket.on("message", function (msg) {
            console.log(msg);
            io.emit("message", msg);
        });
//video
        socket.on("videoToQueue", function (videoId) {
            videoCount++;
            if (videoQueue.length < 1) {
                videoCount--;
                io.emit("next video", videoId, 0, true, videoCount);
            }
            videoQueue.push(videoId);
        });

        socket.on("next video", function (duration) {
            if (counter < connectCount) {
                counter++;
            } else {
                timer = setTimeout(nextVideo, duration * 1000);
                console.log(duration);
            }

        });

        socket.on("skip", function () {
            skipCount++;
            if (skipCount / connectCount > 0.65) {
                clearTimeout(timer);
                nextVideo();
            } else {
                io.emit("skip", skipCount);
            }
        });

    });

    let nextVideo = function() {
            videoQueue.splice(0, 1);
            skipCount = 0;
            console.log(videoQueue + "!!!!!!");
            if (videoQueue.length < 1) {
                io.emit("next video", "DCoY5ot8zg4", skipCount, false, videoCount);
                counter = 1;
            } else {
                videoCount--;
                io.emit("next video", videoQueue[0], skipCount, true, videoCount);
                counter = 1;
            }
    }

};
