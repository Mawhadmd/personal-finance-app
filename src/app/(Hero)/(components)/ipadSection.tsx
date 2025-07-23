'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image';
import React from 'react'

export default function ipadSection() {
  
  return (
    <div className="flex relative w-full h-256 p-10 bg-gradient-to-r from-accent to-transparent via-40%  via-green-300 " id='free'>
        <div className='absolute z-10 bg-gradient-to-b from-background via-transparent to-background from-1% to-99% inset-0'></div>
       <motion.div className="relative w-full z-20 "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            variants={{
                visible: { opacity: 1, transform: 'translateY(0)' },
                hidden: { opacity: 0, transform: 'translateX(-60px)' }
            }}
       >
         <Image src={"/ipad.webp"} alt="ipad" fill={true} className='object-contain' />
       </motion.div>
       <motion.div className="w-1/3 h-full  p-10 flex flex-col justify-center z-20"
          initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 1 }}
      variants={{
   visible: { opacity: 1, transform: 'translateY(0)' },
                hidden: { opacity: 0, transform: 'translateX(-120px)' }
      }}
       >
         <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
         <p className="text-muted text-muted-foreground mb-4">
           Sign up for free and take control of your finances with our easy-to-use platform.
         </p>
         <Link href="/register">
           <button className="cursor-pointer p-3 bg-accent text-text rounded-lg hover:bg-accent/80 transition-colors">
             Get Started
           </button>
         </Link>
       </motion.div>
      </div>
  )
}
