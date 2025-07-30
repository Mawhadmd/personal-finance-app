'use client'
import React, { createContext, useEffect, useState } from 'react'
type PlaidContextType = {
    bankLinked: boolean | undefined;
    setBankLinked: (linked: boolean | undefined) => void;
};

const PlaidContext = createContext<PlaidContextType>({
    bankLinked: undefined,
    setBankLinked: () => {}
});
export const usePlaidContext = () => React.useContext(PlaidContext);
export const PlaidProvider = ({ children }: {children: React.ReactNode}) => {
    const [bankLinked, setBankLinked] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        fetch(`/api/plaid/check`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => {
            console.log("Bank link status:", data);
            setBankLinked(data.linked);
        })
        .catch(error => {
            console.error("Error checking bank link status:", error);
        });
        
    }, []);
  return (
    <PlaidContext.Provider value={{ bankLinked, setBankLinked }}>
      {children}
    </PlaidContext.Provider>
  )
}
