import { useSelector } from "react-redux"
import { RootState } from "../../../store/store"
import { useNavigate } from "react-router-dom"
import { FC, ReactNode, useEffect } from "react"
interface Props{
    children:ReactNode
}
const Protect:FC<Props> = ({children}) => {

    const {admin}=useSelector((state:RootState)=>state.admin)
    const navigate=useNavigate()
    useEffect(()=>{

        if (!admin) {
            navigate('/admin/login')
            
        }
    },[admin,navigate])

    if (!admin) {
        return null
        
    }
  return (
    <>
   
   {children}

    
    </>
  )
}

export default Protect