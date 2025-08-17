
import NavBar from '@/app/(Main)/(pages)/(authinticated)/components/NavBar';
import React from 'react';

const Layout = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
     <div className="flex max-h-screen h-screen ">
         <NavBar />
          <div className="p-4  h-[calc(100vh-2rem)]">
            {children}
          </div>
        </div>
  );
}

export default Layout;
