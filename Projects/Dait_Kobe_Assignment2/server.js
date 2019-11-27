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

app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response);
});
app.post("/login_form", function (request, response) {
    login_form(request.body, response); // Here is where you pass request.body which will be saves in POST inside the function
});

// Function used to check for valid quantities
function isNonNegInt(q, returnErrors = false) {
    error = ''; // assume no errors at first
    if (q == "") {
        q = 0;
    }
    if (Number(q) != q) error = 'Not a number!'; // Check if string is a number value
    if (q < 0) error = 'Negative value!'; // Check if it is non-negative
    if (parseInt(q) != q) error = 'Not an integer!'; // Check that it is an integer
    return returnErrors ? error : (error.length == 0);
}

// Taken from Lab 14
// Function to redirect to login page if true
function process_quantity_form(POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        // Check if the quantities are valid, if so, send to the login, if not, give an error
        var qString = queryString.stringify(POST);
        var errors = {};
        for (i in products) {
            let q = POST[`quantity${i}`];
            if (isNonNegInt(q) == true) {
                errors[`quantityError${i}`] = isNonNegInt(q, true);
                console.log(isNonNegInt(q, true));

            }
        }
        console.log(errors.keys);
        if (typeof errors == 'undefined') {
            response.redirect('login_display.html?' + qString); // Redirects to Login page if it passes through function
        } else {
            qString = qString + "&" + queryString.stringify(errors);
            response.redirect('products_display.html?' + qString); // Redirects back to products page if it fails
        }




    }
}

// Taken from Lab 14
// Checks if JSON string already exists
if (fs.existsSync(user_data)) {
    userid = fs.readFileSync(user_data, 'utf-8');

    stats = fs.statSync(user_data)
    console.log(user_data + ' has ' + stats.size + ' characters');

    reg_user_data = JSON.parse(userid); // Takes a string and converts it into object or array

    fs.writeFileSync(user_data, JSON.stringify(reg_user_data));

    console.log(reg_user_data);
} else {
    console.log(user_data + ' does not exist!');
}

// Function to redirect to invoice page if true
function login_form(POST, response) {
    if (typeof POST['login_submit_button'] != 'undefined') {
        // Checks if username already exists
        reg_user_data = JSON.parse(userid); // Takes a string and converts it into object or array


        the_username = POST.username; // request.body is now passed in the function call as POST
        if (typeof reg_user_data[the_username] != 'undefined') {
            if (reg_user_data[the_username].password == POST.password) {
                qString = queryString.stringify(POST);
                response.redirect('invoice_display.html?' + qString); // Redirects to Invoice page
            } else {
                response.redirect('login_display.html?' + qString); // Redirects to Login page
            }
        }
    }
}

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));
