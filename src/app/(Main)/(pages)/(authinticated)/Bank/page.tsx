import React from "react";
import ConnectBank from "./ConnectBank";
import BankConnected from "./BankConnected";
import { checkPlaidToken, getPlaidTransactions } from "@/lib/PlaidHelpers";


export default async function page() {
  
  const TokenExist = await checkPlaidToken()
  if (!TokenExist){
    return <ConnectBank />;
  }
  const data = await getPlaidTransactions()

  return <BankConnected data={data} />;
}
