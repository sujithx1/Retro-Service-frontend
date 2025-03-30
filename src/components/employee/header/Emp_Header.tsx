import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearEmp } from "../../../reducers/employees/EmployeeReducers";
import { employee_get_details, Employee_get_Logout, Employee_get_walletDetails } from "../../../reducers/employees/EmployeeApicalls";
import { useEffect, useState } from "react";
import { IoIosChatboxes } from "react-icons/io";
import { FaBell, FaBars } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const Emp_Header = () => {
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);

  const { employee, wallet } = useSelector((state: RootState) => state.employee);
  const employeeId = employee?.id;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (employeeId) {
      dispatch(employee_get_details(employeeId));
      dispatch(Employee_get_walletDetails(employeeId));
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
      {/* Left Section - Employee Name */}
      <span className="text-lg font-semibold text-gray-700">Hi, {employee?.username}</span>

      {/* Right Section - Desktop View */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <MdOutlineLocationOn className="text-blue-500 text-xl" />
          <span className="text-sm">{employee?.location?.address.suburb || "Location Unavailable"}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <span className="text-gray-700 font-medium">Wallet:</span>
          <span className="text-lg font-semibold text-blue-600">₹{wallet?.balance || 0}</span>
        </div>
        <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg" onClick={handleInboxClick}>
          <IoIosChatboxes className="h-6 w-6" />
          <span>Messages</span>
          {unreadMessages > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2">{unreadMessages}</span>
          )}
        </button>
        <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <FaBell className="h-5 w-5" />
          <span>Notifications</span>
        </button>

        {/* Profile Button with Image */}
        <button onClick={() => navigate('/employee/profile')} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <img 
            src={employee?.profilePic || "/default-profile.png"} // Use default if no image
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
          />
          <span className="text-gray-700">Profile</span>
        </button>

        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Mobile View - Menu Button */}
      <div className="md:hidden relative">
        <button className="text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <AiOutlineClose size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-lg border border-gray-300 p-4 flex flex-col gap-3">
            <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <MdOutlineLocationOn className="text-blue-500 text-xl" />
              <span className="text-sm">{employee?.location?.address.suburb || "Location Unavailable"}</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <span className="text-gray-700 font-medium">Wallet:</span>
              <span className="text-lg font-semibold text-blue-600">₹{wallet?.balance || 0}</span>
            </button>
            <button 
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
              onClick={handleInboxClick}
            >
              <IoIosChatboxes className="h-6 w-6" />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2">{unreadMessages}</span>
              )}
            </button>
            <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <FaBell className="h-5 w-5" />
              <span>Notifications</span>
            </button>

            {/* Mobile Profile Button */}
            <button 
              onClick={() => navigate('/employee/profile')}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <img 
                src={employee?.profilePic || "/default-profile.png"} // Use default image if none
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
              <span className="text-gray-700">Profile</span>
            </button>

            <button 
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Emp_Header;
