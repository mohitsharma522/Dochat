import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers } from "../redux/user.slice.js"


const getOtherUsers = () => {
    let dispatch = useDispatch()
    let {otherData} = useSelector(state=>state.user)

    useEffect(() => {
       const fetchUser = async ()=>{
        try {
            let result = await axios.get(`${serverUrl}/api/user/others`,
            {withCredentials:true})
            dispatch(setOtherUsers(result.data))
            
        } catch (error) {
           console.log(error);
            
        }
       }
        
       fetchUser()

    }, [otherData])

}

export default getOtherUsers