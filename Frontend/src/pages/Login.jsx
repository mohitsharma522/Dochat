import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/user.slice'


function Login() {
  const navigate = useNavigate()
  let [show, setShow] = useState(false)
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")
  let dispatch = useDispatch()
  

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
        password
      }, { withCredentials: true })
      console.log(result)
      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      navigate("/")
      setEmail("")
      setPassword("")
      setLoading(false)
      setErr("")

    } catch (error) {
      console.log(error);
      setLoading(false)
      setErr(error.response.data.message)

    }
  }

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center '>
      <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[10px] '>
        <div className='w-full h-[200px] bg-[#39c6df] rounded-b-[40%] shadow-gray-400 shadow-lg flex justify-center items-center'>
          <h1 className='text-gray-500 font-bold text-[30px]'>Login to <span className='text-white'>Dochat</span></h1>
        </div>
        <form className='w-full flex flex-col justify-center items-center gap-[30px] ' onSubmit={handleLogin}>
          <input type="email" placeholder='email' className='w-[90%] h-[50px] outline-none border-2 border-[#31bed4] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-700 text-[19px] ' onChange={(e) => setEmail(e.target.value)} value={email} />
          <div className='w-[90%] h-[50px] border-2 border-[#31bed4] overflow-hidden rounded-lg  shadow-gray-400 shadow-lg relative '>
            <input type={`${show ? "text" : "password"}`} placeholder='password' className='w-full h-full outline-none  px-[20px] py-[10px] bg-white text-gray-700 text-[19px] ' onChange={(e) => setPassword(e.target.value)} value={password} />
            <span className=' absolute top-[10px] right-[20px] text-[15px] text-[#44aac3] cursor-pointer font-semibold ' onClick={() => setShow(prev => !prev)}>{`${show ? "hidden" : "show"}`}</span>
          </div>
          {err && <p className='text-red-500'>{"*" + err}</p>}
          <button className='px-[20px] py-[10px] bg-[#3db2ca] rounded-2xl font-semibold text-[20px] w-[150px] mt-[10px] hover:shadow-inner hover:bg-[#0fa0b0] shadow-gray-400 shadow-lg text-white ' disabled={loading}> {loading? "Loading...":"Login"} </button>
          <p className='cursor-pointer' onClick={() => navigate("/signup")}> Want To Create New Account? <span className='text-[#41adc6] font-bold '>signUp</span></p>

        </form>
      </div>
    </div>
  )
}

export default Login
