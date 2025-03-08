import { motion } from "framer-motion";
import { FaChartLine, FaShoppingBag, FaBoxOpen } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import Sidebar from "../../../components/store_side/Sidebar";
import StoreHeader from "../../../components/store_side/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";

const StoreDashboard = () => {
  const { store } = useSelector((state: RootState) => state.store);
  const navigate = useNavigate();

  const stats = [
    { label: "Total Sales", value: "$12,340", icon: FaChartLine, color: "from-blue-500 to-blue-700" },
    { label: "Orders", value: "234", icon: FaBoxOpen, color: "from-green-500 to-green-700" },
    { label: "Products", value: "45", icon: MdInventory, color: "from-yellow-500 to-yellow-700" },
    { label: "Earnings", value: "$4,560", icon: FaShoppingBag, color: "from-purple-500 to-purple-700" },
  ];

  return (
    <>
      <StoreHeader />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Page Title */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">📊 Store Dashboard</h2>
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-all duration-300"
              onClick={() => navigate(`/store/change-location/${store?.id}`)}
            >
              📍 Change Location
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center transition-all hover:shadow-2xl relative"
              >
                <div
                  className={`absolute -top-6 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                >
                  <stat.icon className="text-2xl" />
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
