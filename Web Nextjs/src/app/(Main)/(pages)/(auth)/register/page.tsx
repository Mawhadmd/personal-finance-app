"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useActionState, useEffect, useState } from "react";
import register from "./registerServerAction";
import {Check, Eye,EyeOff, X} from 'lucide-react'
import currencies from "@/constants/currencies";
import { redirect } from "next/navigation";
const Register = () => {
  const [state, action, pending] = useActionState(
    async (_state: { error?: string; success?: boolean }, formData: FormData) => {
      return await register(formData);
    },
    {
      error: "",
      success: false,
    }
  );
  const resetpassword = () => {

    setPassword("");
    setConfirmPassword("");
  }
  useEffect(() => {
    if (state.success) {
      redirect("/dashboard");
    }
  }, [state]);
  useEffect(() => {resetpassword()}, [state]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);

  // Password validation rules
  const passwordRequirements = [
    { label: "At least 6 characters", test: (pwd: string) => pwd.length >= 6 },
    {
      label: "Contains uppercase letter",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: "Contains lowercase letter",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    { label: "Contains number", test: (pwd: string) => /\d/.test(pwd) },
    {
      label: "Contains special character",
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const RequirementItem = ({
    requirement,
  }: {
    requirement: { label: string; test: (pwd: string) => boolean };
  }) => {
    const isValid = requirement.test(password);
    return (
      <div
        className={`flex items-center space-x-2 text-sm ${
          isValid ? "text-green-500" : "text-red-500"
        }`}
      >
        <span className="w-4 h-4 flex items-center justify-center">
          {isValid ? (
            <Check className="w-3 h-3" />
          ) : (
            <X className="w-3 h-3" />
          )}
        </span>
        <span>{requirement.label}</span>
      </div>
    );
  };

  // Check if passwords match
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const showPasswordMismatch = confirmPassword && !passwordsMatch;

  return (
    <>
      <motion.form
      
        action={action}
        className="space-y-4 p-4 bg-foreground rounded border-border border w-80 h-fit flex flex-col"
        animate={pending ? { translateY: [0, 10, 0] } : { translateY: 0 }}
        transition={
          pending ? { duration: 1, repeat: Infinity } : { duration: 0.5 }
        }
      >
        <div>
          <h1 className="font-semibold text-3xl">Register</h1>
          <small className="text-muted">
            create your account to track your finances
          </small>
        </div>
        <div className="space-y-2">
          <input
            className="w-full border border-border bg-white p-2 text-black/80 rounded"
            placeholder="Full Name"
            type="text"
            name="name"
            id="name"
            required
          />
          <input
            className="w-full  border border-border  bg-white p-2 text-black/80  rounded"
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            required
          />
          <div>
            <input
              className="w-full border border-border bg-white p-2 text-black/80 rounded"
              placeholder="Password"
              type={showpassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              className={`w-full border border-border bg-white p-2 text-black/80 rounded ${
                showPasswordMismatch ? "ring-2 ring-red-500" : ""
              }`}
              placeholder="Confirm Password"
              type={showpassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {showPasswordMismatch && (
              <div className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                <X className="w-3 h-3" />
                <span>Passwords do not match</span>
              </div>
            )}
            {/* Use lucide-react for eye/eye-off icons */}
         
            {passwordsMatch && confirmPassword && (
              <div className="text-green-500 text-sm mt-1 flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Passwords match</span>
              </div>
            )}
          </div>
             <button
              type="button"
              className="cursor-pointer text-accent hover:text-accent/80 text-sm mt-1 flex items-center space-x-1"
              onClick={() => setshowpassword(!showpassword)}
            >
              {showpassword ? (
                // Eye-off icon from lucide-react
                <span className="w-4 h-4 flex items-center justify-center">
                  <EyeOff className="w-4 h-4" />
                </span>
              ) : (
                // Eye icon from lucide-react
                <span className="w-4 h-4 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </span>
              )}
              <small>{showpassword ? "Hide password" : "Show password"}</small>
            </button>
            <div>
                  <select
      name="Currency"
      id="Currency"
      className="w-full border border-border bg-white p-2 text-black/80 rounded"
      defaultValue="USD"
    >
      {currencies.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.code} - {currency.name} ({currency.symbol})
        </option>
      ))}
    </select>
            </div>
        </div>

        {/* Password Requirements */}
        <AnimatePresence>
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-foreground/50 border border-border rounded"
            >
              <div className="p-3">
                <h4 className="text-sm font-medium mb-2 text-text">
                  Password Requirements:
                </h4>
                <div className="space-y-1">
                  {passwordRequirements.map((requirement, index) => (
                    <RequirementItem key={index} requirement={requirement} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="w-full bg-accent/80 cursor-pointer text-text p-2 rounded hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:text-text disabled:line-through"
          disabled={pending || showPasswordMismatch || !passwordsMatch}
        >
          {pending ? "Creating Account..." : "Register"}
        </button>
      </motion.form>
      <div className="text-red-500">{state.error}</div>

      <div className="text-center mt-4">
        <span className="text-muted">Already have an account? </span>
        <a href="/login" className="text-accent hover:text-accent/80 underline">
          Login here
        </a>
      </div>
    </>
  );
};

export default Register;
