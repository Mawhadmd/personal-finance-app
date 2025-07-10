'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
const NavBar = () => {
    const path = usePathname()
    console.log("Current path:", path);
    const paths = [
    ["/", "Dashboard"],
    ["/expenses", "Expenses"],
    ]
    return (
        <div>
             <nav className="flex h-screen flex-col p-2 bg-foreground/10 border-r border-foreground/20">
            {" "}
            <div className="text-white font-extrabold border-b">
              Personal Finance
            </div>
            <ul className="pt-2  w-full">
                {paths.map(([route, label]) => (
                    <Link href={route} key={route} className="w-full">
                    <li className={`${route == path? 'bg-green-200/80 text-neutral-800': ''} w-full text-center rounded-lg p-1`}>
                        {label}
                    </li>
                    </Link>
                )
                )}
           
              {/* TODO gray bg only if it's the selected page */}
            </ul>
          </nav>
        </div>
    );
}

export default NavBar;
