"use server";

import { cookies } from "next/headers";

async function sendEmail(state: {
  success?: boolean;
  error?: string;
}): Promise<{ success?: boolean; error?: string }> {
  const Cookies = (await cookies());
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

    // Set AccessToken with proper configuration if verification was successful

 

  } catch {
    return { error: "Failed to verify email" };
  }
  return { success: true };
}

export { sendEmail, verify };
