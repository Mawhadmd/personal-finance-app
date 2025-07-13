"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";



const register = async (
  {success,error}: { error?: string; success?: boolean },
  formData: FormData
):  Promise<{ error?: string; success?: boolean }> => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const Currency = formData.get("Currency");
  const confirmPassword = formData.get("confirmPassword");

  console.log("Registration attempt with email:", email);

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  

  try {
    const fetchResponse = await fetch(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, Currency }),
      }
    );

    if (fetchResponse.status.toString().startsWith("5")) {
      console.log("Fetch response status:", fetchResponse.status);
      return { error: "Internal Server Error. Please try again later." };
    }

    const data: RegisterResponse = await fetchResponse.json();

    if (!fetchResponse.ok) {
      console.error("Registration failed:", fetchResponse.statusText);
      return { error: `${data.error}` };
    }

    if (!data.success) {
      console.error("Registration failed:", data.error);
      return { error: data.error };
    }

    console.log("Registration successful:", data);

    // If registration is successful and we get a token, set it and redirect
    if (data.token) {
      (await cookies()).set("AccessToken", data.token, {
        path: "/",
        maxAge: parseInt(process.env.AccessTokenTimeout!), 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });


    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Network error. Please try again." };
  }


};

export default register;
