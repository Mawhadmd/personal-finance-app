'use client'
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'

export default function Card({Content, title, icon, iconBg}: {Content: string, title: string, icon: React.ReactNode, iconBg: string}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const divref = ref.current
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);
    divref?.addEventListener('mouseenter', handleMouseEnter);
    divref?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      divref?.removeEventListener('mouseenter', handleMouseEnter);
      divref?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  return (
     <div ref={ref} className="border border-border relative bg-foreground text-text p-8 flex flex-col items-center justify-center size-80 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center h-full">
        {icon && <div className={`mb-4 ${iconBg} rounded-lg p-2 h-2/9`}>{icon}</div>}
        <h2 className="text-3xl font-bold mb-4 h-2/9">{title}</h2>
        <p className=" text-muted text-muted-foreground text-center max-w-2xl  h-5/9">
          {Content}
        </p>
      </div>
    <AnimatePresence>
      {hovered && (
        <motion.div
          className='absolute -z-1 bg-accent inset-0 blur-md '
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </AnimatePresence>
    </div>
  )
}
