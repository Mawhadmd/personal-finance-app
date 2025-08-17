import React from 'react'

export default function ContactUs() {
  return (
    <div className='flex justify-around items-center p-10 relative' id='contact'>
    
        <div>
            <h2 className='!text-7xl'>Contact Us</h2>
        <p className='text-muted'>If you have any questions or feedback, feel free to reach out!</p>
        </div>
        <form className='flex flex-col max-w-md'>
            <label className='mb-2'>Name:</label>
            <input type="text" className='p-2 mb-4 border border-border rounded' placeholder='Your Name' required />
            <label className='mb-2'>Email:</label>
            <input type="email" className='p-2 mb-4 border border-border rounded' placeholder='Your Email' required />
            <label className='mb-2'>Message:</label>
            <textarea className='p-2 mb-4 border border-border rounded' placeholder='Your Message' rows={4} required></textarea>
            <button type="submit" className='p-3 bg-accent text-text rounded-lg hover:bg-accent/80 transition-colors cursor-pointer'>Send Message</button>
        <p className='text-muted mt-2'>We will get back to you as soon as possible.</p>
        </form>
    </div>
  )
}
