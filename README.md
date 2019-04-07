# Mortgage Calculator API
API for calculating mortgages that accepts and returns JSON <br>
Implemented using Express.js and Node.js <br>
Tested using Express.js version 4.14.0, Node.js version 10.15.3, and Postman chrome extension <br>

### Setup: <br>
```Clone the directory and navigate to the workspace``` <br>
```npm install``` <br>
```node index.js``` <br>

App is set to run at http://localhost:3000

### Methods: <br>
#### GET /payment-amount <br>
Get the recurring payment amount of a mortgage <br>
Params:<br>
Asking Price<br>
Down Payment`*`<br>
Payment schedule`***`<br>
Amortization Period`**`

Return:<br>
Payment amount per scheduled payment

#### GET /mortgage-amount <br>
Get the maximum mortgage amount <br>
Params:<br>
payment amount<br>
Down Payment(optional)`****`<br>
Payment schedule`***`<br>
Amortization Period`**`<br>

Return:<br>
Maximum Mortgage that can be taken out

#### PATCH /interest-rate <br>
Change the interest rate used by the application <br>
Params: <br>
Interest Rate <br>

Return:<br>
Message indicating the old and new interest rate

`*` Must be at least 5% of first $500k plus 10% of any amount above $500k (So $50k on a $750k
mortgage) <br>
`**` Min 5 years, max 25 years <br>
`***` Weekly, biweekly, monthly <br>
`****` If included its value should be added to the maximum mortgage returned <br>

Created by Cody Coombes
