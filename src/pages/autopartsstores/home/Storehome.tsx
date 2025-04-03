import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingBag, FaBoxOpen, FaUndoAlt, FaTimesCircle, FaWallet } from "react-icons/fa";

import Sidebar from "../../../components/store_side/Sidebar";
import StoreHeader from "../../../components/store_side/Header";
import { AppDispatch, RootState } from "../../../store/store";
import { Store_get_oreders, Store_get_Wallet } from "../../../reducers/autopartsstore/autopartsStoreapicalls";
import { User_OrderHistorytypes } from "../../../types/clients/UsersTypes";

const StoreDashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { store } = useSelector((state: RootState) => state.store);

  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [returnedProducts, setReturnedProducts] = useState(0);
  const [canceledProducts, setCanceledProducts] = useState(0);
  const [bestProduct, setBestProduct] = useState<{ name: string; image: string; price: number } | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    if (store) {
      Promise.all([
        dispatch(Store_get_Wallet(store.id)).unwrap().then((res) => setWalletBalance(res.balance)),
        dispatch(Store_get_oreders(store.id)).unwrap().then((res) => processOrders(res)),
      ]).finally(() => setLoading(false));
    }
  }, [dispatch, store]);

  const processOrders = (orders: User_OrderHistorytypes[]) => {
    let revenue = 0, pending = 0, returns = 0, cancels = 0;
    const productCount: Record<string, { count: number; image: string; price: number }> = {};

    orders.forEach((order) => {
      if (order.orderStatus === "completed") revenue += order.total;
      else if (order.orderStatus === "pending") pending += order.total;
      else if (order.orderStatus === "returned") returns++;
      else if (order.orderStatus === "canceled") cancels++;

      order.cart.products.forEach((item) => {
        if (!productCount[item.product.name]) {
          productCount[item.product.name] = { count: 0, image: item.product.images[0], price: item.product.price };
        }
        productCount[item.product.name].count += item.quantity;
      });
    });

    setTotalRevenue(revenue);
    setPendingEarnings(pending);
    setReturnedProducts(returns);
    setCanceledProducts(cancels);

    const bestSelling = Object.entries(productCount).sort((a, b) => b[1].count - a[1].count)[0];
    setBestProduct(bestSelling ? { name: bestSelling[0], ...bestSelling[1] } : null);
  };

  const stats = [
    { label: "Wallet Balance", value: `$${walletBalance}`, icon: FaWallet, color: "from-purple-500 to-purple-700" },
    { label: "Total Revenue", value: `$${totalRevenue}`, icon: FaShoppingBag, color: "from-green-500 to-green-700" },
    { label: "Pending Earnings", value: `$${pendingEarnings}`, icon: FaBoxOpen, color: "from-yellow-500 to-yellow-700" },
    { label: "Returned Products", value: returnedProducts, icon: FaUndoAlt, color: "from-red-500 to-red-700" },
    { label: "Canceled Products", value: canceledProducts, icon: FaTimesCircle, color: "from-gray-500 to-gray-700" },
  ];

  return (
    <>
      <StoreHeader />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">📊 Store Dashboard</h2>
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-all duration-300"
              onClick={() => navigate(`/store/change-location/${store?.id}`)}
            >
              📍 Change Location
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center transition-all hover:shadow-2xl relative overflow-hidden"
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
          )}

          {/* Best Selling Product Section */}
          {bestProduct && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-10 bg-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center transition-all hover:shadow-2xl"
            >
              <img src={bestProduct.image} alt={bestProduct.name} className="w-28 h-28 object-cover rounded-xl" />
              <div className="ml-6 text-center sm:text-left">
                <h3 className="text-2xl font-semibold text-gray-800">{bestProduct.name}</h3>
                <p className="text-gray-500 text-lg font-medium mt-2">Price: ${bestProduct.price}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoreDashboard;
