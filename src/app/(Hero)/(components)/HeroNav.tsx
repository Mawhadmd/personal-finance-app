"use client";
import ThemeControl from "@/lib/ThemeControl";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function HeroNav() {
  const { scrollYProgress } = useScroll();
  const [scrolly, setScrolly] = React.useState(0);
  const [hasTriggeredAbove, setHasTriggeredAbove] = React.useState(false);
  const [hasTriggeredBelow, setHasTriggeredBelow] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  useEffect(() => {
    const currentTheme = ThemeControl.getTheme();
    setTheme(currentTheme);
  }, []);
  const pathname = usePathname();
  const toggleTheme = () => {
    ThemeControl.toggleTheme();
  };
  const array = [
    { name: "Home", href: "#hero" },
    { name: "How it works", href: "#features" },
    { name: "It's Free!", href: "#free" },
    { name: "Contact Us", href: "#contact" },
  ];

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (current > 0.01 && !hasTriggeredAbove) {
      setScrolly(current);
      setHasTriggeredAbove(true);
      setHasTriggeredBelow(false); // Reset the below trigger
      return;
    }

    if (current < 0.01 && !hasTriggeredBelow) {
      setScrolly(current);
      setHasTriggeredBelow(true);
      setHasTriggeredAbove(false); // Reset the above trigger
      return;
    }
  });

  return (
   <> <div className="hidden sm:block">
      {" "}
      {scrolly < 0.01 ? (
        <motion.nav
          id="hero"
          layoutId="nav"
          className="absolute  justify-between flex items-center h-15 p-4 z-30 text-text  left-0 right-0"
        >
          <h1>PFinance</h1>
          <ul className="flex space-x-12 text-xl">
            {array.map((item) => (
              <li
                key={item.name}
                className="relative cursor-pointer hover:bg-accent/20 p-2 rounded-lg transition-all"
              >
                <Link href={item.href}>{item.name}</Link>
                {item.href === pathname && (
                  <motion.span
                    layoutId="active-link"
                    className="border-b-2 border-accent absolute inset-0"
                  ></motion.span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-4">
            <div onClick={toggleTheme} className="cursor-pointer">
              {theme == "dark" ? <Sun /> : <Moon />}
            </div>
            <Link
              href="/login"
              className="p-2 m-1 rounded-lg bg-accent  border border-border cursor-pointer hover:bg-accent/80"
            >
              Sign in
            </Link>
          </div>
        </motion.nav>
      ) : (
        <motion.nav
          id="hero"
          layoutId="nav"
          className="flex backdrop-blur-sm justify-between items-center h-14 p-4 z-30 bg-background/50  text-text fixed top-4 w-1/2 mx-auto left-0 right-0 shadow-lg rounded-lg transition-all duration-300 ease-in-out"
        >
          <ul className="flex space-x-8 text-xl mx-auto">
            {array.map((item) => (
              <li
                key={item.name}
                className="relative cursor-pointer hover:bg-accent/20 p-2 rounded-lg transition-all"
              >
                <Link href={item.href}>{item.name}</Link>
                {item.href === pathname && (
                  <motion.span
                    layoutId="active-link"
                    className="border-b-2 border-accent absolute inset-0"
                  ></motion.span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-4">
            <div
              onClick={() => ThemeControl.toggleTheme()}
              className="cursor-pointer"
            >
              {theme == "dark" ? <Sun /> : <Moon />}
            </div>
            <Link
              href="/login"
              className="p-2 m-1 rounded-lg bg-accent  border border-border cursor-pointer hover:bg-accent/80"
            >
              Sign in
            </Link>
          </div>
        </motion.nav>
      )}
    </div>
    <div className="sm:hidden"></div></>
  );
}
