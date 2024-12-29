import React, {  useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { User_get_Logout } from "../../../reducers/users/UserapiCalls";
import { clearUser } from "../../../reducers/users/UserReducers";

const UserHeader: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("Our Services"); // Default active menu item
const dispatch:AppDispatch=useDispatch()
const {user}=useSelector((state:RootState)=>state.user)
// useEffect(()=>{


// })
const navigate=useNavigate()
  const menuItems = [
   {title: "Our Services",path:'/home'},
    {title:"Auto spare parts",path:'/autospareparts'},
   { title:"Modification",path:'/modification'},
   { title:"Contact Us",path:'/contactus'},
    {title:"About Us" ,path:'/about us'},
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-800">Retro Service</div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          
          {menuItems.map((item,index) => (

            <NavLink
           
              key={index}
              to={item.path}
              onClick={() =>{ 
                setActiveMenu(item.title)

              }} // Update active menu on click
              className={`relative text-gray-700 hover:text-orange-500 transition no-underline ${
                activeMenu === item.title ? "text-orange-500" : ""
              }`}
            >
              {item.title}
              <span
                className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-12 h-[2px] bg-orange-500 transition-transform duration-300 ${
                  activeMenu === item.title ? "scale-x-100" : "scale-x-0"
                }`}
              ></span>  
            </NavLink>
          ))}
        </nav>

        {/* Employees Section */}
        <div className="flex items-center space-x-4">
          <button className="text-orange-500 border border-orange-500 px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition" onClick={()=>navigate('/employees')}>
            Employees
          </button>

          {/* Profile Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden"  onClick={()=>navigate('/profile')}>
            <img
              src={user?.profilePic||"https://via.placeholder.com/40"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 hover:text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
                      <button className="ml-2 p-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onClick={()=>{
                        dispatch(User_get_Logout())
                        dispatch(clearUser())
                        

                      
                        navigate('/login')
          
          
          
                      }}
                      >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
