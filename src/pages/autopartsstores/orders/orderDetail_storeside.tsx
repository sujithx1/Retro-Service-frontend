import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User_orderEdit_types, User_OrderHistorytypes } from "../../../types/clients/UsersTypes";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { Store_get_oreder, Store_put_oreder } from "../../../reducers/autopartsstore/autopartsStoreapicalls";
import ToastAlert from "../../../components/alert/ToastAlert";
import { ToastMsg } from "../../../types/admin/admintypes";

const Store_OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<User_OrderHistorytypes | null>(null);
  const dispatch: AppDispatch = useDispatch();
const [error,setError]=useState<ToastMsg>({
    action:false,
    message:'',
    type:'idle'
  })
  useEffect(() => {
    if (orderId) {
      dispatch(Store_get_oreder(orderId))
        .unwrap()
        .then((res) => {
          setOrder(res);
          console.log(res);
          
        })
        .catch((err) => console.error("Error fetching order:", err));
    }
  }, [orderId, dispatch]);


  
  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading Order Details...
      </div>
    );
  }

  const handleSubmitbt=(status:string)=>{
    console.log(status);
    

    const data:User_orderEdit_types={
        orderId:orderId||"",
        status

    }

    dispatch(Store_put_oreder(data)).unwrap()
    .then((res)=>{
        setError({
            action:true,
            message:'success',
            type:'success'
        })
        setOrder(res)
        
    })
    .catch((err)=>{
        setError({
            action:true,
            message:err,
            type:'error'
        })
    })

  }

  return (
    <>
     {error.action &&
          <ToastAlert message={error.message} onClose={()=>setError((prev)=>({...prev,action:false}))} type={error.type as "info"|"success"|"error"} />

    }
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>

      {/* Order ID & Status */}
      <div className="bg-gray-100 p-4 rounded-md mb-4 flex justify-between items-center">
  {/* Left Section: Order Details */}
  <div>
    <p className="text-lg font-semibold">
      Order ID: <span className="text-blue-600">{order.id}</span>
    </p>

    <p className="text-lg font-semibold">
      Status:
      <span
        className={`ml-2 px-3 py-1 rounded-md ${
          order.orderStatus === "completed"
            ? "bg-green-500 text-white"
            : order.orderStatus === "pending"
            ? "bg-yellow-500 text-white"
            : order.orderStatus === "returned"
            ? "bg-yellow-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {order.orderStatus}
      </span>
    </p>

    {/* Concern Section for Returned Orders */}
    {(order.orderStatus === "returned" || order.orderStatus === "return-confirmed") && (
      <p className="text-lg font-semibold">
        Concern:
        <span className="ml-2 py-1 text-red-500">{order.concern}</span>
      </p>
    )}
  </div>

  {/* Right Section: Button */}
  <div>
    <button
      className={`px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 ${
        order.orderStatus === "pending" || order.orderStatus === "completed"
          ? "bg-green-600 hover:bg-green-700"
          : order.orderStatus === "returned"
          ? "bg-yellow-600 hover:bg-yellow-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      disabled={order.orderStatus !== "pending"  && order.orderStatus !== "returned"}
   
   onClick={()=>handleSubmitbt(order.orderStatus==="pending"?"completed":order.orderStatus==="returned"?"return-confirmed":"n/a")}
   >
      {order.orderStatus === "pending" 
        ? "Complete"
        : order.orderStatus === "returned"
        ? "Return Confirm"
        : "N/A"}
    </button>
  </div>
</div>



      {/* User & Store Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">User & Store Info</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-semibold">User:</p>
            <p>{order.userId.username}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="font-semibold">Store:</p>
            <p>{order.storeId.name}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Products</h3>
        <div className="space-y-4">
          {order.cart.products.map((item, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-md flex justify-between">
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-700">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Details */}
      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-xl font-semibold text-gray-700">Payment Info</h3>
        <p className="mt-1">Total Amount: <span className="font-bold text-gray-800">₹{order.total}</span></p>
        <p>Payment Method: <span className="font-semibold">{order.paymentMethod}</span></p>
        <p>Transaction ID: <span className="text-blue-600">{order.transactionId || "N/A"}</span></p>
        <p>Payment Status: 
          <span className={`ml-2 px-3 py-1 rounded-md ${
            order.paymentStatus === "completed" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}>
            {order.paymentStatus}
          </span>
        </p>
      </div>

      {/* Order Date */}
      <div className="mt-4 text-gray-600 text-sm">
        <p>Order created: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
      </div>
    </div>
    </>
  );
};

export default Store_OrderDetailPage;
