
var express = require('express');
var bodyParser = require("body-parser");
var server;
var interestRate = 1;
var app = express()


// Get the recurring payment amount of a mortgage
// GET request format: localhost:3000/payment-amount?json={"askingPrice": 100000. "downPayment": 10000, "paymentSchedule": biweekly, "amortPeriod": 10}
//
// PARAMS:
// downPayment: Must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k mortgage)
// amortPeriod: Min 5 years, max 25 years
// paymentSchedule: Weekly, biweekly, monthly
app.get('/payment-amount', (req, res) => {

	var input = JSON.parse(req.query.json);

	console.log(input);

    var askingPrice = input.askingPrice;
	
	console.log(askingPrice);

    res.json(
    {
    	paymentAmount : askingPrice,
    	status: 200,
    	timestamp : parseInt(Date.now())
    });

});

// Get the maximum mortgage amount
app.get('/mortgage-amount', (req, res) => {
	return res.send('GET request for mortgage-amount');
});

// Change the interest rate used by the application
app.patch('/interest-rate', (req, res) => {
	interestRate = 2;
	return res.send(interestRate);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});