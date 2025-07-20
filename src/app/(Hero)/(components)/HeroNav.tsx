"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function HeroNav() {
  const pathname  = usePathname();
  const array = [
    { name: "Home", href: "/" },
    { name: "How it works", href: "/how-it-works" },
    { name: "It's Free!", href: "/free" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="flex justify-between items-center h-20 p-4 z-30 bg-foreground text-text shadow">
      <h1>PFinance</h1>
      <ul className="flex space-x-8 text-xl">
        {array.map((item) => (
          <li key={item.name} className="relative cursor-pointer hover:bg-accent/20 p-2 rounded-lg transition-all">
            <Link href={item.href}>{item.name}</Link>
            {item.href === pathname && (
              <motion.span  layoutId="active-link" className="border-b-2 border-accent absolute inset-0"></motion.span>
            )}
          </li>
        ))}
      </ul>
      <button className="p-2 m-1 bg-accent rounded-full  border border-border cursor-pointer hover:bg-accent/80">Sign in</button>
    </nav>
  );
}
