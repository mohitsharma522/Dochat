import React, { useEffect, useRef } from 'react'
import dp from "../assets/images.jpg"
import { useSelector } from 'react-redux'

function ReceiverMessage({ image, message }) {
  let scroll = useRef()
  let {selectedUser} = useSelector(state=>state.user)

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" })

  }, [message, image])

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-start gap-[10px] '>

      <div className='w-[40px] h-[40px] rounded-full overflow-hidden bg-white flex items-center justify-center shadow-gray-500 shadow-lg cursor-pointer '>
        <img src={selectedUser.image || dp} alt="" className='h-[100%] ' />
      </div>

      <div ref={scroll} className='w-fit max-w-[500px] text-white text-[20px] px-[20px] py-[10px] bg-[#39c6df] rounded-tl-none rounded-br-none rounded-2xl shadow-gray-400 shadow-lg 
        relative left-0 gap-[10px] flex flex-col '>
        {image && <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll} />}
        {message && <span>{message}</span>}
      </div>

    </div>
  )
}

export default ReceiverMessage
