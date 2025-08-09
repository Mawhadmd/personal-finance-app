import React from "react";
import ConnectBank from "./ConnectBank";
import BankConnected from "./BankConnected";
import  checkPlaidToken from "@/lib/utils/helpers/plaid/checkPlaidToken";
import fetchPlaidAccounts from "@/lib/utils/helpers/plaid/fetchPlaidAccounts";


export default async function page() {
  const TokenExist = await checkPlaidToken();

  if (!TokenExist) {
    return <ConnectBank />;
  }
  const data = await fetchPlaidAccounts();
  if (!data) {
    return <ConnectBank />;
  }
  return <BankConnected data={data} />;
}
