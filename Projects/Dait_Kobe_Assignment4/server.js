// Author: Kobe Dait
// File Description: Server-side Processing

// Requiring a lot of different packages and files
var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
const queryString = require("querystring");
var adminfile = 'admin_data.json';
var customerfile = 'customer_data.json';
var moment = require("moment");
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
if (fs.existsSync(adminfile)) { // If user data exists
    data = fs.readFileSync(adminfile, 'utf-8'); // Read the data into 'data' variable

    admin_data = JSON.parse(data); //  Takes a string and converts it into object or array

    console.log(admin_data);
} else {
    console.log(adminfile + ' does not exist!');
}

// Taken from Lab 14
// Checks if JSON string already exists
if (fs.existsSync(customerfile)) { // If user data exists
    data = fs.readFileSync(customerfile, 'utf-8'); // Read the data into 'data' variable

    customer_data = JSON.parse(data); //  Takes a string and converts it into object or array

    console.log(customer_data);
} else {
    console.log(customerfile + ' does not exist!');
}

// Taken from Lab 14
// Post sourced from Shane Shimizu
// Processes login page
app.post("/admin_login", function (request, response) {
    var qString = queryString.stringify(request.query); // String query together
    // Assigns textbox inputs to values
    inputPass = request.body.password;
    the_username = request.body.username.toLowerCase(); // Assigns inputted username and is case-insensitive

    // Redirect to invoice page if true, else back to login page
    if (typeof admin_data[the_username] != 'undefined') { // Checks if username exists in user database
        if (admin_data[the_username].password == request.body.password) { // If password matches with username in user database
            response.redirect("./manager.html?" + qString); // Send to invoice page with query   
        } else if (admin_data[the_username].password != request.body.password) { // Else if password does not match username in user database
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
    response.redirect("./admin_login.html?" + qString); // Send back to login page with qString
});

// Taken from Lab 14
// Post sourced from Shane Shimizu
// Processes login page
app.post("/customer_login", function (request, response) {
    console.log(request.body); // Checks in console
    var qString = queryString.stringify(request.query); // String query together
    // Assigns textbox inputs to values
    inputUser = request.body.username;
    inputPass = request.body.password;
    the_username = request.body.username.toLowerCase(); // Assigns inputted username and is case-insensitive

    // Redirect to invoice page if true, else back to login page
    if (typeof customer_data[the_username] != 'undefined') { // Checks if username exists in user database
        if (customer_data[the_username].password == request.body.password) { // If password matches with username in user database
            // Assigns the username, email, and fullname into variables
            loginFirstname = customer_data[the_username].firstname;
            loginLastname = customer_data[the_username].lastname;
            loginEmail = customer_data[the_username].email;
            loginUserName = request.body.username;
            // Puts variables into query
            request.query.stickFirstname = loginFirstname;
            request.query.stickLastname = loginLastname;
            request.query.stickEmail = loginEmail;
            request.query.stickUsername = loginUserName;
            qString = queryString.stringify(request.query); // Strings query together
            response.redirect("./invoice_display.html?" + qString); // Send to invoice page with query   
        } else if (customer_data[the_username].password != request.body.password) { // Else if password does not match username in user database
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
    response.redirect("./customer_login.html?" + qString); // Send back to login page with qString
});


var today = moment().format('YYYY/MM/D hh:mm:ss SSS');
console.log(today);


// Taken from Lab 14
// Post sourced from Shane Shimizu
// Processes register page
app.post("/customer_register", function (request, response) {
    var qString = queryString.stringify(request.query); // String query together
    // Assigns textbox inputs to values
    regInputUser = request.body.username.toLowerCase(); // Assigns the username to lower case for unique names
    regInputFirstname = request.body.firstname;
    regInputLastname = request.body.lastname;
    regInputPassword = request.body.password;
    regInputRepPassword = request.body.repeat_password;
    regInputEmail = request.body.email;
    regInputBirthday = request.body.birthday;
    email = request.body.email.toLowerCase();
    var today = Date(Date.now);
    today = today.toString();

    if (regInputFirstname.length > 30) { // If first name is over 30 characters
        firstnameErrorReg = '<font color="red">First Name must be 30 characters or less</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else if (!(/^[A-Za-z ]+$/.test(regInputFirstname))) { // Regular expression; else if the firstname does not equal letters only, source: https://www.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html
        firstnameErrorReg = '<font color="red">First Name must be letters only</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else { // Else there are no errors
        firstnameErrorReg = ''; // No errors are stored in the variable
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    }

    if (regInputLastname.length > 30) { // If first name is over 30 characters
        lastnameErrorReg = '<font color="red">Last Name must be 30 characters or less</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else if (!(/^[A-Za-z ]+$/.test(regInputLastname))) { // Regular expression; else if the firstname does not equal letters only, source: https://www.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html
        lastnameErrorReg = '<font color="red">Last Name must be letters only</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else { // Else there are no errors
        lastnameErrorReg = ''; // No errors are stored in the variable
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    }

    if (typeof customer_data[regInputUser] != 'undefined') { // Check if the username is already taken
        usernameErrorReg = '<font color="red">User already registered</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else if (!(/^[a-zA-Z0-9]+$/.test(regInputUser))) { // If the username does not equal letters and numbers only, source: https://www.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html
        usernameErrorReg = '<font color="red">Username must be characters and numbers only</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else if (regInputUser.length > 10) { // If the username is greater than 10 characters long
        usernameErrorReg = useLong = '<font color="red">Username must be ten characters or less</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else if (regInputUser.length < 4) { // If the username is less than 4 characters long
        usernameErrorReg = '<font color="red">Username must be at least four characters</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else { // Else there are no errors
        usernameErrorReg = ''; // No errors are stored in the variable
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    }

    if (regInputPassword.length < 6) { // If password the user enters is less than 6 characters
        passwordErrorReg = '<font color="red">Password must be at least six characters</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else if (regInputRepPassword != regInputPassword) { // Else if the repeat password does not match the password enterd from the user
        passwordErrorReg = '<font color="red">Password DOES NOT Match</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else { // Else there are no errors
        passwordErrorReg = ''; // No errors are stored in the variable
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    }

    if (!(/^[a-zA-Z0-9._]+@[a-zA-Z.]+\.[a-zA-Z]{2,3}$/.test(regInputEmail))) { // follows X@Y.Z format; address which can only contain letters, numbers, and the characters “_” and “.”; Y is the host machine which can contain only letters and numbers and “.” characters; Z is the domain name which is either 2 or 3 letters such as “edu” or “tv”
        emailErrorReg = '<font color="red">Email is invalid</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else { // Else there are no errors
        emailErrorReg = ''; // No errors are stored in the variable
        regIncorrectFirstName = regInputFirstname;
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    }

    if (regInputBirthday > today) { // If the date is past today's date
        birthdayErrorReg = '<font color="red">Birthday date must be before today</font>'; // Assigns error to html to be displayed
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    } else { // Else there are no errors
        birthdayErrorReg = ''; // No errors are stored in the variable
        regIncorrectFirstName = regInputFirstname; // Stores stick input into a variable
        regIncorrectLastName = regInputLastname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
        regIncorrectBirthday = regInputBirthday;
    }

    // If there are no errors stored in each error variable, user is stored in customer_data object
    if (firstnameErrorReg == '' && lastnameErrorReg == '' && passwordErrorReg == '' && usernameErrorReg == '' && emailErrorReg == '' && birthdayErrorReg == '') {
        customer_data[regInputUser] = {}; // New user becomes new property of customer_data object
        customer_data[regInputUser].firstname = request.body.firstname; // Name entered is stored in customer_data object
        customer_data[regInputUser].lastname = request.body.lastname; // Name entered is stored in customer_data object
        customer_data[regInputUser].password = request.body.password; // Password entered is stored in customer_data object
        customer_data[regInputUser].email = request.body.email; // Email entered is stored in customer_data object
        customer_data[regInputUser].birthday = request.body.birthday; // Birthday entered is stored into customer_data object
        fs.writeFileSync(customerfile, JSON.stringify(customer_data)); // Strings data into JSON for customer_data

        // Puts variables into query
        request.query.stickFirstname = regInputFirstname;
        request.query.stickLastname = regInputLastname;
        request.query.stickEmail = regInputEmail;
        request.query.stickUsername = regInputUser;
        request.query.stickBirthday = regInputBirthday;
        qString = queryString.stringify(request.query); // String query together
        response.redirect("./loyalty.html?" + qString); // Send to invoice page with query

        console.log(request.body);
    }
    // Retrieve variables and puts them into query; for displaying errors on page
    request.query.RegFirstnameError = firstnameErrorReg;
    request.query.RegLastnameError = lastnameErrorReg;
    request.query.RegPasswordError = passwordErrorReg;
    request.query.RegUsernameError = usernameErrorReg;
    request.query.RegEmailError = emailErrorReg;
    request.query.RegBirthdayError = birthdayErrorReg;

    // Retrieve variables and puts them into query; for sticking user input
    request.query.stickRegFirstname = regIncorrectFirstName;
    request.query.stickRegLastname = regIncorrectLastName;
    request.query.stickUsername = regIncorrectUsername;
    request.query.stickEmail = regIncorrectEmail;
    request.query.stickBirthday = regIncorrectBirthday;

    qString = queryString.stringify(request.query); // String query together
    response.redirect("./register.html?" + qString); // Send to register page with query
});


app.post("/database", function (request, response) {

});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));