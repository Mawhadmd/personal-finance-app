import React from 'react'
import HeroNav from './(components)/HeroNav'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div  className='flex flex-col h-screen w-full'>
      <HeroNav />
      {children}
    </div>
  )
}
