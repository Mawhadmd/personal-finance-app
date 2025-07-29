"use client";
import { usePlaidConnect } from "@/hooks/usePlaid";
import { DotSquare, LoaderIcon } from "lucide-react";
import React from "react";

export default function ConnectBankButton() {
  const { open, ready, exit } = usePlaidConnect();
  return (
    <button
      disabled={!ready}
      onClick={() => open()}
      className="bg-text w-100 h-30 text-background rounded-lg transition-all justify-center items-center flex  p-6 cursor-pointer text-5xl font-semibold  hover:text-accent "
    >
      {ready ? "Connect Bank" : <DotSquare className="animate-spin size-16" />}
    </button>
  );
}
