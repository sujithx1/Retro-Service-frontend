import React, { useState, useEffect } from "react";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { saveEmail } from "../../../reducers/users/UserReducers";
import { Emp_post_Forgot_password_OTP, Employee_post_forgot_password_otp_check } from "../../../reducers/employees/EmployeeApicalls";

const Emp_forgotPass_otp = () => {
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [emailError, setEmailError] = useState<string>("");


  const dispatch:AppDispatch=useDispatch()
  const navigate=useNavigate()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    console.log("OTP sent to:", email);
    dispatch(Emp_post_Forgot_password_OTP(email)).unwrap()

    
        .then(()=>{

          toast.success("check your Email")
          
    setOtpSent(true);
    setTimer(60); // Start the 60-second timer
        }
        )
        

    .catch((err)=>toast.error(err.message))


  };

  const handleCheckOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("OTP entered:", otp);
    dispatch(Employee_post_forgot_password_otp_check(otp)).unwrap()
    .then(()=>{
        // toast.success("success")
        dispatch(saveEmail(email))
        navigate('/forgot-password')
    })
    .catch((err)=>toast.error(err))
    // Add OTP verification logic here
  };

  useEffect(() => {
    let interval:number;
    if (timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timer === 0) {
      setOtpSent(false); // Re-enable the "Send OTP" button
      setTimer(null);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center">
          Enter your email and verify your OTP to reset your password.
        </p>
        {/* Email and Send OTP */}
        <form onSubmit={handleSendOtp} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`flex-grow px-4 py-2 border ${
              emailError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } rounded-md focus:outline-none`}
            placeholder="Enter your email"
            required
            disabled={otpSent} // Disable email input if OTP is sent
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-md transition ${
              otpSent
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={otpSent} // Disable the button after OTP is sent
          >
            {otpSent ? (timer ? `Retry in ${timer}s` : "OTP Sent") : "Send OTP"}
          </button>
        </form>
        {emailError && (
          <p className="text-red-500 text-sm mt-1">{emailError}</p>
        )}
        {/* OTP and Check OTP */}
        {otpSent && (
          <form onSubmit={handleCheckOtp} className="flex gap-2">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter OTP"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Check OTP
            </button>
          </form>
        )}
        {/* Back to Login */}
        <p className="text-center text-gray-600">
          Remember your password?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Emp_forgotPass_otp;
