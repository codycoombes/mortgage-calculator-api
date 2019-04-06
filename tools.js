// tools.js for mortgage-calculator-api 
// By Cody Coombes

const PAYMENT_SCHEDULE_TYPES = ["weekly", "biweekly", "monthly"];
const PAYMENT_SCHEDULE_DICT = {"weekly": 52, "biweekly": 26, "monthly": 12};
const INSURANCE_REQUIRED_DOWN = 0.2;
const INSURANCE_RATE_1 = 0.0315;
const INSURANCE_RATE_2 = 0.024;
const INSRAUNCE_RATE_3 = 0.018;

module.exports = {

	mortgage: function(asking_price, down_payment, payment_schedule, amortization_period, interest_rate) {

		var loan_principal = asking_price - down_payment;
		var down_payment_rate = down_payment / asking_price;

		var c = interest_rate / PAYMENT_SCHEDULE_DICT[payment_schedule];
		var n = amortization_period * PAYMENT_SCHEDULE_DICT[payment_schedule];


		//Must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k
		//mortgage)

		var minimal_down_payment = 0;

		if (down_payment > 500000) {
			minimal_down_payment = ((asking_price - 500000) * (0.1)) + ((500000) * (0.05));
		}

		else {
			minimal_down_payment = asking_price * 0.05;
		}
 
		if (down_payment < minimal_down_payment) {
			return -1;
		}

		
		// Mortgage insurance is required on all mortgages with less than 20% down. Insurance must be
		// calculated and added to the mortgage principal. Mortgage insurance is not available for
		// mortgages > $1 million.
		// Mortgage insurance rates are as follows:
		// Down payment Insurance Cost
		// 5-9.99% 3.15%
		// 10-14.99% 2.4%
		// 15%-19.99% 1.8%
		// 20%+ N/A

		if (down_payment_rate < INSURANCE_REQUIRED_DOWN) {

			if (down_payment_rate >= 0.05 && down_payment_rate < 0.1) {
				loan_principal = loan_principal + (loan_principal * INSURANCE_RATE_1);
			}

			else if (down_payment_rate >= 0.1 && down_payment_rate < 0.15) {
				loan_principal = loan_principal + (loan_principal * INSURANCE_RATE_2);
			}

			else if (down_payment_rate >= 0.15 && down_payment_rate < 0.2) {
				loan_principal = loan_principal + (loan_principal * INSRAUNCE_RATE_3);
			}

			// else 20%+ N/A
		}


		// Payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
		// P = Payment
		// L = Loan Principal
		// c = Interest Rate
		// n = Frequency of payments

		var payment = round(((loan_principal*(c * (1+c)**n)) / ((1+c)**n-1)), 2);

		return payment;
	},

	// Validate that are no missing parameters and parameters are valid
	// INPUT: JSON object
	// RETURN: error message
    validate: function(req) {

	    var errors  = [];

	    // Check if any fields are missing
	    if (!req.asking_price || !req.down_payment || !req.payment_schedule || !req.amortization_period ) {
	        errors.push("Missing inputs. Need asking price, down payment, payment schedule, and amortization period.");
	    }

	    // Check if fields are valid
	    else {

	        if ((typeof req.asking_price !== 'number') || req.asking_price < 0) {
	            errors.push("Invalid asking price. Must be a number greater than 0.");
	        }

	        if ((typeof req.down_payment !== 'number') || req.down_payment <= 0 || req.asking_price < req.down_payment) {
	            errors.push("Invalid down payment. Must be greater than or equal to 0 but smaller than asking price.");
	        }

	        if ((typeof req.payment_schedule !== 'string') || PAYMENT_SCHEDULE_TYPES.indexOf(req.payment_schedule.toLowerCase()) <= -1) {
	            errors.push("Invalid payment schedule. Must be in format of weekly, biweekly, or monthly.");
	        }

	        if ((typeof req.amortization_period !== 'number') || req.amortization_period < 5 || req.amortization_period > 25) {
	            errors.push("Invalid amortization period. Must be no less than 5 and no greater than 25.");
	        }
	    }

	    if (errors.length) {
	        console.log(errors);
	    }

	    return errors;
	},

	errorHandler: function(msg, status) {
	    
	    var error = new Error();
	    error.errorMessage = msg;
	    error.status = status;
	    return error;
	}

}

// Handles rounding to nearest dec
function round(val, dec) {
		return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
}
