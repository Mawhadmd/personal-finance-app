
'use client'
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import useToast from "./useToast";
import { useState, useEffect } from "react";
import { usePlaidContext } from "@/context/PlaidContext";
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
    return linkToken;
  } catch (err) {
    console.error("Error fetching link token:", err);
    return <div>Error fetching link token</div>;
  }
};




export const usePlaidConnect = () => {
  const { showSuccess, showError } = useToast();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  
  useEffect(() => {
    const getToken = async () => {
      const token = await fetchLinkToken();
      if (typeof token === "string") {
        setLinkToken(token);
      }
    };
    getToken();
  }, []);

  const config: PlaidLinkOptions = {
    onSuccess: async (public_token, metadata) => {
      console.log(metadata);
      const publicTokenExchange = await fetch(
        "/api/plaid/exchangePublicToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_token }),
        }
      );
      if (!publicTokenExchange.ok) {
        showError("Something Went Wrong!");
        return;
      }
      showSuccess("bank link successful!");
      window.location.reload();
    },
    onExit: (err, metadata) => {
      showError("You exited the setup!");
      console.log(err, metadata);
    },
    onEvent: (eventName, metadata) => {
      console.log(eventName, metadata);
    },
    token: linkToken ?? "",
  };

  const { open, ready, exit } = usePlaidLink(config);

  return {
    open,
    ready,
    exit,
  };
};

export const getPlaidTransactions = () => {
    
}

