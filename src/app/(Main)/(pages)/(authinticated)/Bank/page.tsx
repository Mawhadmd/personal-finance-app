"use client";

import React, { useEffect } from "react";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
export default function page() {
  const [linkToken, setLinkToken] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const req = await fetch(`/api/plaid/linkToken`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await req.json();
        if (!req.ok) {
          console.error("Failed to fetch link token:", data.error);
          return <div>Error: {data.error}</div>;
        }
        const linkToken = data.link_token;
        if (!linkToken) {
          console.error("Link token is undefined");
          return <div>Error: Link token is undefined</div>;
        }
        setLinkToken(linkToken);
      } catch (err) {
        console.error("Error fetching link token:", err);
        return <div>Error fetching link token</div>;
      }
    };

    fetchLinkToken();
  }, []);

  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      console.log(public_token, metadata);
    },
    onExit: (err, metadata) => {
      console.log(err, metadata);
    },
    onEvent: (eventName, metadata) => {
      console.log(eventName, metadata);
    },
    token: linkToken,
  };
  const { open, ready, exit } = usePlaidLink(config);

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
        <button
          disabled={!ready}
          onClick={() => open()}
          className="bg-text text-background rounded-lg transition-all  p-6 w-fit h-fit cursor-pointer text-5xl font-semibold  hover:text-accent "
        >
          Connect Bank
        </button>
      </div>
    </div>
  );
}
