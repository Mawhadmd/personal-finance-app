import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className=' w-full py-1 '>
        <p className='mx-auto w-fit text-muted'>Designed and Developed By <Link className='text-accent font-bold' href={'https://moawad.dev'}>Mohammed Awad</Link></p>
    </div>
  )
}
