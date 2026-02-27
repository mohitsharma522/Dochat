import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import dp from "../assets/images.jpg";
import { IoSearchSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from "../main"
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/user.slice.js';
import { useNavigate } from 'react-router-dom';


function SideBar() {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user)
  let [search, setSearch] = useState(false)
  let [input, setInput] = useState("")
  let dispatch = useDispatch()
  let navigate = useNavigate()

  let handleLogOut = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`,
        { withCredentials: true })
      dispatch(setUserData(null))
      dispatch(setOtherUsers(null))
      navigate("/login")

    } catch (error) {
      console.log(error);

    }
  }

  let handleSearch = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true })
      dispatch(setSearchData(result.data))
      console.log(result);


    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    if (input) {
      handleSearch()

    }

  }, [input])

  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-300 ${!selectedUser ? "block" : "hidden"} relative`} >
      <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center mt-[10px] bg-[#39c6df] text-gray-700 shadow-gray-500 shadow-lg fixed bottom-[20px] left-[10px] ' on onClick={handleLogOut} >
        <RiLogoutCircleLine className='w-[25px] h-[25px] cursor-pointer ' />
      </div>

      {input.length > 0 &&
        <div className='flex items-center flex-col  w-full h-[500px] overflow-y-auto gap-[10px] absolute top-[250px] z-[150] bg-[white] pt-[20px] mt-[10px] shadow-lg '>
          {searchData?.map((user) => (
            <div className='w-[95%] h-[70px] flex  items-center gap-[20px] bg-white hover:bg-[#88d6ec] cursor-pointer border-b-2 border-gray-500 px-[10px] ' onClick={() => {dispatch(setSelectedUser(user)), setInput(""), setSearch(false)}}>
              <div className='relative rounded-full bg-white flex items-center justify-center  '>
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center '>
                  <img src={user.image || dp} alt="" className='h-[100%] ' />
                  {onlineUsers?.includes(user._id) &&
                    <span className='w-[13px] h-[13px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#56e356] '></span>
                  }
                </div>
              </div>
              <h1 className='text-gray-800 font-semibold text-[20px] '>{user.name || user.userName}</h1>
            </div>


          ))}
        </div>
      }

      <div className='w-full h-[300px] bg-[#39c6df] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px] gap-[10px] '>
        <h1 className='text-white font-bold text-[30px] '>Dochat</h1>
        <div className='w-full flex justify-between items-center '>
          <h1 className='text-gray-800 font-bold text-[25px] '>Hii, {userData.name || "user"}</h1>
          <div className='w-[60px] h-[60px] rounded-full overflow-hidden bg-white flex items-center justify-center shadow-gray-500 shadow-lg cursor-pointer ' onClick={() => navigate("/profile")}>
            <img src={userData.image || dp} alt="" className='h-[100%] ' />
          </div>
        </div>
        <div className='w-full flex items-center gap-[20px] overflow-y-auto py-[15px] '>
          {!search && <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center mt-[10px] bg-white shadow-gray-500 shadow-lg ' onClick={() => setSearch(true)}>
            <IoSearchSharp className='w-[25px] h-[25px] cursor-pointer ' />
          </div>}

          {search &&
            <form className='w-full h-[60px] bg-white shadow-gray-400 flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative '>
              <IoSearchSharp className='w-[25px] h-[25px] ' />
              <input type="text" placeholder='search users...' className='w-full h-full p-[10px] text-[17px] outline-none border-none ' onChange={(e) => setInput(e.target.value)} value={input} />
              <RxCross2 className='w-[25px] h-[25px] cursor-pointer ' onClick={() => setSearch(false)} />
            </form>
          }

          {!search && otherUsers?.map((user) => (
            onlineUsers?.includes(user._id) &&
            <div className='relative rounded-full bg-white flex items-center justify-center mt-[10px] shadow-gray-500 shadow-lg cursor-pointer ' onClick={() => dispatch(setSelectedUser(user))}>
              <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center '>
                <img src={user.image || dp} alt="" className='h-[100%] ' />
                <span className='w-[13px] h-[13px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#56e356] shadow-gray-500 shadow-md '></span>
              </div>
            </div>
          ))
          }
        </div>
      </div>

      <div className='w-full h-[52%] overflow-auto flex flex-col items-center gap-[20px] mt-[20px] '>
        {otherUsers?.map((user) => (
          <div className='w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white shadow-gray-400 shadow-lg rounded-full hover:bg-[#88d6ec] cursor-pointer ' onClick={() => dispatch(setSelectedUser(user))}>
            <div className='relative rounded-full bg-white flex items-center justify-center shadow-gray-500 shadow-lg  '>
              <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center '>
                <img src={user.image || dp} alt="" className='h-[100%] ' />
                {onlineUsers?.includes(user._id) &&
                  <span className='w-[13px] h-[13px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#56e356] shadow-gray-500 shadow-md '></span>
                }
              </div>
            </div>
            <h1 className='text-gray-800 font-semibold text-[20px] '>{user.name || user.userName}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
