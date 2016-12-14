require("./api/data/db.js");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http").Server(app);
const routes = require("./api/routes");
require("./socket.js").listen(http);

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//static files
app.use(express.static("./public"));

app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use("/api", routes);

//set and listen port
http.listen(process.env.PORT || 3000, function () {
    console.log("listening on port 3000");
});






