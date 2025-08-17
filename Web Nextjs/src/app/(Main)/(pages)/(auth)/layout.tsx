import Link from 'next/link';
import React, { ReactNode } from 'react';

const Layout = ({children}: {children: ReactNode}) => {
    return (
        <div className='flex flex-col space-y-2.5 justify-center items-center h-screen'>
           <Link href="/"> <h1 className='text-3xl font-bold absolute top-0 left-0 p-3'>PFinance</h1></Link>
            {children}
        </div>
    );
}

export default Layout;
