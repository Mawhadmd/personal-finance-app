import { Quote } from 'lucide-react'
import React from 'react'

export default function TestimonialCard({ Testimonial, customerName }: { Testimonial: string, customerName: string }) {
  return (
    <div className="bg-foreground relative p-6  shadow-lg max-w-md mx-auto text-center w-120 h-60 justify-center items-center flex flex-col rounded-full">
        <Quote className='size-15 absolute top-0  m-4 text-accent' />
        <div className='mt-13'>
            <p className='flex text-2xl gap-2'>{Testimonial}</p>
        <p className='text-muted'>- {customerName}</p>
        </div>
    </div>
  )
}
