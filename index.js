// index.js for mortgage-calculator-api 
// By Cody Coombes

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
//
// INPUT:
// askingPrice: Asking price in dollars
// downPayment: Must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k mortgage)
// amortPeriod: Min 5 years, max 25 years
// paymentSchedule: Weekly, biweekly, monthly
//
// RETURN: Recurring payment amount of a mortgage in JSON format
app.get('/payment-amount', (req, res) => {

    // Validate the input and error check
    var errors = tools.validate(req.body);

    if (errors.length) {
        return res.send(tools.errorHandler(errors, 400))
    }

    else {

        var asking_price = req.body.asking_price;
        var down_payment = req.body.down_payment;
        var payment_schedule = req.body.payment_schedule.toLowerCase();
        var amortization_period = req.body.amortization_period;
    	
        var payment = tools.mortgage(asking_price, down_payment, payment_schedule, amortization_period, interest_rate);
        
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
app.get('/mortgage-amount', (req, res) => {
	return res.send('GET request for mortgage-amount');
});

// Change the interest rate (%) used by the application
// INPUT:
// interestRate: the new interest rate (from 0 to 100)
// RETURN: the old and new interest rate
app.patch('/interest-rate', (req, res) => {

	var old_interest_rate = interest_rate;
    interest_rate = req.body.interest_rate / 100;

    // Return JSON object if valid otherwise return error message
    if (typeof interest_rate === "number" && interest_rate >= 0 && interest_rate <= 100) {
    	res.json(
        {
            old_interest_rate: old_interest_rate,
            new_interest_rate: interest_rate,
            status: 200,
            timestamp: parseInt(Date.now())
        });
    }

    else {
        var error = "Interest Rate is invalid.";
        return res.send(tools.errorHandler(error, 400));
    }
});


server = app.listen(3000, function () {
    console.log("API running on port ", server.address().port);
});