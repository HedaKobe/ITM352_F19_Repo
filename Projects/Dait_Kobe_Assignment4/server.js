// Author: Kobe Dait
// File Description: Server-side Processing

// Requiring a lot of different packages and files
var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var stuff = require('./public/questions.js');
var questions = stuff.questions;
const queryString = require("querystring");
var filename = 'user_data.json';
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); // Server-side processing

// Taken from Lab 14
// Checks if JSON string already exists
if (fs.existsSync(filename)) { // If user data exists
    data = fs.readFileSync(filename, 'utf-8'); // Read the data into 'data' variable

    users_reg_data = JSON.parse(data); //  Takes a string and converts it into object or array

    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!');
}



// Taken from Lab 14
// Post sourced from Shane Shimizu
// Processes login page
app.post("/login_form", function (request, response) {
    var qString = queryString.stringify(request.query); // String query together
    // Assigns textbox inputs to values
    inputUser = request.body.username;
    inputPass = request.body.password;
    the_username = request.body.username.toLowerCase(); // Assigns inputted username and is case-insensitive

    // Redirect to invoice page if true, else back to login page
    if (typeof users_reg_data[the_username] != 'undefined') { // Checks if username exists in user database
        if (users_reg_data[the_username].password == request.body.password) { // If password matches with username in user database
            // Assigns the username, email, and fullname into variables
            loginFullname = users_reg_data[the_username].name;
            loginEmail = users_reg_data[the_username].email;
            loginUserName = request.body.username;
            // Puts variables into query
            request.query.stickFullname = loginFullname;
            request.query.stickEmail = loginEmail;
            request.query.stickUsername = loginUserName;
            qString = queryString.stringify(request.query); // Strings query together
            response.redirect("./manager.html?" + qString); // Send to invoice page with query   
        } else if (users_reg_data[the_username].password != request.body.password) { // Else if password does not match username in user database
            error = '<font color="red">Incorrect Password</font>'; // Assigns error to html to be displayed
            stickInput = inputUser; // Assigns inputted username to a sticky variable
            // Puts variables into query
            request.query.LoginError = error;
            request.query.logStickInput = stickInput;
        }
    } else {
        error = "<font color='red'>Invalid Username: </font>" + the_username; // Assigns error to html to be displayed
        stickInput = inputUser; // Assigns inputted username to a sticky variable
        // Puts variables into query
        request.query.LoginError = error;
        request.query.logStickInput = stickInput;
    }
    qString = queryString.stringify(request.query); // String query together
    response.redirect("./index.html?" + qString); // Send back to login page with qString
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));