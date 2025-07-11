"use server";

import { LoginResponse } from "@/models/login";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const login = async (
  state: { error?: string; success?: boolean },
  formData: FormData
) => {
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login attempt with email:", email);

  try {
    const fetchResponse = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
        if(fetchResponse.status.toString().startsWith("5")){
            console.log("Fetch response status:", fetchResponse.status);
            return { error: "Internal Server Error. Please try again later." };
        }
          const data: LoginResponse = (await fetchResponse.json());
        if (!fetchResponse.ok) {
          console.error("Login failed:", fetchResponse.statusText);
          return { error: `${fetchResponse.status} Error: ${data.error}` };
        }
        if (!data.success) {
          console.error("Login failed:", data.error);
          return { error: data.error };
        }
    console.log("Login successful:", data);

    // Set the token in cookies using Next.js server-side cookies
    (await cookies()).set("token", data.token, {
      path: "/",
      maxAge: 3600, // 1 hour
      httpOnly: true, // More secure
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    console.log("Token set in cookies");
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed. Please try again." };
  }

  // Redirect to the dashboard (this happens after successful login)
  redirect("/");
};

export default login;
