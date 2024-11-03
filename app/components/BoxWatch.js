import React from 'react'
import Link from 'next/link'

const BoxWatch = ({ children }) => {
  return (
    <Link href="/" className='w-64 h-16 text-white bg-[#282843] rounded-lg text-lg py-4 px-4 mb-8 flex items-center hover:bg-[#4a4a6c]'>
      <h1 className="text-base">{children}</h1>
    </Link>
  )
}

export default BoxWatch
