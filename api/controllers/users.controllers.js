const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = function (req, res) {
    console.log("registering user");

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        username: username
    }).exec(function (err, user) {
        if (user) {
            res.status(409).json("Username already in use!");
        } else {
            User.findOne({
                email: email
            }).exec(function (err, user) {
                if (user) {
                    res.status(409).json("Email already in use!");
                } else {
                    User.create({
                        username: username,
                        email: email,
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                    }, function (err, user) {
                        if (err) {
                            console.log(err);
                            res.status(400).json(err);
                        } else {
                            console.log("user created", user);
                            res.status(201).json(user);
                        }
                    });
                }
            });
        }
    });

};

module.exports.login = function (req, res) {
    console.log("logging in user");
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({
        username: username
    }).exec(function (err, user) {
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                var token = jwt.sign({username: user.username}, process.env.SECRET, {expiresIn: 3600});
                user.active = true;
                user.save();
                res.status(200).json({success: true, token: token});
            } else {
                res.status(401).json("Unauthorized");
            }
        } else {
            console.log(err);
            res.status(400).json(err);
        }
    });
};

module.exports.authenticate = function (req, res, next) {
    let headerExists = req.headers.authorization;
    if (headerExists) {
        var token = req.headers.authorization.split(' ')[1]; //--> Authorization Bearer xxx
        jwt.verify(token, "s3cr3t", function (error, decoded) {
            if (error) {
                console.log(error);
                res.status(401).json("Unauthorized");
            } else {
                req.user = decoded.username;
                next();
            }
        });
    } else {
        res.status(403).json("No token provided");
    }
};

module.exports.logout = function (req, res) {
    console.log("logging user out");
    let username = req.body.username;

    User.findOne({
        username: username
    }).exec(function (err, user) {
        if (user) {
            user.active = false;
            user.save();
            console.log("logging out " + user);
        } else {
            console.log("error " + err);
            res.status(400).json(err);
        }
    });
};

