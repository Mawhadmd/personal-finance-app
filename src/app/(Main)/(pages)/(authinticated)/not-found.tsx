import { CircleOff } from 'lucide-react'
import React from 'react'

export default function Custom404() {
  return (
   <div className="h-full space-x-2 flex items-center justify-center">
      <CircleOff className="size-6 text-red-500" />
      <p className="text-red-500">404 - Page Not Found</p>
    </div>
  )
}
