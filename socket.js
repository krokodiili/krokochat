const socketio = require("socket.io");

let tvCount = 0;
let videoQueue = [];
let users = [];
let connectCount = users.length;
let skipCount = 0;
let counter = 1;
let videoCount = 0;
let timer = null;
let currentVideoTime = 0;
let currentVideo = "PxWYNqeWqyY";

module.exports.listen = function (http) {
//connection
    io = socketio.listen(http);

    io.on("connection", function (socket) {
        socket.on("user connection", function (user) {
            console.log(user + " has connected");
            users.push({name: user});
            connectCount = users.length;
            io.emit("user connection", users, connectCount, tvCount);
        });

        socket.on("user disconnection", function (dcUser) {
            console.log(dcUser + " disconnected");
            for (let i = 0; i < users.length; i++) {
                console.log(users[i].name);
                if (users[i].name === dcUser) {
                    users.splice(i, 1);
                    connectCount = users.length;
                    tvCount--;
                    io.emit("user disconnection", users, connectCount, tvCount);
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
            console.log("new video to queue");
            videoCount++;
            if (videoQueue.length < 1) {
                videoCount--;
                currentVideoTime = 0;
                currentVideo = videoId;
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
            console.log("skip!");
            skipCount++;
            if (skipCount / tvCount > 0.65) {
                clearTimeout(timer);
                nextVideo();
                currentVideoTime = 0;
            } else {
                io.emit("skip", skipCount);
            }
        });

        socket.on("tvOff", function () {
           tvCount--;
           io.emit("tvOff", tvCount);
        });

        socket.on("tvOn", function () {
           tvCount++;
            io.emit("tvOn", tvCount, currentVideoTime, currentVideo);
        });

    });

    let nextVideo = function() {
            videoQueue.splice(0, 1);
            currentVideo = videoQueue[0];
            skipCount = 0;
            console.log(videoQueue + "!!!!!!");
            if (videoQueue.length < 1) {
                io.emit("next video", "PxWYNqeWqyY", skipCount, false, videoCount);
                currentVideoTime = 0;
                counter = 1;
            } else {
                videoCount--;
                io.emit("next video", videoQueue[0], skipCount, true, videoCount);
                currentVideoTime = 0;
                counter = 1;
            }
    };

    setInterval(function () {
       currentVideoTime++;
    }, 1000)

};
