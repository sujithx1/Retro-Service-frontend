import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../../../store/store";
import { FaBars, FaTimes } from "react-icons/fa";

const Emp_Sidebar = () => {
  const { employee } = useSelector((state: RootState) => state.employee);
  const [isOpen, setIsOpen] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowMenuButton(false);
      } else {
        setShowMenuButton(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const urls = [
    { side: "Dashboard", icon: "🏠", path: "/employee/home" },
    { side: "Jobs", icon: "🛠️", path: "/employee/jobs" },
    { side: "Booking", icon: "🧑‍🔧", path: "/employee/booking" },
    { side: "Booking History", icon: "📜", path: "/employee/booking-history" },
    { side: "Transactions", icon: "💰", path: `/employee/transactions?userId=${employee?.id}&type=employee` },
  ];

  return (
    <>
      {/* Mobile Menu Button (Hidden on Scroll Down) */}
      <button
        className={`md:hidden fixed top-4 left-4 p-3 bg-gray-100 rounded-full shadow-lg transition-all duration-300 z-50 ${
          showMenuButton ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      >
        <FaBars className="text-gray-700 text-2xl" />
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative bg-white h-screen w-64 p-4 flex flex-col transition-transform duration-300 z-50 shadow-lg border-r border-gray-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header - Retro Service Branding */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-blue-700">Retro Service</span>
          <button onClick={toggleSidebar} className="text-xl p-2 text-gray-600 md:hidden">
            <FaTimes />
          </button>
        </div>

        {/* Profile Section */}
     

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-3">
          {urls.map((item, index) => (
            <NavLink
              className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg text-md font-medium transition-all no-underline" 
              key={index}
              to={item.path}
              onClick={toggleSidebar}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.side}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Emp_Sidebar;
