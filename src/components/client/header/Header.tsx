import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User_get_Logout } from "../../../reducers/users/UserapiCalls";
import { clearUser } from "../../../reducers/users/UserReducers";
import { AppDispatch, RootState } from "../../../store/store";
import { motion, AnimatePresence } from "framer-motion";

const UserHeader: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { title: "Services", path: "/home" },
    { title: "Stores", path: "/stores" },
    { title: "Contact", path: "/contactus" },
    { title: "About", path: "/aboutus" },
  ];

  return (
    <header className="bg-white/30 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div
          className="text-2xl font-extrabold text-gray-800 tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          Retro<span className="text-orange-500">Service</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="relative text-gray-700 font-medium group no-underline"
            >
              {item.title}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Employees Button */}
          {/* <button
            className="text-orange-500 border border-orange-500 px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition"
            onClick={() => navigate("/employees")}
          >
            Employees
          </button> */}

          {/* Chat Button */}
          <button
            className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600 transition flex items-center gap-2"
            onClick={() => navigate("/chat")}
          >
            🗨️ Chat
          </button>

          {/* Location Display */}
          <div className="text-gray-700 text-sm font-medium flex items-center">
            📍 {user?.location?.address.suburb || "Kerala"}
          </div>

          {/* User Profile & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full shadow-lg hover:bg-gray-200 transition"
            >
              <img
                src={user?.profilePic || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="text-gray-700 font-semibold">{user?.username || "User"}</span>
              <svg
                className="w-4 h-4 text-gray-500 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu with Animation */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden"
                >
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => {
                      dispatch(User_get_Logout());
                      dispatch(clearUser());
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
