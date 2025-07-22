import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='h-3 w-full '>
        <p className='mx-auto w-fit bg-foreground/50 text-muted'>Designed and Developed By <Link className='text-accent font-bold' href={'https://moawad.dev'}>Mohammed Awad</Link></p>
    </div>
  )
}
