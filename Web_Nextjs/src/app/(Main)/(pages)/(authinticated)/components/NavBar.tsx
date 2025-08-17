"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Download, LayoutDashboard, Upload, Moon, Sun, LogOut, Settings, PiggyBank } from "lucide-react";
import ThemeControl from "@/lib/ThemeControl";
import handleLogout from "@/lib/auth/HandleLogout";

const NavBar = () => {
  const path = usePathname();
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");

  console.log("Current path:", path);
  const paths: [string, string, React.ReactNode][] = [
    [
      "/dashboard",
      "Dashboard",
      <LayoutDashboard size={18} className="mr-2 size-6 " key="dashboard" />,
    ],
    [
      "/expenses",
      "Expenses",
      <Upload size={18} className="mr-2  size-6 " key="expenses" />,
    ],
    [
      "/income",
      "Income",
      <Download size={18} className="mr-2 size-6 " key="income" />,
    ],
    [
      "/settings",
      "settings",
      <Settings size={18} className="mr-2 size-6 " key="settings" />,
    ],
    [
      "/Bank",
      "Bank",
      <PiggyBank size={18} className="mr-2 size-6 " key="bank" />,
    ]
  ];

  // Initialize theme
  useEffect(() => {
    const theme = ThemeControl.getTheme();
    setCurrentTheme(theme);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = ThemeControl.toggleTheme(); // Toggle theme
    setCurrentTheme(newTheme);
  };

  return (
    <div>
      <nav className="w-50 flex h-screen  relative flex-col p-4 bg-foreground border-r border-foreground">
        {" "}
        <div className="text-text text-center font-extrabold border-b border-border  w-full text-2xl ">
          PFinance
        </div>
        <ul className="pt-4 w-full">
          {paths.map(([route, label, icon]) => (
            <Link href={route} key={route} className="relative w-full cursor-pointer">
              <li
                className={`${
                  route == path
                    ? "text-text  font-semibold"
                    : "text-text/50 font-normal"
                } text-center   rounded-lg p-1 relative transition-all duration-300`}
              >
                <div className="relative z-5 flex items-center text-xl">
                  <div className={`${route === path && "text-accent"}`}>
                    {icon}
                  </div>
                  <p>{label}</p>
                </div>
                {path === route && (
                  <motion.div
                    layoutId="whatever"
                    className={`absolute inset-0 rounded  bg-accent/20  `}
                  ></motion.div>
                )}
              </li>
            </Link>
          ))}
        </ul>
        <div className="absolute flex  justify-between items-center w-full bottom-0 left-0 p-4 space-x-2">
            <button
              onClick={() => {
                handleLogout();
              }}
              className="bg-red-500 font-semibold flex justify-center items-center shadow-custom p-2 max-h-10 rounded-lg cursor-pointer text-white"
              type="button"
              aria-label="Logout"
            >
             Logout  <LogOut size={18} className="ml-2 size-6" />
            </button>
          <div>
            <button
              onClick={handleThemeToggle}
              className="flex items-center cursor-pointer shadow-custom justify-center w-10 h-10 rounded-lg bg-background text-text hover:bg-accent/80 transition-colors"
              aria-label="Toggle theme"
            >
              {currentTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
