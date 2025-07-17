"use client";
import React, { useActionState, useEffect,  } from "react";
import { sendEmail, verify } from "./VerificationServerActions";
import { MailIcon,  } from "lucide-react";
import { redirect } from "next/navigation";

export default function VerifyEmail() {
  const [SendEmailstate, SednEmailaction, SendEmailpending] = useActionState(
    sendEmail,
    {
      success: false,
      error: "",
    }
  );
  const [Verifystate, SendVerifyEmail, Verifypending] = useActionState(verify, {
    success: false,
    error: "",
  });
  useEffect(() => {
    if(Verifystate.success){
      redirect('/dashboard');
    }
 
  }, [Verifystate]);
  return (
    <>
      <div className="w-80 h-80 flex  flex-col items-center  p-4 bg-foreground border-border border ">
        <MailIcon />
        <form
          action={SendVerifyEmail}
          className="w-full flex flex-col space-y-4 justify-around items-center h-full"
        >
          <h2>Verify Your Email</h2>
          <div className="space-y-2">
            <div className="relative space-y-4 flex justify-center  w-full items-center ">
              <input
                type="text"
                placeholder="Verificaiton Code"
                name="code"
                className=" text-black border border-border p-3 w-full h-full m-0    bg-white"
              />
              <button
                type="button"
                onClick={SednEmailaction}
                className="absolute text-sm right-0 top-0 bottom-0 bg-accent text-foreground p-2 hover:bg-accent/80 transition-colors cursor-pointer h-full"
              >
                {SendEmailpending ? "Sending..." : "Send Email"}
              </button>
            </div>
            <p className="text-muted text-sm text-center">
              Please check your spam folder. You can only send an email once
              every minute
            </p>
          </div>
          <div className="w-full">
            {" "}
            <div className="min-h-6 ">
              {(SendEmailstate.error || Verifystate.error) && (
                <div className=" text-red-500 text-center">
 
                  {Verifystate.error && <div>{Verifystate.error}</div>}
                </div>
              )}
              {(SendEmailstate.success || Verifystate.success) && (
                <div className=" text-green-500 text-center">
       
                  {Verifystate.success && <div>Email verified!</div>}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="border border-border rounded-xl font-bold hover:bg-background/80 cursor-pointer bg-background text-accent w-full p-3 text-xl"
            >
              {Verifypending ? "Verifying..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <div className="h-5">
        {(SendEmailstate.error || Verifystate.error) && (
          <div className="mt-1 text-red-500 text-center">
            {SendEmailstate.error && <div>{SendEmailstate.error}</div>}
          </div>
        )}
        {(SendEmailstate.success || Verifystate.success) && (
          <div className="mt-1 text-green-500 text-center">
            {SendEmailstate.success && (
              <div>
                Email sent successfully! Wait 24 hours before requesting another
                day
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
