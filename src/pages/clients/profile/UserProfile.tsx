import React, { useEffect, useState } from "react";
import UserHeader from "../../../components/client/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { UserStateTypes } from "../../../types/clients/UsersTypes";
import { Wallet, User, ShoppingCart, Package, MapPin, FileText, Shield, LogOut } from "lucide-react";
import { user_get_walletdetails } from "../../../reducers/users/UserapiCalls";
import { WalletReq, WalletResponse } from "../../../types/employee/EmployeeTypes";
import { CreditCardIcon } from "@heroicons/react/24/outline";

const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [wallet,setwallet]=useState<WalletResponse>()
  const [userProfile, setUserProfile] = useState<UserStateTypes>({
    id: "",
    username: "",
    email: "",
    phone: "",
    profilePic: "",
    authSourse: "",
    role: "",
  });

  const dispatch:AppDispatch=useDispatch()
  useEffect(() => {
    if (user) {

      setUserProfile(user);
      const data:WalletReq={
        userId:user.id,
        userType:'user'
      }
      dispatch(user_get_walletdetails(data)).unwrap()
      .then((res)=>setwallet(res))


    }
  }, [user,dispatch]);

  const navigate = useNavigate();

  return (
    <>
      <UserHeader />
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-6">
          <img className="w-24 h-24 rounded-full object-cover" src={userProfile?.profilePic} alt="Profile" />
          <div>
            <h2 className="text-xl font-semibold">{userProfile?.username}</h2>
            <p className="text-sm text-gray-600">{userProfile?.email}</p>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="flex items-center justify-between bg-blue-100 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="text-blue-600" />
            <span className="text-lg font-semibold">Wallet Balance:</span>
          </div>
          <span className="text-xl font-bold text-blue-700">₹{wallet?.balance}</span>
          
        </div>

        {/* Menu Section */}
        <ul className="divide-y divide-gray-200">
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile/edit")}>
            <User size={18} /> Edit Profile
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/booking-history")}>
            <Package size={18} /> Bookings
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer" onClick={() => navigate(`/transactions?userId=${user?.id}&type=${"user"}`)}>
          <CreditCardIcon className="w-5 h-5" /> Transactions
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer">
            <ShoppingCart size={18} /> Orders
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer">
            <ShoppingCart size={18} /> Carts
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer">
            <MapPin size={18} /> Address
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer">
            <FileText size={18} /> Terms of Use
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 cursor-pointer">
            <Shield size={18} /> Privacy Policy
          </li>
          <li className="flex items-center gap-2 py-3 px-4 hover:bg-gray-100 text-red-500 cursor-pointer">
            <LogOut size={18} /> Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default UserProfile;