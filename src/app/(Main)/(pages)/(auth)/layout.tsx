import React, { ReactNode } from 'react';

const Layout = ({children}: {children: ReactNode}) => {
    return (
        <div className='flex flex-col space-y-2.5 justify-center items-center h-screen'>
            {children}
        </div>
    );
}

export default Layout;
