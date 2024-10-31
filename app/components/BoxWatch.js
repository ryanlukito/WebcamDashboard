import React from 'react'
import Link from 'next/link'

const BoxWatch = ({children}) => {
  return (
    <Link href="/" className='w-[21.198vw] h-[4.115vw] text-white bg-[#282843] rounded-[1.042vw] text-[1.563vw] py-[2vw] px-[1vw] mb-[2vw] flex items-center hover:bg-[#4a4a6c]'>
        <h1 className="text-[1.563vw]">{children}</h1>
    </Link>
  )
}

export default BoxWatch
