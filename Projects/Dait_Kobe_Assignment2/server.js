//All the code below came from Lab 13 and is modified to my liking

var express = require('express'); //Calls the express package
var myParser = require("body-parser"); //Calls the package-lock.json
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products;
var queryString = require("querystring");
var user_data = './public/user_data.json';

var app = express(); //declaring express() as app
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); //Server-side processing
app.use(express.static('./public'));
app.post("/login_form", function (request, response) {
    login_form(request.body, response);
});
app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response); // Here is where you pass request.body which will be saves in POST inside the function
});

// Function used to check for valid quantities
function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

// Function to redirect to login page if true
function login_form(POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        // Check if the quantities are valid, if so, send to the login, if not, give an error
        var qString = queryString.stringify(POST);
        for (i in products) {
            let q = POST[`quantity${i}`];
            if (isNonNegInt(q) == true) {
                response.redirect('login_display.html?' + qString); // Redirects to Login page if it passes through function
            } else {
                response.redirect('products_display.html?' + qString); // Redirects back to products page if it fails
            }
        }
    }
}

// Function to redirect to invoice page if true
function process_quantity_form(POST, response) { // this function looks like a login process, not quality form process
    if (typeof POST['login_submit_button'] != 'undefined') {
        // Checks if username already exists
        var qString = queryString.stringify(POST);
        the_username = POST.username; // request.body is now passed in the fubction call as POST,
        if (typeof reg_user_data[the_username] != 'undefined') {
            if (reg_user_data[the_username].password == POST.password) { // same issue, POST is request.body
                response.redirect('invoice_display.html?' + qString); // REDIRECT to Invoice page
            } else {
                response.redirect('login_display.html'); //REDIRECT to Login page
            }
        }
    }
}


app.listen(8080, () => console.log(`listening on port 8080`));
