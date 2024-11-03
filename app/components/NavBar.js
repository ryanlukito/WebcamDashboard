import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const source = [
    {src: '/image/eye.png', width: 'w-6', text: 'Watching'},
    {src: '/image/archive.png', width: 'w-6', text: 'History'},
];

const NavBar = () => {
  return (
    <div className='w-72 h-full flex flex-col bg-[#272741] text-white font-bold'> 
        <div className='mb-12 flex items-center'>
            <Image
                src="/image/cctv.png"
                alt="Ornament Background"
                width={10000}
                height={10000}
                className="w-16 h-16 object-cover"
            />
            <h1 className='ml-2 mt-8 text-2xl'>PeeplyticsAI</h1>
        </div>
        <div className='w-full h-60 flex flex-col'>
            {source.map((client, index) => (
                <Link className='py-2 px-6 flex items-center hover:bg-[#1d1f32]' href='/' key={index}>
                    <Image
                        src={client.src}
                        alt="Ornament Background"
                        width={10000}
                        height={10000}
                        className={`${client.width} ${client.height} object-cover`}
                    />
                    <h1 className='ml-4 text-base'>{client.text}</h1>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default NavBar;
