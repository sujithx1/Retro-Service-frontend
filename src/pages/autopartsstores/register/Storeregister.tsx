import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { storeRegister_types } from "../../../types/storetypes";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Store_put_Location, StoreRegister } from "../../../reducers/autopartsstore/autopartsStoreapicalls";
import { ToastMsg } from "../../../types/admin/admintypes";
import ToastAlert from "../../../components/alert/ToastAlert";
import { setTempstore } from "../../../reducers/autopartsstore/autopartsstorereducerse";
import StoreOtp from "./StoreOtp";
import { Locationuser_types } from "../../../types/clients/UsersTypes";
import { useNavigate } from "react-router-dom";

const StoreRegistration = () => {
  const [store, setStore] = useState<storeRegister_types>({
    name: "",
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
const dispatch:AppDispatch=useDispatch()
const [showOtp,setShowotp]=useState(false)
const navigate=useNavigate()
const [showMsg,setShowMsg]=useState<ToastMsg>({
  action:false,
  type:'idle',
  message:''

})
const {localstore}=useSelector((state:RootState)=>state.store)

    const [location, setLocation] = useState<Locationuser_types | null>(null);
     
      useEffect(() => {
        if (!navigator.geolocation) {
          console.log("Geolocation is not supported by your browser");
          return;
        }
    
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
    
            try {
              // Fetch address using OpenStreetMap's Nominatim API
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
              );
              const data = await response.json();
              console.log("locationn",data);
              
              const { suburb, town, city, village, state_district } = data.address;
              console.log("sub",suburb,"town",town,"village",village,"state",state_district);
              
              const area = suburb || town || city || village || state_district || "Unknown Area";
               console.log("area",area);
              
              
              setLocation({
                lat,
                lng,
                address: data.address|| "Address not found",
               
              });
            } catch (error) {
              console.error("Error fetching address:", error);
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }, []);



  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!store.name) newErrors.name = "Store Name is required";
    if (!store.owner_name) newErrors.owner_name = "Owner Name is required";
    if (!store.owner_email) newErrors.owner_email = "Owner Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.owner_email)) newErrors.owner_email = "Invalid email format";
    if (!store.owner_phone) newErrors.owner_phone = "Owner Phone is required";
    else if (!/^\d{10}$/.test(store.owner_phone)) newErrors.owner_phone = "Invalid phone number";
    if (!store.password) newErrors.password = "Password is required";
    if (store.password !== store.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStore({
      ...store,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    dispatch(StoreRegister(store)).unwrap()
    .then((res)=>{
      if (res) {
        setShowMsg({
          action:true,
          type:'success',
          message:`now login Check your Email for StoreId` 
        })
        dispatch(setTempstore(res))

 if(localstore&&location){
                      
                      dispatch(Store_put_Location({id:localstore.id,location}))
                      
                    }

                    navigate('/store/login')

            


        
      }else
      {
        setShowMsg({
          action:true,
          type:'success',
          message:`check Your Email and Enter Otp` 
        })

        setShowotp(true)
        
      }
    })


    console.log("Store Data:", store);
  };


  

  return (
    <>
    {
      showMsg.action&&
      <ToastAlert message={showMsg.message} onClose={()=>setShowMsg((prev)=>({...prev,action:false}))} type={showMsg.type as "info"|"success"|"error"} />
    }
      {showOtp ? (
            <StoreOtp />
          ) :(
            
            <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('/storebackground.jpeg')" }}>
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl border border-gray-300 backdrop-blur-md bg-opacity-90">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Store Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input type="text" name="name" placeholder="Store Name" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <input type="text" name="owner_name" placeholder="Owner Name" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.owner_name && <p className="text-red-500 text-sm">{errors.owner_name}</p>}
          </div>
          <div>
            <input type="email" name="owner_email" placeholder="Owner Email" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.owner_email && <p className="text-red-500 text-sm">{errors.owner_email}</p>}
          </div>
          <div>
            <input type="text" name="owner_phone" placeholder="Owner Phone" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.owner_phone && <p className="text-red-500 text-sm">{errors.owner_phone}</p>}
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"  />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          
          <button type="submit" className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition shadow-md">Register Store</button>
        </form>
      </div>
    </div>
  )}
    </>
  );
};

export default StoreRegistration;
