import LogoutButton from '@/components/logoutButton';
import NavBar from '@/components/NavBar';
import React from 'react';

const Layout = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
     <div className="flex  ">
         <NavBar logoutButton={<LogoutButton/>}/>
          <div className="p-10 flex-1">
            {children}
          </div>
        </div>
  );
}

export default Layout;
