//All the code below came from Lab 13 and is modified to my liking

var express = require('express'); //Calls the express package
var myParser = require("body-parser"); //Calls the package-lock.json
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products;
var queryString = require("querystring");
var user_data = 'user_data.json';

var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); //Server-side processing
// Runs the function process_quantity_form
app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response);
});
// Runs the function login form
app.post("/login_form", function (request, response) {
    process_login_form(request, response); // Here is where you pass request.body which will be saves in POST inside the function
});
// Runs the function process_register_form
app.post("/register_form", function (request, response) {
    process_purchase_form(request, response);
});

// Taken from Lab 14
// Function used to check for valid quantities
function isNonNegInt(q, returnErrors = false) {
    error = ''; // assume no errors at first
    if (q == "") { // Adds a 0 if no values are added
        q = 0;
    }
    if (Number(q) != q) error = 'Not a number!'; // Check if string is a number value
    if (q < 0) error = 'Negative value!'; // Check if it is non-negative
    if (parseInt(q) != q) error = 'Not an integer!'; // Check that it is an integer
    return returnErrors ? error : (error.length == 0);
}

// Function to redirect to login page if true
function process_quantity_form(POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        // Check if the quantities are valid
        var qString = queryString.stringify(POST);
        var errors = {}; // assume no errors at first
        // For loop checks each quantity
        for (i in products) {
            let q = POST[`quantity${i}`];
            if (isNonNegInt(q) == false) {
                errors[`quantityError${i}`] = isNonNegInt(q, true);
                console.log(isNonNegInt(q, true));

            }
        }
        console.log(errors);
        // If there are no errors, redirect to login, otherwise send to products page
        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            response.redirect('login_display.html?' + qString); // Redirects to Login page if it passes through function
        } else {
            qString = qString + "&" + queryString.stringify(errors);
            response.redirect('products_display.html?' + qString); // Redirects back to products page if it fails
            // Display erros on products display
        }
    }
}

// Taken from Lab 14
// Checks if JSON string already exists
if (fs.existsSync(user_data)) {
    userid = fs.readFileSync(user_data, 'utf-8');

    reg_user_data = JSON.parse(userid); // Takes a string and converts it into object or array

    console.log(reg_user_data);
} else {
    console.log(user_data + ' does not exist!');
}

// Function to redirect to invoice page if true
function process_login_form(request, response) {
    error = '';
    var qString = queryString.stringify(request.query);
    if (typeof request.body['login_submit_button'] != 'undefined') {
        // Checks if username already exists
        the_username = request.body.username; // request.body is now passed in the function call as POST
        if (typeof reg_user_data[the_username] != 'undefined') {
            if (reg_user_data[the_username].password == request.body.password) {
                response.redirect('invoice_display.html?' + qString); // Redirects to Invoice page
                return;
            } else {
                error1 = 'password incorrect';
                console.log(error1);   
            }
        } else {
            error2 = 'username doesnt exist';
            console.log(error2);
        }

    }
    response.redirect('login_display.html?' + qString); // Redirects to Login page
}
function process_purchase_form(request, response) {
    // Validates registration data

    //all good so save the new user
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    fs.writeFileSync(filename, JSON.stringify(users_reg_data));

    console.log(username);
}

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));
