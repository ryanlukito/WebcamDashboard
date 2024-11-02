import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const source = [
    {src: '/image/eye.png', width: 'w-[3.008vw]', height: 'h-[2.082vw]', text: 'WATCHING'},
    {src: '/image/archive.png', width: 'w-[2.969vw]', height: 'h-[2.969vw]', text: 'ARCHIVE'},
    {src: '/image/files.png', width: 'w-[2.5vw]', height: 'h-[2.969vw]', text: 'FILES'},
];

const NavBar = () => {
  return (
    <div className='w-[18.281vw] h-full flex flex-col bg-[#272741] text-white font-bold'> 
        <div className='mb-[3vw] text-[2.083vw] flex items-center'>
            <Image
                src="/image/cctv.png"
                alt="Ornament Background"
                width={10000}
                height={10000}
                className="w-[6.042vw] h-[6.042vw] object-cover"
            />
            <h1 className='ml-[0.5vw] mt-[2.5vw]'>Peeplytics</h1>
        </div>
        <div className='w-full h-[14.219vw] flex flex-col justify-between'>
            {source.map((client, index) => (
                <Link className='py-[1vw] px-[1.5vw] flex items-center hover:bg-[#1d1f32] mb-[1vw]' href='/' key={index}>
                    <Image
                        src={client.src}
                        alt="Ornament Background"
                        width={10000}
                        height={10000}
                        className={`${client.width} ${client.height} object-cover`}
                    />
                    <h1 className='ml-[1vw]'>{client.text}</h1>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default NavBar;
