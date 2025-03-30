import { useDispatch, useSelector } from "react-redux"
import { EmployeeSignUpTypes } from "../../../types/employee/EmployeeTypes"
import { AppDispatch, RootState } from "../../../store/store"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { empReset, setTempEmp } from "../../../reducers/employees/EmployeeReducers"
import { employee_signup_post } from "../../../reducers/employees/EmployeeApicalls"
import { toast } from "react-toastify"
import Emp_Otp from "./Emp_Otp"
import { useNavigate } from "react-router-dom"
import axios from "axios"


const WorkerSignup = () => {
  const [idFile, setIdFile] = useState<File | null>(null);

  const [showOtp,setShowOtp]=useState<boolean>(false)
  const [signup ,setSignup]=useState<EmployeeSignUpTypes>({
    username:'',
    email:"",
    phone:"",
    password:"",
    confirm_password:"",
    skills:"",
    experience:'',
    proof:""
  })
  const [err,setError]=useState({
    username:'',
     email:'',
     phone:'',
     password:'',
     confirm_password:'',
     skills:'',
     experience:'',
     idFile: ''

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
        experience:'',
        idFile: ''


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
    if (!idFile) {
      newError.idFile = "Valid ID document is required";
      isValid = false;
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


const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setIdFile(e.target.files[0]);
  }
};



const CLOUDINARY_URL = import.meta.env.VITE_CLOUDNARY_URL;

const UPLOAD_PRESET = "Mechanic_Proof";

const uploadImage = async (idFile: File | null): Promise<string | null> => {
  if (!idFile) {
    toast.error("Please add a valid proof");
    return null;
  }

  const formData = new FormData();
  formData.append("file", idFile);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData);

    if (response.data.secure_url) {
      console.log(response.data)
      
      return response.data.secure_url as string;
    } else {
      toast.error("Upload failed. No image URL received.");
      return null;
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Image not uploaded");
    return null;
  }
};


const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!handleValidation()) {
    console.log("Form validation failed:", err);
    return;
  }

  const proofUrl = await uploadImage(idFile);
  
  if (!proofUrl) {
    console.log("Image upload failed");
    return;
  }

  setSignup((prev) => ({
    ...prev,
    proof: proofUrl, 
  }));

  const updatedSignup = { ...signup, proof: proofUrl };
  dispatch(setTempEmp(updatedSignup));
  dispatch(employee_signup_post(updatedSignup));
};




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


<div className="mb-4">
  <label className="block text-gray-700 font-semibold mb-2">Upload ID Document</label>
  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition">
    <input
      type="file"
      onChange={handleFileChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      accept=".pdf,.jpg,.png,.jpeg"
    />
    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16v5h10v-5m-5-14v14m-3-3h6" />
    </svg>
    <p className="text-gray-600 text-sm">Drag & drop or click to upload</p>
    {idFile && (
      <p className="mt-2 text-green-600 font-medium text-sm">{idFile.name}</p>
    )}
  </div>
  {err.idFile && <span className="text-red-500 text-sm">{err.idFile}</span>}
</div>


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
