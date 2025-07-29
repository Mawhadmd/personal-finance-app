import React from "react";
import ConnectBankButton from "./ConnectBankButton";

export default function page() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <h1>Connect Your Bank Account</h1>
        <small className="text-muted">
          For better financial insights and management
        </small>
      </div>
      <div>
        <p>
          Linking your bank account allows us to provide personalized financial
          advice and track your spending habits more effectively. We use plaid
          for secure connections.
        </p>
        <p>Click the button below to start the process.</p>
      </div>
      <div className="flex justify-center items-center flex-1">
        <ConnectBankButton />
      </div>
    </div>
  );
}
