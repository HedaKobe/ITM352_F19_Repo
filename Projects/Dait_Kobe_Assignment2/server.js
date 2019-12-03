// Author: Kobe Dait
// File Description: Server-side Processing

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
// Post sourced from Shane Shimizu
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
    response.redirect("./login_display.html?" + qString); // Send back to login page with qString
});


// Taken from Lab 14
// Post sourced from Shane Shimizu
// Processes register page
app.post("/register_form", function (request, response) {
    var qString = queryString.stringify(request.query); // String query together
    // Assigns textbox inputs to values
    regInputUser = request.body.username.toLowerCase(); // Assigns the username to lower case for unique names
    regInputFullname = request.body.fullname;
    regInputPassword = request.body.password;
    regInputRepPassword = request.body.repeat_password;
    regInputEmail = request.body.email;
    email = request.body.email.toLowerCase();

    if (regInputFullname.length > 30) { // If full name is over 30 characters
        fullnameErrorReg = '<font color="red">Full Name must be 30 characters or less</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (!(/^[A-Za-z ]+$/.test(regInputFullname))) { // Regular expression; else if the fullname does not equal letters only, source: https://www.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html
        fullnameErrorReg = '<font color="red">Full Name must be letters only</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else { // Else there are no errors
        fullnameErrorReg = ''; // No errors are stored in the variable
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    if (regInputPassword.length < 6) { //if password the user enters is less than 6 characters
        passwordErrorReg = '<font color="red">Password must be at least six characters</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (regInputRepPassword != regInputPassword) { // Else if the repeat password does not match the password enterd from the user
        passwordErrorReg = '<font color="red">Password DOES NOT Match</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else { // Else there are no errors
        passwordErrorReg = ''; // No errors are stored in the variable
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    if (typeof users_reg_data[regInputUser] != 'undefined') { // Check if the username is already taken
        usernameErrorReg = '<font color="red">User already registered</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (!(/^[a-zA-Z0-9]+$/.test(regInputUser))) { // If the username does not equal letters and numbers only, source: https://www.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html
        usernameErrorReg = '<font color="red">Username must be characters and numbers only</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (regInputUser.length > 10) { // If the username is greater than 10 characters long
        usernameErrorReg = useLong = '<font color="red">Username must be ten characters or less</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (regInputUser.length < 4) { // If the username is less than 4 characters long
        usernameErrorReg = '<font color="red">Username must be at least four characters</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else { // Else there are no errors
        usernameErrorReg = ''; // No errors are stored in the variable
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    if (!(/^[a-zA-Z0-9._]+@[a-zA-Z.]+\.[a-zA-Z]{2,3}$/.test(regInputEmail))) { // follows X@Y.Z format; address which can only contain letters, numbers, and the characters “_” and “.”; Y is the host machine which can contain only letters and numbers and “.” characters; Z is the domain name which is either 2 or 3 letters such as “edu” or “tv”
        emailErrorReg = '<font color="red">Email is invalid</font>'; // Assigns error to html to be displayed
        regIncorrectFullName = regInputFullname; // Stores stick input into a variable
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else { // Else there are no errors
        emailErrorReg = ''; // No errors are stored in the variable
        regIncorrectFullName = regInputFullname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    // If there are no errors stored in each error variable, user is stored in users_reg_data object
    if (fullnameErrorReg == '' && passwordErrorReg == '' && usernameErrorReg == '' && emailErrorReg == '') {
        users_reg_data[regInputUser] = {}; // New user becomes new property of users_reg_data object
        users_reg_data[regInputUser].name = request.body.fullname; // Name entered is stored in users_reg_data object
        users_reg_data[regInputUser].password = request.body.password; // Password entered is stored in users_reg_data object
        users_reg_data[regInputUser].email = request.body.email; // Email entered is stored in users_reg_data object
        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); // Strings data into JSON for users_reg_data

        // Puts variables into query
        request.query.stickFullname = regInputFullname;
        request.query.stickEmail = regInputEmail;
        request.query.stickUsername = regInputUser;
        qString = queryString.stringify(request.query); // String query together
        response.redirect("./invoice_display.html?" + qString); // Send to invoice page with query

        console.log(request.body);
    }
    // Retrieve variables and puts them into query; for displaying errors on page
    request.query.RegFullnameError = fullnameErrorReg;
    request.query.RegPasswordError = passwordErrorReg;
    request.query.RegUsernameError = usernameErrorReg;
    request.query.RegEmailError = emailErrorReg;
    
    // Retrieve variables and puts them into query; for sticking user input
    request.query.stickRegFullname = regIncorrectFullName;
    request.query.stickUsername = regIncorrectUsername;
    request.query.stickEmail = regIncorrectEmail;

    qString = queryString.stringify(request.query); // String query together
    response.redirect("./register_display.html?" + qString); // Send to register page with query
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));