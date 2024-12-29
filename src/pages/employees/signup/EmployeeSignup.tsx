import { useDispatch, useSelector } from "react-redux"
import { EmployeeSignUpTypes } from "../../../types/employee/EmployeeTypes"
import { AppDispatch, RootState } from "../../../store/store"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { empReset, setTempEmp } from "../../../reducers/employees/EmployeeReducers"
import { employee_signup_post } from "../../../reducers/employees/EmployeeApicalls"
import { toast } from "react-toastify"
import Emp_Otp from "./Emp_Otp"
import { useNavigate } from "react-router-dom"


const WorkerSignup = () => {
  const [showOtp,setShowOtp]=useState<boolean>(false)
  const [signup ,setSignup]=useState<EmployeeSignUpTypes>({
    username:'',
    email:"",
    phone:"",
    password:"",
    confirm_password:"",
    skills:"",
    experience:''
  })
  const [err,setError]=useState({
    username:'',
     email:'',
     phone:'',
     password:'',
     confirm_password:'',
     skills:'',
     experience:''
})
  const {username,email,phone,password,confirm_password,skills,experience}=signup
  const dispatch:AppDispatch=useDispatch()
  const {isSuccess,isError,message}=useSelector((state:RootState)=>state.employee)
  useEffect(()=>{
    if (isError) {
      console.log("employee singup error ",message);

      toast.error(message)
      return 
      
    }
    if (isSuccess) {
      dispatch(empReset())
      setShowOtp(true)
      
    }

    return ()=>{dispatch(empReset())}
  },[isError,isSuccess,message,dispatch])



const navigate=useNavigate()


const handleValidation=():boolean=>
  {
    let isValid:boolean=true;
    const newError={
        username:'',
        email:'',
        phone:'',
        password:'',
        confirm_password:'',
        skills:'',
        experience:''

    }
    if (username.trim()=="") {
        newError.username="username is required"
        isValid=false;

        
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
        newError.email="Invalid Email format"
        isValid=false
    }
    if(phone.trim()=="" || ! /^\d{10}$/.test(phone) )
        {
            newError.phone="Mobile number is must 10 digits"
            isValid=false
        }


        if (skills.trim()=="") {
          newError.skills="Skills Required"
          isValid=false
          
        }
        if (experience.trim()=="") {

          newError.experience="Experience is requied"
          
        }
        

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        


        
        if (!strongPasswordRegex.test(password)) {
            newError.password="Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
            isValid=false
            
            
        }
        if(password!==confirm_password)
    {
        newError.confirm_password="Password dosent match"
        isValid=false   
    }


    setError(newError)



    return isValid

}


const handleOnchange=(e:ChangeEvent<HTMLInputElement>)=>{
  const {name,value}=e.target
 
  setSignup((prev)=>(
    {
      ...prev,
      [name]:value

    }
  ))
}


const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  if (handleValidation()) {
    console.log("validate is true");
    
    console.log(signup);
    dispatch(setTempEmp(signup))
    dispatch(employee_signup_post(signup))


  }else{
    console.log(err);
    
    console.log("not validate");
    
  }
  }


 
  return (
    <>
    {showOtp ? <Emp_Otp/>: (

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 to-white">
          <div className="w-[95%] max-w-5xl flex flex-col md:flex-row rounded-2xl shadow-lg bg-white overflow-hidden">
            {/* Left Section */}
            <div
              className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-10 bg-cover bg-center relative"
              style={{
                backgroundImage: "url('/female-mechanic-working-shop-car.jpg')",
              }}
              >
              <div className="relative z-10 text-gray-800">
                <h1 className="text-4xl font-extrabold mb-4 text-white">
                  Welcome to <span className="text-green-500">Retro Worker Service</span>
                </h1>
                <p className="text-lg leading-relaxed text-white mb-6">
                  Join our platform to connect with clients and showcase your expertise.
                </p>
                <button
                  className="px-8 py-3 text-lg font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                >
                  Log In
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-green-50">
              <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-green-600 text-center mb-4">Worker Sign Up</h2>
                <p className="text-gray-600 text-center mb-6">
                  Join our community and grow your career!
                </p>
                <form className="space-y-6" onSubmit={handleSubmit} >
                  {[
                    
                   { name: "username", placeholder: "Username", value: username, error: err.username },
                   { name: "email", placeholder: "Email Address", value: email, error: err.email },
                   { name: "phone", placeholder: "Phone", value: phone, error: err.phone },
                   { name: "skills", placeholder: "skills", value: skills, error: err.skills },
                   { name: "experience", placeholder: "experience", value: experience, error: err.experience },
                   { name: "password", placeholder: "Password", value: password, error: err.password },
                   {
                     name: "confirm_password",
                     placeholder: "Confirm Password",
                     value: confirm_password,
                     error: err.confirm_password,
                   },
                  ].map(({ name, placeholder, value, error }) => (
                    <div key={name}>
                     <input
                       type={name.includes("password") ? "password" : "text"}
                       name={name}
                       placeholder={placeholder}
                       value={value}
                       onChange={handleOnchange}
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                     />
                     {error && <span className="text-red-500 text-sm">{error}</span>}
                   </div>
                 ))}

                  <button
                    type="submit"
                    className="w-full py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                    >
                    Sign Up
                  </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                  Already have an account?{" "}
                  <span
                    className="text-green-500 font-semibold cursor-pointer hover:underline"
                    onClick={()=>navigate('/employee/login')}
                    >
                    Log In
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

)}
        </>
      )}

      export default WorkerSignup
