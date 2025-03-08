import { motion } from "framer-motion";
import { FaCheckCircle, FaEye } from "react-icons/fa";
import Sidebar from "../../../components/store_side/Sidebar";
import StoreHeader from "../../../components/store_side/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { Store_get_oreders, Store_put_oreder } from "../../../reducers/autopartsstore/autopartsStoreapicalls";
import { User_orderEdit_types, User_OrderHistorytypes } from "../../../types/clients/UsersTypes";
import { ToastMsg } from "../../../types/admin/admintypes";
import ToastAlert from "../../../components/alert/ToastAlert";

const StoreOrders = () => {
  const { orders, store } = useSelector((state: RootState) => state.store);
  const dispatch: AppDispatch = useDispatch();
const [error,setError]=useState<ToastMsg>({
    action:false,
    message:'',
    type:'idle'
  })
 const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    if (store?.id) {
      dispatch(Store_get_oreders(store.id));
    }
  }, [store, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "returned":
        return "bg-yellow-400";
      case "return-confirmed":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handlecomppleteSubmit=(orderData:User_OrderHistorytypes)=>{
    console.log('trigger');
    
const data:User_orderEdit_types={
    orderId:orderData.id as string,
    status:"completed",

}

dispatch(Store_put_oreder(data)).unwrap()
.then(()=>{
    setError({
        action:true,
        message:'success',
        type:'success'
    })



    
})
.catch((err)=>{
    setError({
        action:true,
        message:err,
        type:'error'
    })

})



  }

  const handlereturnconfirmeSubmit=(orderData:User_OrderHistorytypes)=>{
    console.log('trigger');
    
const data:User_orderEdit_types={
    orderId:orderData.id as string,
    status:"return-confirmed",

}

dispatch(Store_put_oreder(data)).unwrap()
.then(()=>{
    setError({
        action:true,
        message:'success',
        type:'success'
    })
    
})
.catch((err)=>{
    setError({
        action:true,
        message:err,
        type:'error'
    })

})



  }

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders =orders&& orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = orders&&Math.ceil(orders.length / ordersPerPage);

  return (
    <>
       {error.action &&
          <ToastAlert message={error.message} onClose={()=>setError((prev)=>({...prev,action:false}))} type={error.type as "info"|"success"|"error"} />

    }
    
      <StoreHeader />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">📦 Store Orders</h2>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders&&currentOrders.map((order: User_OrderHistorytypes) => (
                  <motion.tr
                    key={order.id}
                    whileHover={{ scale: 1.02 }}
                    className="border-b transition-all hover:bg-gray-50"
                  >
                    <td className="p-4">{order.id && order.id.slice(-6)}</td>
                    <td className="p-4">{order.userId.username}</td>
                    <td className="p-4 font-semibold">₹{order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-white rounded-md ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4">{order.paymentStatus}</td>
                    <td className="p-4 flex space-x-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center">
                        <FaEye className="mr-1" /> View
                      </button>
                      {order.orderStatus === "pending" && (
                        <>
                          <button className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center" onClick={()=>handlecomppleteSubmit(order)}>
                            <FaCheckCircle className="mr-1"  /> Complete
                          </button>
                        </>
                      )}
                      {order.orderStatus === "returned" && (
                        <>
                          <button className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center" onClick={()=>handlereturnconfirmeSubmit(order)}>
                            <FaCheckCircle className="mr-1"  /> return-confirme
                          </button>
                        </>
                      )}
                      {(order.orderStatus === "cancelled" || order.orderStatus === "return-confirmed") && (
                        <span className="text-gray-500 font-medium">Actions Disabled</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Number(totalPages)))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StoreOrders;
