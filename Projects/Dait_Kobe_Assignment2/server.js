// All the code below came from Lab 13 and is modified to my liking

var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products;
const queryString = require("querystring");
var filename = 'user_data.json';

var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); // Server-side processing

// Taken from Lab 14
// Function used to check for valid quantities
function isNonNegInt(q, returnErrors = false) {
    error = ''; //  assume no errors at first
    if (q == "") q = 0; //  Adds a 0 if no values are added
    if (Number(q) != q) error = 'Not a number!'; //  Check if string is a number value
    if (q < 0) error = 'Negative value!'; //  Check if it is non-negative
    if (parseInt(q) != q) error = 'Not an integer!'; //  Check that it is an integer
    return returnErrors ? error : (error.length == 0); //  Returns any errors
}

// Taken from Lab 14
// Checks if JSON string already exists
if (fs.existsSync(filename)) {
    userid = fs.readFileSync(filename, 'utf-8');

    users_reg_data = JSON.parse(userid); //  Takes a string and converts it into object or array

    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!');
}

// Taken from Lab 14
// Processes products page
app.post("/process_form", function (request, response) {
    let POST = request.body;
    console.log(POST); // Checks in console
    var hasValidQuantities = true; // Defines hasValidQuantities as true from the start
    var hasPurchases = false; // Defines hasPurhchases as false from the start
    for (i = 0; i < products.length; i++) { // For loop to check each quantity 
        q = POST['quantity' + i]; // Defines q as each variable in the array
        if (isNonNegInt(q) == false) { // If the quantity is an invalid integer
            hasValidQuantities = false; // hasValidQuantities is false
        }
        if (q > 0) { // If quantity enter is greater than 0
            hasPurchases = true; // hasPurchases is true
        }
    }
    // If data is valid give user an invoice, if not give them an error
    var qString = queryString.stringify(POST); // Strings query together
    console.log(qString); // Checks in console
    if (hasValidQuantities == true && hasPurchases == true) { // If both are valid
        response.redirect('./login_display.html?' + qString); // Send to login page with query
    }
    else {
        response.redirect("./products_display.html?" + qString); // Send back to products page with query
    }
});

// Taken from Lab 14
// Processes login page
app.post("/login_form", function (request, response) {
    console.log(request.body); // Checks in console
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
            response.redirect("./invoice_display.html?" + qString); // Send to invoice page with query   
        } else if (users_reg_data[the_username].password != request.body.password) { // Else if password does not match username in user database
            error = '<font color="red">Incorrect Password</font>'; // Assigns error to html to be displayed
            stickInput = inputUser; // Assigns inputted username to a sticky variable
        }
    } else {
        error = the_username + "<style=word-spacing: 5px>: </style>" + "<font color='red'>is not registered</font>"; // Assigns error to html to be displayed
        stickInput = inputUser; // Assigns inputted username to a sticky variable
    }
    // Puts variables into query
    request.query.LoginError = error;
    request.query.logStickInput = stickInput;
    qString = queryString.stringify(request.query); // String query together
    response.redirect("./login_display.html?" + qString); // Send back to login page with qString
});


// Taken from Lab 14
// Processes register page
app.post("/register_form", function (request, response) { // Runs the functions
    // Validates registration data

    // All good so save the new user
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].fname = request.body.fname;
    users_reg_data[username].lname = request.body.lname;
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    console.log(username);
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));
