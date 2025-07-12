import currencies from "@/constants/currencies";

export default function ConvertCurrency({
  //default currency is usd
  amount,
  toCurrency,
}: {
  amount: number;
  toCurrency: string;
}) {
  return currencies.find((c) => c.code == toCurrency)!.exchangeRate * amount;
}
