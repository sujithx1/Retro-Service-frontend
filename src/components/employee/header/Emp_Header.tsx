import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearEmp } from "../../../reducers/employees/EmployeeReducers";
import { employee_get_details, Employee_get_Logout, Employee_get_walletDetails } from "../../../reducers/employees/EmployeeApicalls";
import { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";
import { FaBell } from "react-icons/fa";

const Emp_Header = () => {
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { employee,wallet } = useSelector((state: RootState) => state.employee);
  // const [wallet,setWallet]=useState<WalletResponse>()
  console.log("employee heder",employee);
  
  const employeeId = employee?.id;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (employeeId) {
      dispatch(employee_get_details(employeeId));
      dispatch(Employee_get_walletDetails(employeeId))
      
    }
  }, [dispatch, employeeId]);

  const handleInboxClick = () => {
    navigate('/employee/chat');
    setUnreadMessages(0);
  };

  const handleLogout = () => {
    dispatch(Employee_get_Logout());
    dispatch(clearEmp());
    navigate('/employee/login');
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md rounded-b-lg border-b border-gray-300">
      {/* Left Section */}
      <div className="text-lg font-semibold text-gray-700">
        Hi, {employee?.username} 
        <span className="text-gray-500 ml-2">Let’s check your Garage today</span>
      </div>

      {/* Middle Section - Location */}
      <div className="flex items-center space-x-2 text-black px-4 py-2 rounded-lg ">
        {/* <FaLocationArrow className="text-black -rot" /> */}
        <span className="font-medium">📍{employee?.location?.address.suburb || "Location Unavailable"}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">


      <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all">
        <span className="text-gray-700 font-medium">Wallet:</span>
        <span className="text-lg font-semibold text-blue-600">₹{wallet?.balance||0}</span>
      </div>

        {/* Chat Icon */}
        <button 
          className="relative p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 transition-all"
          onClick={handleInboxClick}
        >
          <IoIosChatboxes className="h-6 w-6" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </button>

        {/* Notification */}
        <button className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-yellow-100 transition-all">
          <FaBell className="h-5 w-5" />
        </button>


        {/* Profile Dropdown */}
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            className="flex items-center space-x-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-all"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* Profile Picture */}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
              <img
                src={employee?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span>{employee?.username}</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-lg border border-gray-300">
              <button 
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                onClick={() => navigate('/employee/profile')}
              >
                Profile
              </button>
              <button 
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Emp_Header;
