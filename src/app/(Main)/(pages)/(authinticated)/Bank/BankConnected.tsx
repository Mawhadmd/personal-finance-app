import { TransactionsGetResponse } from "plaid";
import React from "react";
import ConnectBankButton from "./ConnectBankButton";

export default function BankConnected({
  data,
}: {
  data: TransactionsGetResponse['accounts'];
}) {
  return (
    <div className="p-6 ">
      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Your bank accounts are linked successfully!
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-background border border-border rounded-lg overflow-hidden">
          <thead className="bg-foreground">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider border-b">
                Account Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider border-b">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider border-b">
                Subtype
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider border-b">
                Available Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider border-b">
                Current Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider border-b">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-foreground divide-y divide-border">
            {data.map((account, index: number) => (
              <tr
                key={account.account_id}
                className={
                  index % 2 === 0 ? "bg-foreground" : "bg-background/30"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                  {account.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {account.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                  {account.subtype}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text font-semibold">
                  ${account.balances.available?.toLocaleString() || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text font-semibold">
                  ${account.balances.current?.toLocaleString() || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                  {account.balances.last_updated_datetime
                    ? new Date(
                        account.balances.last_updated_datetime
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted">No accounts found.</p>
        </div>
      )}
         <div className="flex justify-center items-center flex-1 pt-10">
              <ConnectBankButton />
            </div>
    </div>
  );
}
