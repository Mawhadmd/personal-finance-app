import Link from "next/link";
import React from "react";
import HeroNav from "./(components)/HeroNav";
import Image from "next/image";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function Hero() {
  return (
    <div className="relative h-full flex justify-between w-full bg-background text-text z-10">
      <div className="p-10 flex flex-col justify-center  w-1/3 z-20">
        <h1
          className={`!text-5xl font-extrabold leading-tight ${montserrat.className}`}
        >
          <span className="bg-gradient-to-r from-accent to-transparent p-2 rounded-lg">Take Control</span> of Your Finances <span className="bg-gradient-to-l from-accent to-transparent p-1 rounded-lg"> with Ease</span>
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
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background pointer-events-none from-10%"></div>
      </div>
      <div className="absolute top-1/2 left-1 w-64 h-64 blur-[200px] bg-accent rounded-full z-10"></div>
      <div className="absolute top-1 left-1 w-64 h-64 blur-[200px] bg-red-200 rounded-full z-10"></div>
      <div className="absolute top-1/4 left-1/5 w-64 h-64 blur-[200px] bg-blue-400 rounded-full z-10"></div>
    </div>
  );
}
