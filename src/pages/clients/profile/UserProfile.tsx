import React, { useEffect, useState } from "react";
import UserHeader from "../../../components/client/header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { UserStateTypes } from "../../../types/clients/UsersTypes";

const UserProfile: React.FC = () => {
    const {user}=useSelector((state:RootState)=>state.user)
    const [userProfile,setUserProfile]=useState<UserStateTypes>({
      id:"",
      username:"",
      email:'',
      phone:"",
      profilePic:"",
      authSourse:"",
      role:''
    })
    useEffect(()=>{
      if (user) {
        
        setUserProfile(user)
      }

        console.log(user);
        
    },[user])
    
    const navigate=useNavigate()
  return (
    <>
    <UserHeader/>
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-full object-cover"
            src={`${userProfile?.profilePic}`} // Replace with actual image
            alt="Profile"
            />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{userProfile?.username}</h2>
          <p className="text-sm text-gray-600">{userProfile?.email}</p>
        </div>
      </div>

      {/* Menu Section */} 
      <ul className="divide-y divide-gray-200">
        <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer" onClick={()=>navigate('/profile/edit')}>Edit Profile</li>
        <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">Orders</li>
        <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">Carts</li>
        <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">Address</li>
        <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">Terms of Use</li>
        <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">Privacy Policy</li>
        <li className="py-3 px-4 hover:bg-gray-100 text-red-500 cursor-pointer">Logout</li>
      </ul>
    </div>
            </>
  );
};

export default UserProfile;
