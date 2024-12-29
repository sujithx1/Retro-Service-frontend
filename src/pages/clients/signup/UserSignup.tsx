import { useNavigate } from "react-router-dom"
import { UserSignUpTypes } from "../../../types/clients/UsersTypes"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useDispatch, useSelector,  } from "react-redux"
import { AppDispatch, RootState,  } from "../../../store/store"
import { userSignupPost } from "../../../reducers/users/UserapiCalls"
import {  reset, setTempuser } from "../../../reducers/users/UserReducers"
import { toast } from "react-toastify"
import UserOtp from "./UserOtp"
const UserSignup = () => {
    const navigate=useNavigate()
    const [showOtp,setShowOtp]=useState<boolean>(false)
    const [signup ,setSignup]=useState<UserSignUpTypes>({
      username:'',
      email:"",
      phone:"",
      password:"",
      confirm_password:""
    })
    const {username,email,phone,password,confirm_password}=signup
    const [err,setError]=useState({
         username:'',
          email:'',
          phone:'',
          password:'',
          confirm_password:''
    })



    const {isError,message,isSuccess}=useSelector((state:RootState)=>state.user)
    const dispatch:AppDispatch=useDispatch()
    useEffect(()=>{
      if (isError) {
        console.log("user singup error ",message);
        toast.error(message)
        
       return
        
      }
      if (isSuccess) {
       
        dispatch(reset())
        setShowOtp(true)

      }


      return ()=>{ 
        dispatch(reset())
      }

    },[isError,message,dispatch,navigate,isSuccess])

    const handleValidation=():boolean=>
    {
      let isValid:boolean=true;
      const newError={
          username:'',
          email:'',
          phone:'',
          password:'',
          confirm_password:''

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
        dispatch(setTempuser(signup))
        dispatch(userSignupPost(signup))


      }else{
        console.log(err);
        
        console.log("not validate");
        
      }
      }


      return (
        <>

          
          {showOtp ? (
            <UserOtp />
          ) : (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-white">
            {/* Main Container */}
            <div className="w-[95%] max-w-5xl flex flex-col md:flex-row rounded-2xl shadow-lg bg-white overflow-hidden">
              {/* Left Section */}
              <div
                className="hidden md:flex md:w-1/2 flex-col justify-center items-start p-10 bg-cover bg-center relative"
                style={{
                  backgroundImage: "url('/Gallery of FBF Collezione _ N2B Arquitetura  - 11 (1).jpeg')",
                }}
              >
                {/* <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent "></div> */}
                <div className="relative z-10 text-gray-800">
                  <h1 className="text-4xl font-extrabold mb-4 text-white">
                    Welcome to <span className="text-blue-500">Retro Service</span>
                  </h1>
                  <p className="text-lg leading-relaxed text-white mb-6">
                    Seamlessly book car mechanics, access premium spare parts, and customize your car with ease.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Log In
                  </button>
                </div>
              </div>
          
              {/* Right Section */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-blue-50">
                <div className="w-full max-w-md">
                  <h2 className="text-3xl font-bold text-blue-600 text-center mb-4">Sign Up</h2>
                  <p className="text-gray-600 text-center mb-6">
                    Join us and enhance your car care experience!
                  </p>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Input Fields */}
                    {[
                      { name: "username", placeholder: "Username", value: username, error: err.username },
                      { name: "email", placeholder: "Email Address", value: email, error: err.email },
                      { name: "phone", placeholder: "Phone", value: phone, error: err.phone },
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
          
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                      Sign Up
                    </button>
                  </form>
                  <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="text-blue-500 font-semibold cursor-pointer hover:underline"
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
      );
    };

export default UserSignup
