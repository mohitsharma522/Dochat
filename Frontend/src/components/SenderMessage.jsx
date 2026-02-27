import React, { useEffect, useRef } from 'react'
import dp from "../assets/images.jpg"
import { useSelector } from 'react-redux'

function SenderMessage({ image, message }) {
  let scroll = useRef()
  let {userData} = useSelector(state=>state.user)


  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" })

  }, [image, message])

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-start gap-[10px] '>

      <div ref={scroll} className='w-fit max-w-[500px] text-white text-[20px] px-[20px] py-[10px] bg-[#39b7c5] rounded-tr-none rounded-bl-none rounded-2xl shadow-gray-400 shadow-lg 
       relative right-0 ml-auto gap-[10px] flex flex-col '>
        {image && <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll} />}
        {message && <span>{message}</span>}
      </div>
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden bg-white flex items-center justify-center shadow-gray-500 shadow-lg cursor-pointer '>
        <img src={userData.image || dp} alt="" className='h-[100%] ' />
      </div>

    </div>
  )
}

export default SenderMessage
