import { FormEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { AppDispatch, RootState } from "../../../store/store"
import { toast } from "react-toastify"
import { clearTempEmp } from "../../../reducers/employees/EmployeeReducers"
import { employee_resend_otp, Employee_Send_otp } from "../../../reducers/employees/EmployeeApicalls"

const Emp_Otp = () => {
    const [otpTimer,setOtpTimer]=useState<number>(60)
    const [afterTimer,setAfterTimer]=useState<boolean>(false)
    const [enterOtp,setEnterOtp]=useState("")
    // const [resendOtp,setResendOtp]=useState(false)
    const navigate=useNavigate()
  const dispatch:AppDispatch=useDispatch()
  const {isError,isSuccess,message,tempuser}=useSelector((state:RootState)=>state.employee)
    useEffect(()=>{
      
      if (isError) {

        toast.error(message)
        return
      }
      if (isSuccess) {
        toast.success("welcome...")
        dispatch(clearTempEmp())
        navigate('/employee/login')
        
        return
        
      }
       if (otpTimer>0) {
        const intreval=  setInterval(() => {
              setOtpTimer((prev)=>prev-1)
              
          }, 1000);
          
          return ()=>{
              
              clearInterval(intreval)

          }
      }
      setAfterTimer(true)



    },[setAfterTimer,otpTimer,dispatch,isSuccess,isError,message,navigate])


        const handleSubmitOtp=(e:FormEvent)=>{
          e.preventDefault()
         
          dispatch(Employee_Send_otp(enterOtp))
        


        }

        const handleResendOtp=()=>{
          dispatch(employee_resend_otp(tempuser))
          .unwrap()
          .then(()=>{
            // setResendOtp(true)
            // if (resendOtp) {
              setOtpTimer(60)
              setAfterTimer(false)
              
            // }

          })
          .catch(()=>setOtpTimer(0))
         
          
          
         
         
          

        }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Verify Your OTP</h2>
                <p className="text-sm text-gray-600">
                  Enter the OTP sent to your registered email/phone number.
                </p>
              </div>
          
              <form className="space-y-4">
                <div className="text-left">
                  <label htmlFor="otpInput" className="block text-sm font-medium text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otpInput"
                    onChange={(e)=>setEnterOtp(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter OTP"
                    maxLength={6}
                  />
                </div>
          
                <button
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
    afterTimer ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400'
  }`"
                onClick={handleSubmitOtp}
                disabled={afterTimer}
                >
                  Verify OTP
                </button>
          
                <div className="text-center text-sm text-gray-600 mt-4">
                  Time Remaining: <span className="text-red-500 font-semibold">{otpTimer}</span>
                </div >
                {
                    afterTimer &&
                    (<div className="text-center text-sm text-red-600 font-semibold" >
                    Time Expired
                    

                </div>)
                }
          { afterTimer &&
               ( <button
                  type="button"
                  className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>)}
              </form>
            </div>
          </div>
          
  )
}

export default Emp_Otp