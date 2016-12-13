angular.module("chat").controller("ChatController", ChatController);
const audioM = new Audio("../../audio/click.mp3");
const audioC = new Audio("../../audio/connected.mp3");
const audioDc = new Audio("../../audio/disconnected.mp3");

function ChatController($http, $window, jwtHelper, ChatSocket, $scope, $location) {
    let vm = this;
    let token = $window.sessionStorage.token;
    let decodeToken = jwtHelper.decodeToken(token);
    vm.loggedInUser = decodeToken.username;
    vm.users = [];
    vm.userCount = 0;

    // MESSAGE RELATED STUFF

    //get all messages on page load
    $http.get("/api/messages").then(function (response) {
        //console.log(response);
        vm.messages = response.data;
        updateScroll();
    });

    //on messsage submit, inform the server and save the message to db
    vm.addMessage = function () {
        let postData = {
            username: vm.loggedInUser,
            message: vm.message,
            time: getTimestamp()
        };

        vm.message = null; //clear message input

        ChatSocket.emit("message", postData);

        console.log(postData);
        $http.post("/api/messages", postData).then(function successCallback() {
            console.log("success");
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    //message comes back from server -> push the message to the list for all users
    ChatSocket.on("message", function (msg) {
        $scope.$apply(function () {
            vm.messages.push(msg);
            audioM.play();
            updateScroll();
        });
    });

    //scrolls to bottom of the chat div
    function updateScroll() {
        setTimeout(function () {
            let element = document.getElementById("chatbox");
            element.scrollTop = element.scrollHeight;
        }, 20);
    }

    function getTimestamp() {
        let time = new Date();
        return ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + ":" + ("0" + time.getSeconds()).slice(-2);
    }


    //USER RELATED STUFF
    vm.disconnect = function () {

    };

    ChatSocket.emit("user connection", vm.loggedInUser);

    ChatSocket.on("user connection", function (users, connectCounter) {
        $scope.$apply(function () {
            audioC.play();
            vm.users = users;
            console.log(vm.users);
            vm.userCount = connectCounter;
        });
    });

    ChatSocket.on("user disconnection", function (users, connectCounter) {
        $scope.$apply(function () {
            audioDc.play();
            vm.users = users;
            vm.userCount = connectCounter;

        });
    });

    window.onbeforeunload = function (e) {
        ChatSocket.emit("user disconnection", vm.loggedInUser);
        $http.post("/api/users/logout",{username: vm.loggedInUser}); //NOT WORKINGg
    };

    //TV RELATED STUFF
    vm.skipCount = 0;
    vm.videoCount = 0;
    let userHasSkipped = false;

    vm.queueVideo = function () {
        let videoId = vm.videoId;
        ChatSocket.emit("videoToQueue", videoId);
        vm.videoId = null;
    };

    vm.skip = function () {
        if (!userHasSkipped) {
            vm.skipCount++;
            ChatSocket.emit("skip");
            userHasSkipped = true;
        }

    };

    ChatSocket.on("next video", function (videoId, skipCount, videosOnQueue, videoCount) {
        vm.videoCount = videoCount;
        if (videosOnQueue) {
            player.loadVideoById(videoId, "large");
            vm.skipCount = skipCount;
            userHasSkipped = false;
            setTimeout(function () {
                    ChatSocket.emit("next video", player.getDuration());
            }, 1000);
        } else {
            vm.skipCount = skipCount;
            player.loadVideoById(videoId, "large");
        }

    });

    ChatSocket.on("skip", function (skipCount) {
        vm.skipCount = skipCount;
    });


}