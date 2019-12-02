//All the code below came from Lab 13 and is modified to my liking

var express = require('express'); //Calls the express package
var myParser = require("body-parser"); //Calls the package-lock.json
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products;
const queryString = require("querystring");
var user_data = 'user_data.json';

var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); //Server-side processing
app.post("/process_form", function (request, response) { // Runs the function quantity form
    process_quantity_form(request.body, response);
});
app.post("/login_form", function (request, response) { // Runs the function login form
    process_login_form(request, response);
});
app.post("/register_form", function (request, response) { // Runs the function register form
    process_register_form(request, response);
});

// Taken from Lab 14
// Function used to check for valid quantities
function isNonNegInt(q, returnErrors = false) {
    error = ''; // assume no errors at first
    if (q == "") q = 0; // Adds a 0 if no values are added
    if (Number(q) != q) error = 'Not a number!'; // Check if string is a number value
    if (q < 0) error = 'Negative value!'; // Check if it is non-negative
    if (parseInt(q) != q) error = 'Not an integer!'; // Check that it is an integer
    return returnErrors ? error : (error.length == 0); // Returns any errors
}

// 
// Function to redirect to login page if true
function process_quantity_form(POST, response) {
    var hasValidQuantities = true; //defining the hasValidQuantities variable and assuming all quantities are valid
    var hasPurchases = false; //assume the quantity of purchases are false
    for (i = 0; i < products.length; i++) { //for loop for each product array that increases the count by 1
        q = POST['quantity' + i]; //quantity entered by the user for a product is aessigned into q
        if (isNonNegInt(q) == false) { //if the quantity enetered by the user is invalid integer
            hasValidQuantities = false; //hasValidQuantities is false or nothing was inputed in the quantity textbox
        }
        if (q > 0) { //if quantity entered in the textbox is greater than 0
            hasPurchases = true; //if q is greater than 0 than the hasPurchases is ok
        }
    }
    // if data is valid give user an invoice, if not give them an error
    qString = queryString.stringify(POST); //string query together
    if (hasValidQuantities == true && hasPurchases == true) { //if both hasValidQuantities variable and hasPurchases variable are valid 
        response.redirect('./login_display.html?' + qString); //if quantity is valid it will send user to invoice
    }
    else {
        response.redirect("./products_display.html?" + qString); //if quantity is invalid it will send user back to products page
    }
};

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

function process_register_form(request, response) {
    // Validates registration data

    //all good so save the new user
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].fname = request.body.fname;
    users_reg_data[username].lname = request.body.lname;
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;

    fs.writeFileSync(user_data, JSON.stringify(users_reg_data));

    console.log(username);
}

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));
