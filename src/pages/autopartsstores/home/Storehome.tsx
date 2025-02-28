import { motion } from "framer-motion";
import { FaChartLine, FaShoppingBag, FaBoxOpen } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import Sidebar from "../../../components/store_side/Sidebar";
import StoreHeader from "../../../components/store_side/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";

const StoreDashboard = () => {
    const {store}=useSelector((state:RootState)=>state.store)
    const navigate=useNavigate()
  const stats = [
    { label: "Total Sales", value: "$12,340", icon: FaChartLine, color: "bg-blue-500" },
    { label: "Orders", value: "234", icon: FaBoxOpen, color: "bg-green-500" },
    { label: "Products", value: "45", icon: MdInventory, color: "bg-yellow-500" },
    { label: "Earnings", value: "$4,560", icon: FaShoppingBag, color: "bg-purple-500" },
  ];

  return (
    <>
      <StoreHeader />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          {/* Page Title */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">📊 Store Dashboard</h2>

          <button className="ml-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300" onClick={()=>navigate(`/store/change-location/${store?.id}`)}>
      📍 Change Location
    </button>

          {/* Grid Layout for Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center transition-all hover:shadow-xl relative"
              >
                <div
                  className={`absolute -top-5 p-3 rounded-full ${stat.color} text-white shadow-lg`}
                >
                  <stat.icon className="text-3xl" />
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-semibold text-gray-700">{stat.label}</h3>
                  <p className="text-gray-500 text-lg font-medium mt-1">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreDashboard;
