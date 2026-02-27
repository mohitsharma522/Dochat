import React, { useEffect, useRef, useState } from 'react'
import { IoArrowBackOutline } from "react-icons/io5";
import dp from "../assets/images.jpg"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/user.slice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { LuSpeech } from "react-icons/lu";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from "axios";
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice.js';


function MessageArea() {
  let { selectedUser, userData, socket } = useSelector(state=>state.user)
  let dispatch = useDispatch()
  let [showPicker, setShowPicker] = useState(false)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let { messages } = useSelector(state => state.message)


  // emoji 
  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji)
    setShowPicker(false)
  }
  // speech to text 
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const Recognition = new speechRecognition();
  Recognition.onresult = (e) => {
    const currentIndex = e.resultIndex
    const VoiceText = e.results[currentIndex][0].transcript;
    setInput(prev => prev + " " + VoiceText)
  }
  // click karte hi call karta ha 
  const startListening = () => {
    Recognition.start();
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))

  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if(input.length == 0 && backendImage == null){
      return
    }
    try {
      let formData = new FormData()
      formData.append("message", input)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData,
        { withCredentials: true })
      dispatch(setMessages([...messages, result.data]));
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]))

    })
    return ()=> socket.off("newMessage")

  }, [messages, setMessages])

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-slate-300 border-l-2 border-gray-400`}>
      {selectedUser &&
        <div className='w-full h-[100vh] flex flex-col '>
          <div className='w-full h-[80px] bg-[#219cb8] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px] gap-[20px] '>
            <div className=' cursor-pointer ' onClick={() => dispatch(setSelectedUser(null))}>
              <IoArrowBackOutline className='h-[30px] w-[50px] text-white' />
            </div>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden bg-white flex items-center justify-center shadow-gray-500 shadow-lg  '>
              <img src={selectedUser?.image || dp} alt="" className='h-[100%] ' />
            </div>
            <h1 className='text-white font-semibold text-[20px] '>{selectedUser?.name || "user"}</h1>
          </div>
          <div className='w-full h-[76%] flex flex-col py-[30px] px-[20px] overflow-auto gap-[10px] '>
            {showPicker &&
              <div className='absolute bottom-[120px] left-[20px] '>
                <EmojiPicker width={250} height={350} className='shadow-lg z-[100] ' onEmojiClick={onEmojiClick} />
              </div>
            }

            {messages?.filter(
                (mess) =>
                  mess.sender === selectedUser._id ||
                  mess.receiver === selectedUser._id
              )
              .map((mess) =>
                mess.sender === userData._id ? (
                  <SenderMessage
                    image={mess.image}
                    message={mess.message}
                  />
                ) : (
                  <ReceiverMessage
                    image={mess.image}
                    message={mess.message}
                  />
                )
              )}

          </div>
        </div>

      }

      {!selectedUser &&
        <div className='w-full h-full flex flex-col justify-center items-center gap-[10px] '>
          <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 font-bold text-[50px] '> Welcome To Dochat </h1>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 font-semibold text-[20px]'> Chat With Friends </span>
        </div>
      }

      {selectedUser && <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center '>

        <img src={frontendImage} alt="" className='w-[100px] absolute bottom-[100px] right-[20%]  shadow-gray-400 shadow-lg rounded-lg  ' />

        <form className='w-[95%] lg:w-[70%] h-[60px] bg-[#39b7c5] rounded-full shadow-gray-400 shadow-lg  flex items-center gap-[15px] px-[20px] relative ' onSubmit={handleSendMessage}>

          <div onClick={() => setShowPicker(prev => !prev)}>
            <RiEmojiStickerLine className='w-[25px] h-[25px] text-[white] text-[25px] cursor-pointer text' />
          </div>

          <input type="text" placeholder='Message' className='w-full h-full border-0 px-[10px] outline-none text-[19px] text-white bg-transparent placeholder-white ' onChange={(e) => setInput(e.target.value)} value={input} />

          <input type="file" accept='image/*' hidden ref={image} onChange={handleImage} />
          <div onClick={() => image.current.click()} >
            <FaImages className='w-[25px] h-[25px] text-[white] text-[25px] cursor-pointer ' />
          </div>

          <div onClick={startListening} >
            <LuSpeech className='w-[25px] h-[25px] text-[white] text-[25px] cursor-pointer ' />
          </div>
          
          {(input.length > 0 || backendImage!=null) && (<button>
              <RiSendPlane2Fill className='w-[25px] h-[25px] text-[white] text-[25px] cursor-pointer ' />
            </button>)
          }
          

        </form>
      </div>
      }

    </div>

  )
}

export default MessageArea
