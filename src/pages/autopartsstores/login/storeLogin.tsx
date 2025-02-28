import {  useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch,  } from "../../../store/store";
import { useDispatch,  } from "react-redux";
import {  storeLoginPost } from "../../../reducers/autopartsstore/autopartsStoreapicalls";
import { ToastMsg } from "../../../types/admin/admintypes";
import ToastAlert from "../../../components/alert/ToastAlert";

const StoreLogin = () => {
  const [storeId, setStoreId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch:AppDispatch=useDispatch()
  const [error,setError]=useState<ToastMsg>({
    action:false,
    message:'',
    type:'idle'
  })
  const navigate=useNavigate()
// const {isError,isSuccess,message,store}=useSelector((state:RootState)=>state.store)

 



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { storeId, password });
const data={
    storeId,
    password
}
    dispatch(storeLoginPost(data)).unwrap()
    .then(() => {
      navigate('/store/home')

      
    }).catch((err) => {
      setError({
        action:true,
        message:err.message,
        type:'error'
    })
    return
      
    });
    


  };

  return (
    <>
    {error.action &&
          <ToastAlert message={error.message} onClose={()=>setError((prev)=>({...prev,action:false}))} type={error.type as "info"|"success"|"error"} />

    }
    
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      {/* Animated Floating Icons */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <FloatingIcons />
      </motion.div>

      {/* Animated Login Box */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Store Login
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative"
            >
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="storeId"
              className="w-full px-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex justify-between items-center text-sm text-gray-600"
            >
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </motion.div>

          {/* Animated Login Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Login
          </motion.button>
        </form>

        {/* Register Link */}
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center text-gray-600 text-sm mt-4"
        >
          Don't have an account?{" "}
          <Link to="/store/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </motion.p>
      </motion.div>
    </div>
</>
  );
};

// Floating Icons Animation Component
const FloatingIcons = () => {
  const icons = [
    "🛒", "📦", "💳", "🏪", "🛍️"
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: 1 }}
          transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-4xl"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
};

export default StoreLogin;
