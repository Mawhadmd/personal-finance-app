"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Download, Inbox, LayoutDashboard, Upload, Wallet } from "lucide-react";
const NavBar = () => {
  const path = usePathname();
  console.log("Current path:", path);
  const paths: [string, string, React.ReactNode][] = [
    ["/", "Dashboard", <LayoutDashboard size={18} className="mr-2 size-6 " />],
    ["/expenses", "Expenses", <Upload size={18} className="mr-2  size-6 " />],
    ["/income", "Income", <Download size={18} className="mr-2 size-6 " />],
  ];
  return (
    <div>
      <nav className="flex h-screen  relative flex-col p-4 bg-foreground border-r border-foreground">
        {" "}
        <div className="text-white font-extrabold border-b">
          Personal Finance
        </div>
        <ul className="pt-4 w-full">
          {paths.map(([route, label, icon]) => (
            <Link href={route} key={route} className="relative w-full">
              <li
                className={`${
                  route == path
                    ? "text-text font-semibold"
                    : "text-muted font-normal"
                } text-center   rounded-lg p-1 relative transition-all duration-300`}
              >
                <div className="relative z-5 flex items-center text-xl">
                  {icon}
                  <p>{label}</p>
                </div>
                {path === route && (
                  <motion.div
                    layoutId="whatever"
                    className={`absolute inset-0 rounded  bg-green-400/80  `}
                  ></motion.div>
                )}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
