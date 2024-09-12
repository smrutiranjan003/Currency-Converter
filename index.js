const currencyRates = {};

// API URL for fetching rates based on USD
const API_URL = `https://open.er-api.com/v6/latest/USD`;

// Fetch currency rates from the API
async function fetchCurrencyRates() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch currency rates. Please try again later.');
        }
        const data = await response.json();
        // Store the fetched currency rates
        Object.assign(currencyRates, data.rates);
        // Add USD to the rates (1:1 conversion)
        currencyRates['USD'] = 1;
        updateCurrencyOptions(); // Update dropdown options after fetching rates
        console.log('Updated Currency Rates:', currencyRates); // For testing purposes
    } catch (error) {
        alert(error.message);
        console.error('Error fetching currency rates:', error);
    }ko
}

// Add a custom currency
document.getElementById('addCurrencyButton').addEventListener('click', function () {
    const customCurrencyCode = document.getElementById('customCurrency').value.toUpperCase();
    
    if (customCurrencyCode && !currencyRates[customCurrencyCode]) {
        if (customCurrencyCode.length !== 3) {
            alert('Currency code must be 3 characters long.');
            return;
        }

        const exchangeRate = parseFloat(prompt(`Enter exchange rate for 1 USD to ${customCurrencyCode}`));
        if (!isNaN(exchangeRate) && exchangeRate > 0) {
            currencyRates[customCurrencyCode] = exchangeRate;
            updateCurrencyOptions();
        } else {
            alert('Invalid exchange rate. Please enter a valid number greater than 0.');
        }
    } else if (currencyRates[customCurrencyCode]) {
        alert(`Currency ${customCurrencyCode} already exists.`);
    } else {
        alert('Invalid currency code. Please enter a valid code (e.g., CAD).');
    }
});

// Update the currency options in the dropdowns
function updateCurrencyOptions() {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');

    // Clear existing options
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';

    for (const currency in currencyRates) {
        const option = document.createElement('option');
        option.value = currency;
        option.innerText = currency;
        fromCurrencySelect.appendChild(option);

        const toOption = option.cloneNode(true);
        toCurrencySelect.appendChild(toOption);
    }
    toCurrencySelect.innerHTML += '<option value="custom">Custom</option>';
}

// Convert currency when button is clicked
document.getElementById('convertButton').addEventListener('click', convertCurrency);

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultElement = document.getElementById('result');

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
    }

    // Perform currency conversion
    const convertedAmount = (amount / currencyRates[fromCurrency]) * currencyRates[toCurrency];
    resultElement.value = convertedAmount.toFixed(2);
}

// Fetch initial currency rates on page load
fetchCurrencyRates();
