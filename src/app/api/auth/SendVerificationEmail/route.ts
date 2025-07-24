import { sendEmail } from "@/lib/nodeMailer";
import { NextRequest } from "next/server";
import pool from "@/db/postgres";
import randomstring from "randomstring";
import { jwtVerify } from "jose";


export async function POST(request: NextRequest) {
  try {
    // Get email from Verificaiton-token cookie (matches your middleware)
    const verificationTokenCookie = request.cookies.get("AccessToken");
    if (!verificationTokenCookie) {
      return new Response(
        JSON.stringify({ error: "Verification token not found." }),
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(
      verificationTokenCookie.value,
      new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!)
    );
    const email = payload.email as string;
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email not found in token." }),
        { status: 400 }
      );
    }

    // Get user by email
    const userResult = await pool.query(
      'SELECT user_id FROM "users" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
      });
    }

    const user_id = userResult.rows[0].user_id;

    // Check if there's a valid (non-expired) verification code for this user
    try {
      const existingCodeResult = await pool.query(
        `SELECT code, expires_at FROM verification_codes 
       WHERE user_id = $1 AND expires_at > NOW() 
       ORDER BY created_at DESC 
       LIMIT 1`,
        [user_id]
      );

      if (existingCodeResult.rows.length > 0) {
        const existingCode = existingCodeResult.rows[0];
        const timeLeft =
          new Date(existingCode.expires_at).getTime() - new Date().getTime();
        const minutesLeft = Math.floor(timeLeft / (1000 * 60));

        return new Response(
          JSON.stringify({
            error: `A valid verification code already exists. Please wait ${minutesLeft} minutes before requesting a new one.`,
          }),
          { status: 400 }
        );
      }
    } catch {
      return new Response(
        JSON.stringify({ error: "Error checking existing verification code." }),
        { status: 500 }
      );
    }

    // Generate new 6-digit verification code
    const code = randomstring.generate({
      length: 6,
    });

    // Set expiry to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Insert new verification code into verification_codes table
    await pool.query(
      `INSERT INTO verification_codes (user_id, code,email, expires_at) 
       VALUES ($1, $2, $3, $4)`,
      [user_id, code, email, expiresAt]
    );

    // Send verification email
    const emailError = await sendEmail(email, code);
    if (emailError) {
      console.error("Email sending error:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send verification email." }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent successfully.",
        expiresAt: expiresAt.toISOString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("SendVerificationEmail error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again." }),
      { status: 500 }
    );
  }
}
