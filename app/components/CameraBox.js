import React from 'react'

const CameraBox = () => {
  return (
    <div className='w-[54.167vw] h-[47.604vw] flex flex-col justify-between items-start'>
    <h1 className='font-bold text-white text-left text-[1.5vw]'>1. Ruang Depan</h1>
    <div className='w-full h-[29.635vw] bg-white rounded-[0.521vw] overflow-hidden'>
        <img
            src="http://localhost:5000/video_feed"
            alt="webcam feed"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    </div>
    <div className='w-[13.854vw] h-[13.385vw] bg-white rounded-[0.521vw]'>
        <h1 className='font-bold text-center text-[1.5vw]'>Counter</h1>
    </div>
</div>

  )
}

export default CameraBox