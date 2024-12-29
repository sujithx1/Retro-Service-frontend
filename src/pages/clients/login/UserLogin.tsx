import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { toast } from "react-toastify";
import { reset } from "../../../reducers/users/UserReducers";
import { userLoginPost } from "../../../reducers/users/UserapiCalls";
import { UserLoginType } from "../../../types/clients/UsersTypes";
import GoogleLoginUser from "../../../components/client/google/GoogleLoginUser";

const UserLogin = () => {
  const { isError, isSuccess, message } = useSelector((state: RootState) => state.user);
  const [logindata,setLogindata]=useState<UserLoginType>({email:"",password:""})
  const [loginError,setloginError]=useState({
    emailerr:"",
    passworderr:"",
  })
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();


  useEffect(() => {
    if (isError) {
      toast.error(message);
      return;
    }
    if (isSuccess) {
      navigate("/home");
  
    }
    console.log("hai");
    
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, dispatch, navigate]);


  const {email,password}=logindata
  const handleOnchange=(e:ChangeEvent<HTMLInputElement>)=>{

   const {name,value}=e.target
    setLogindata((prev)=>({
      ...prev,
      [name]:value
    }))
  }
  const handleValidate=():boolean=>{
    let isValid=true
    const newError={
        emailerr:"",
        passworderr:""
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      newError.emailerr="Invalid Email"
      isValid=false
      
    }else
    {
      newError.emailerr=""
      isValid=true
    }
    

    function validatepass() {
      const capital=/[A-Z]/
    const small=/[a-z]/
    const splc=/[@$!%*?&]/
    const dig=/\d/
    if (password.trim()=="") {
      newError.passworderr="please enter password"
      return false


      
    }
    
   if (!capital.test(password)) {
    newError.passworderr="at least one uppercase letter"
    return false
   }
   if (!small.test(password)) {
    newError.passworderr="at least one lowercase letter"
    return false
    
   }
   if (!splc.test(password)) {
    newError.passworderr="one special character"
    return false
    
   }
   if (!dig.test(password)) {
    newError.passworderr="one digit"
    return false
    
   }
   if (password.length<8) {
    newError.passworderr="password must 8 letters"
    return false
    
   }

   return true
      
      
    }
    // const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // if (!strongPasswordRegex.test(password)) {
    //   newError.passworderr="Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
    //   isValid=false
      
    // }

    if (validatepass()) {
      newError.passworderr=""
      isValid=true
      
    }
    
    

    setloginError(newError)
    return isValid


  }

  
  const handlesubmit =(e:FormEvent)=>{

e.preventDefault()
if (handleValidate()) {
  
  dispatch(userLoginPost(logindata))
}
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 font-sans">
  {/* Main Container */}
  <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl">
    {/* Left Section */}
    <div
      className="hidden lg:flex flex-1 items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/Mobile Mechanic or a Repair Shop which is the best choice.jpeg')",
      }}
    >
      <div className="p-8 text-center text-white bg-opacity-40 rounded-lg">
        <h2 className="text-3xl font-bold mt-5">Welcome Back!</h2>
        <p className="text-lg mb-5">Log in to access your personalized dashboard.</p>
        <button
          type="button"
          className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>

    {/* Right Section */}
    <div className="flex flex-1 flex-col justify-center p-8">
      <h2 className="text-3xl font-semibold text-blue-600 text-center mb-6">Log In</h2>
      <form className="flex flex-col gap-4" onSubmit={handlesubmit}>
        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleOnchange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400">
            📧
          </span>
        </div>
        {loginError.emailerr && <span className="text-red-600 text-sm">{loginError.emailerr}</span>}

        {/* Password Input */}
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleOnchange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400">
            🔒
          </span>
        </div>
        {loginError.passworderr && (
          <span className="text-red-600 text-sm">{loginError.passworderr}</span>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Log In
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-gray-600 mt-4">
        Don't have an account?{" "}
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </span>
      </p>
      <div className="mt-4">
        <GoogleLoginUser />
      </div>
    </div>
  </div>
</div>

  );
};

export default UserLogin;
