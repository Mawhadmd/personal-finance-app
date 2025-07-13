"use client";
import React from "react";

export default function logoutButton() {
    function handleLogout() {
         fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        
          },
          body: JSON.stringify({}),
        }).then((response) => {
          if (response.ok) {
            window.location.href = "/login";
          } else {
            alert("Logout failed");
          }
        });
    }
  return (
    <button
      onClick={() => {
       handleLogout();
      }}
      className="bg-red-900 p-1 rounded cursor-pointer"
      type="submit"
    >
      Logout
    </button>
  );
}
