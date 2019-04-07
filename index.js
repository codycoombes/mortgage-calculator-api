// index.js for mortgage-calculator-api 
// Created on April 4
// Author: Cody Coombes

var express = require('express');
var tools = require('./tools');
var body_parser = require("body-parser");
var server;
var interest_rate = 0.025;
var app = express();

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended: true}))

// Get the recurring payment amount of a mortgage
// Accepts and returns JSON
// Must have all the fields or returns error
// Example JSON input: {"asking_price": 700000, "down_payment": 200000, "payment_schedule": "weekly", "amortization_period": 10}
//
// PARAMS:
// asking_price: Asking price in dollars
// down_payment: Must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k mortgage)
// payment_schedule: Weekly, biweekly, monthly
// amortization_period: Min 5 years, max 25 years
// RETURN: Recurring payment amount of a mortgage in JSON format
app.get('/payment-amount', (req, res) => {

    // Validate the input and error check
    var errors = tools.validatePayment(req.body);

    if (errors.length) {
        return res.send(tools.errorHandler(errors, 400))
    }

    else {

        var asking_price = req.body.asking_price;
        var down_payment = req.body.down_payment;
        var payment_schedule = req.body.payment_schedule.toLowerCase();
        var amortization_period = req.body.amortization_period;
    	
        var payment = tools.paymentCalculator(asking_price, down_payment, payment_schedule, amortization_period, interest_rate);
        
        if (payment !== -1) {
            res.json(
            {
                payment_amount : payment,
                payment_schedule: payment_schedule,
                status : 200,
                timestamp : parseInt(Date.now())
            });
        }

        else {
            errors = "Down payment must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k mortgage)";
            return res.send(tools.errorHandler(errors, 400))
        }
    }

});

// Get the maximum mortgage amount
// Accepts and returns JSON
// Must have all the fields or returns error (except for down_payment which is optional)
// Example JSON input: {"payment_amount": 700000, "down_payment": 200000, "payment_schedule": "weekly", "amortization_period": 10}
//
// PARAMS:
// payment_amount: The reoccurring payment amount
// down_payment: Must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k mortgage)
// payment_schedule: Weekly, biweekly, monthly
// amortization_period: Min 5 years, max 25 years
// RETURN: Maximum mortgage that can be taken out
app.get('/mortgage-amount', (req, res) => {
	 // Validate the input and error check
    var errors = tools.validateMortgage(req.body);

    if (errors.length) {
        return res.send(tools.errorHandler(errors, 400))
    }

    else {

        var payment_amount = req.body.payment_amount;
        var down_payment = req.body.down_payment;
        var payment_schedule = req.body.payment_schedule.toLowerCase();
        var amortization_period = req.body.amortization_period;
        
        var maximum_mortgage = tools.maxMortgage(payment_amount, down_payment, payment_schedule, amortization_period, interest_rate);
        
        if (maximum_mortgage !== -1) {
            res.json(
            {
                maxmium_mortgage : maximum_mortgage,
                status : 200,
                timestamp : parseInt(Date.now())
            });
        }

        else {
            errors = "Down payment must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k mortgage)";
            return res.send(tools.errorHandler(errors, 400))
        }
    }
});

// Change the interest rate (%) used by the application
// Accepts and returns JSON
// Example JSON input: {"interest_rate": 5}
// PARAMS:
// interest_rate: the new interest rate (from 0 to 100)
// RETURN: the old and new interest rate
app.patch('/interest-rate', (req, res) => {

	var old_interest_rate = interest_rate * 100;
    interest_rate = req.body.interest_rate / 100;
    var new_interest_rate = interest_rate * 100;

    // Return JSON object if valid otherwise return error message
    if (typeof interest_rate === "number" && interest_rate >= 0 && interest_rate <= 100) {
    	res.json(
        {
            old_interest_rate: old_interest_rate,
            new_interest_rate: new_interest_rate,
            status: 200,
            timestamp: parseInt(Date.now())
        });
    }

    else {
        var error = "Interest rate must be ";
        return res.send(tools.errorHandler(error, 400));
    }
});


server = app.listen(3000, function () {
    console.log("API running on port ", server.address().port);
});