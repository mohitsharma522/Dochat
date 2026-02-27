import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setMessages } from '../redux/messageSlice.js'

function getMessages() {
   const { selectedUser, userData } = useSelector(state=>state.user)
   const dispatch = useDispatch()
   useEffect(() => {
      const fetchMessages = async () => {
         try {
            let result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`,
            { withCredentials: true })
            dispatch(setMessages(result.data))

         } catch (error) {
            console.log(error)
         }
      }

      fetchMessages()

   }, [selectedUser, userData])
}

export default getMessages
