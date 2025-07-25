import { Montserrat } from "next/font/google";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Rocket } from "lucide-react";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function Hero() {
  return (
    <div className="mt-15 relative flex justify-between w-full bg-background text-text z-10 h-[calc(100vh-4rem)]">
      <div className="p-10 pr-0 pl-40 flex flex-col justify-center w-1/3 z-20 relative ">
      
        <h1
          className={`!text-5xl font-extrabold leading-tight ${montserrat.className}`}
        >
          <span className="bg-gradient-to-r from-accent to-transparent p-2 rounded-lg">
            Take Control
          </span>{" "}
          of Your Finances{" "}
          <span className="bg-gradient-to-l relative from-accent to-transparent p-1 rounded-lg">
            {" "}
            with Ease
            <div className="absolute -top-6 -right-6 rounded-full z-10">
              <Rocket className="size-10  " />
            </div>
          </span>
        </h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Simplify budgeting, track your spending, and reach your financial
          goals—all in one place.
        </p>

        <div className="mt-6">
          <Link href="/register">
            <button className="cursor-pointer p-3 bg-accent text-text rounded-lg hover:bg-accent/80 transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      <div className="h-full w-2/3 relative">
    
          <Image
          src="/HeroImage.jpg"
          alt="Description"
          fill={true}
        />
      
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background pointer-events-none from-10%"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background pointer-events-none  from-0% to-100%"></div>
      </div>
      <div className="absolute top-1/2 left-1 w-64 h-64 blur-[200px] bg-accent rounded-full z-10"></div>
      <div className="absolute top-1 left-1 w-64 h-64 blur-[200px] bg-red-200 rounded-full z-10"></div>
      <div className="absolute top-1/4 left-1/5 w-64 h-64 blur-[200px] bg-blue-400 rounded-full z-10"></div>
    </div>
  );
}
