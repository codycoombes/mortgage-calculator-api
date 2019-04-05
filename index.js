// index.js for mortgage-calculator-api 
// By Cody Coombes

var express = require('express');
var tools = require('./tools');
var bodyParser = require("body-parser");
var server;
var interestRate = 0.025;
var app = express();

// Get the recurring payment amount of a mortgage
// GET request format: localhost:3000/payment-amount?json={"askingPrice": 100000. "downPayment": 10000, "paymentSchedule": "biweekly", "amortPeriod": 10}
//
// INPUT:
// askingPrice: Asking price in dollars
// downPayment: Must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k mortgage)
// amortPeriod: Min 5 years, max 25 years
// paymentSchedule: Weekly, biweekly, monthly
//
// RETURN: Recurring payment amount of a mortgage in JSON format
app.get('/payment-amount', (req, res) => {

    // Verify that the parameters are not empty
    if (!req.query) {
        var error = "Input field is empty.";
        return res.send(errorHandler(error, 404));
    }

    // Parse input into JSON object and validate fields
	var jsonObj = JSON.parse(req.query.json);
    var errors = validate(jsonObj);

    if (errors.length) {
        return res.send(errorHandler(errors, 404))
    }

    else {

        var askingPrice = jsonObj.askingPrice;
        var downPayment = jsonObj.downPayment;
        var paymentSchedule = jsonObj.paymentSchedule;
        var amortPeriod = jsonObj.amortPeriod;
    	
        var payment = tools.calculator(askingPrice, downPayment, paymentSchedule, amortPeriod, interestRate);
        
        res.json(
        {
            paymentAmount : payment,
            status : 200,
            timestamp : parseInt(Date.now())
        });
    }

});

// Get the maximum mortgage amount
app.get('/mortgage-amount', (req, res) => {
	return res.send('GET request for mortgage-amount');
});

// Change the interest rate (%) used by the application
// INPUT:
// interestRate: the new interest rate
// RETURN: the old and new interest rate
app.patch('/interest-rate', (req, res) => {
     // Verify that the parameters are not empty
    if (!req.query) {
        var error = "Input field is empty.";
        return res.send(errorHandler(error, 404));
    }

    // Parse input into JSON object
    var jsonObj = JSON.parse(req.query.json);
	var oldinterestRate = interestRate;
    interestRate = jsonObj.interestRate;

    // Return JSON object if valid otherwise return error message
    if (typeof interestRate === "number" && interestRate >= 0) {
    	res.json(
        {
            oldinterestRate: oldinterestRate,
            newinterestRate: interestRate,
            status: 200,
            timestamp: parseInt(Date.now())
        });
    }

    else {
        var error = "Interest Rate is invalid.";
        return res.send(errorHandler(error, 404));
    }
});


// Validate that are no missing parameters and parameters are valid
// INPUT: JSON object
// RETURN: error message
function validate(req) {

    const errors  = [];
    const paymentScheduleTypes = ["weekly", "biweekly", "monthly"];

    // Check if any fields are missing
    if (!req.askingPrice || !req.downPayment || !req.paymentSchedule || !req.amortPeriod ) {
        errors.push("Missing Input Fields.");
    }

    // Check if fields are valid
    else {

        if ((typeof req.askingPrice !== 'number') || req.askingPrice <= 0) {
            errors.push("Invalid Asking Price.");
        }

        if ((typeof req.downPayment !== 'number') || req.downPayment <= 0) {
            errors.push("Invalid Down Payment.");
        }

        if (req.askingPrice < req.downPayment) {
            errors.push("Down Payment Cannot Be Larger Than Asking Price");
        }

        if ((typeof req.paymentSchedule !== 'string') || paymentScheduleTypes.indexOf(req.paymentSchedule.toLowerCase()) <= -1) {
            errors.push("Invalid Payment Schedule (Only Valid Inputs Are: weekly, biweekly, or monthly).");
        }

        if ((typeof req.amortPeriod !== 'number') || req.amortPeriod < 5 || req.amortPeriod > 25) {
            errors.push("Invalid Amortization Period (Minimum is 5 and Maximum is 25).");
        }
    }

    if (errors.length) {
        console.log(errors);
    }

    return errors;
}

var errorHandler = function(msg, status)
{
    var error = new Error();
    error.errorMessage = msg;
    error.status = status;
    return error;
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});