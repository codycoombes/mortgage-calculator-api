module.exports = {

	calculator: function(askingPrice, downPayment, paymentSchedule, amortPeriod, interestRate) {

		var loanPrincipal = askingPrice - downPayment;
		var downpaymentRate = downPayment / askingPrice;

		// Dictionary to convert each payment schedule into how many payments per year
		var scheduleOptions = {"weekly": 52, "biweekly": 26, "monthly": 12};

		var c = interestRate / scheduleOptions[paymentSchedule.toLowerCase()];
		var n = amortPeriod * scheduleOptions[paymentSchedule.toLowerCase()];

		// Payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
		// P = Payment
		// L = Loan Principal
		// c = Interest Rate
		// n = Number of weeks

		var payment = round(((loanPrincipal*(c * (1+c)**n)) / ((1+c)**n-1)), 2);

		return payment;
	}

}

// Handles rounding to nearest dec
function round(val, dec) {
		return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
}