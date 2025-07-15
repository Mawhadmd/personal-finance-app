"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function sendEmail(state: {
  success?: boolean;
  error?: string;
}): Promise<{ success?: boolean; error?: string }> {
  const Cookies = await cookies();
  if (Cookies.get("AccessToken") === undefined) {
    return { error: "You must be logged in to send a verification email." };
  }
  const requestverifcationreq = await fetch(
    "http://localhost:3000/api/auth/SendVerificationEmail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${Cookies.toString()}`,
      },
    }
  );

  const requestverifcation = await requestverifcationreq.json();
  if (!requestverifcationreq.ok) {
    return {
      error: requestverifcation.error || "Failed to send verification email",
    };
  }
  return { success: requestverifcation.success };
}

async function verify(
  state: {
    success?: boolean;
    error?: string;
  },
  formdata: FormData
): Promise<{ success?: boolean; error?: string }> {
  const verificationCode = formdata.get("code");
  if (!verificationCode) {
    return { error: "Verification code is required" };
  }
  if (verificationCode.toString().length != 6) {
    return { error: "Verification code must be 6 characters long" };
  }

  try {
    const requestverifcation = await fetch(
      "http://localhost:3000/api/auth/verifyEmail",
      {
        method: "POST",
        headers: {
          Cookie: `${(await cookies()).toString()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      }
    );
    const response = await requestverifcation.json();

    if (!requestverifcation.ok) {
      return { error: response.error || "Failed to verify email" };
    }
    if (!response.update){
      return { error: "No token received after verification - please inform Support" };
    }
   (await cookies()).set("AccessToken", response.update, {
        path: "/",
        maxAge: parseInt(process.env.AccessTokenTimeout!),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

    // Verification successful - redirect to dashboard
    redirect("/dashboard");
  } catch {
    console.error("Error verifying email:");
    return { error: "Failed to verify email" };
  }

  // This line should never be reached due to redirect, but keeping for type safety
  return { success: true };
}

export { sendEmail, verify };
