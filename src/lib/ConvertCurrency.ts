import currencies from "@/constants/currencies";

//default currency is usd... The currency saved in Database is in USD, the currency that is shown to the user is the currency that is saved in the database. the amount the user inputs is in the currency that is saved in the database (converted to USD before saving to DB). the amount that is shown to the user is in the currency that is saved in the database.
export default function ConvertCurrency({
  amount,
  toCurrency,
  fromCurrency = "USD", // Set default value instead of optional
}: {
  amount: number;
  toCurrency: string;
  fromCurrency?: string;
}) {
  // Validate inputs
  // Error fixed, if toCurrency = USD was provided without from currency the app would crash
  console.log(amount,toCurrency,fromCurrency)
  if (!amount || amount < 0) {
    throw new Error("Amount must be a positive number");
  }

  if (!toCurrency) {
    throw new Error("toCurrency is required");
  }

  // No conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Find currency objects with error handling
  const fromCurrencyObj = currencies.find((c) => c.code === fromCurrency);
  const toCurrencyObj = currencies.find((c) => c.code === toCurrency);

  if (!fromCurrencyObj) {
    throw new Error(`Currency not found: ${fromCurrency}`);
  }

  if (!toCurrencyObj) {
    throw new Error(`Currency not found: ${toCurrency}`);
  }

  // Converting to USD
  if (toCurrency === "USD") {
    return amount / fromCurrencyObj.exchangeRate;
  }

  // Converting from USD to another currency
  if (fromCurrency === "USD") {
    return amount * toCurrencyObj.exchangeRate;
  }

  // Converting between two non-USD currencies
  // First convert to USD, then to target currency
  const usdAmount = amount / fromCurrencyObj.exchangeRate;
  return usdAmount * toCurrencyObj.exchangeRate;
}
