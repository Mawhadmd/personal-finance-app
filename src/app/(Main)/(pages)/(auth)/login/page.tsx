"use client";
import { motion } from "framer-motion";
import React, { useActionState } from "react";
import login from "./loginServerAction";

const Login = () => {
  const [state, action, pending] = useActionState(login, { error: "" });

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
          <h1 className="font-semibold text-3xl">Login</h1>
          <small className="text-muted">
            login to keep your financial stats safe
          </small>
        </div>
        <div className="space-y-2">
          <input
            className="w-full bg-text p-2 text-background rounded"
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            required
          />
          <input
            className="w-full bg-text p-2 text-background rounded"
            placeholder="Password"
            type="password"
            name="password"
            id="password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent/80 cursor-pointer text-text p-2 rounded hover:bg-accent transition-colors duration-300"
        >
          {pending ? "Logging in..." : "Login"}
        </button>
      </motion.form>
      <div className="text-red-500">{state.error}</div>
      <div className="text-center mt-4">
        <span className="text-muted">Don't have an account? </span>
        <a
          href="/register"
          className="text-accent hover:text-accent/80 underline"
        >
          Register here
        </a>
      </div>
    </>
  );
};

export default Login;
