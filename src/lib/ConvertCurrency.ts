import currencies from "@/constants/currencies";

//default currency is usd... The currency saved in Database is in USD, the currency that is shown to the user is the currency that is saved in the database. the amount the user inputs is in the currency that is saved in the database (converted to USD before saving to DB). the amount that is shown to the user is in the currency that is saved in the database.
export default function ConvertCurrency({
  amount,
  toCurrency,
  fromCurrency, // add fromCurrency here
}: {
  amount: number;
  toCurrency: string;
  fromCurrency?: string; //optional, if not provided, it will be assumed that the amount is in USD
}) {
  if (toCurrency == "USD") {
    return amount / currencies.find((c) => c.code == fromCurrency)!.exchangeRate; //when user input amount in other currencies
  }




  return currencies.find((c) => c.code == toCurrency)!.exchangeRate * amount; //USD to other currencies
}
