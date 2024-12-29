import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { UserEditProfile } from "../../../types/clients/UsersTypes";
import { user_put_Profile } from "../../../reducers/users/UserapiCalls";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reset } from "../../../reducers/users/UserReducers";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const UserProfileEdit: React.FC = () => {
  const { user ,isError,isSuccess,message} = useSelector((state: RootState) => state.user);

  const [useredit, setUseredit] = useState<UserEditProfile>({
    id: user?.id||"",
    username: user?.username||"",
    email: user?.email,
    phone:user?.phone|| "",
    profilePic:""
  
  });
  // const [image, setImage]=useState<UserImage_Types>({
  //   id:user?.id || "",
  //   profile_pic:""

  // })
  const dispatch: AppDispatch = useDispatch();
const navigate=useNavigate()
  useEffect(()=>{
    if(isSuccess)
    {
        navigate(-1)
        dispatch(reset())
        return
    }
  
    if(isError)
    {
        toast.error(message)
        dispatch(reset())
        return

    }
  
        
  },[isSuccess, isError, message, dispatch, navigate  ])

  const profilepicurl = user?.profilePic
    ? `${user.profilePic}`
    : "https://via.placeholder.com/150";

  console.log("profile pic =", user?.profilePic);
  const [preview, setPreview] = useState<string>("");
  


  const handle_ProfilePic = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;

      console.log("Selected profile picture file:", file);
    if (file) {
   

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

     

    
    }
   


  };
  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUseredit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log(useredit);
    if (preview) {
      useredit.profilePic=preview
      
    }else
    {
      useredit.profilePic=user?.profilePic as string
    }
    const UpdateUserData = {
      
      ...useredit,
    
      
    
    };
  //  if (preview) {
  //   console.log("previewwwww",preview);
    
  //  }
    
    console.log("Updated user data:", UpdateUserData);
    dispatch(user_put_Profile(UpdateUserData));
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
          Profile
        </h1>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            <img
              src={preview || profilepicurl as string}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-blue-300"
            />
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 rounded-full  cursor-pointer transition duration-200"
            >
              <FontAwesomeIcon 
        icon={faPencilAlt} 
        className="text-blue-500  hover:text-blue-700 transition-all"
      />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handle_ProfilePic}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Section */}
        <form className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={useredit.username}
              onChange={handleOnchange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={useredit.email}
              readOnly
              placeholder="Your email address"
              className="w-full px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={useredit.phone}
              onChange={handleOnchange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none transition duration-200"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
