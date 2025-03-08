import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User_orderEdit_types, User_OrderHistorytypes } from "../../../types/clients/UsersTypes";
import { user_get_OrderbyOrderId, user_put_Order } from "../../../reducers/users/UserapiCalls";
import { AppDispatch } from "../../../store/store";

const OrderDetails = () => {
  const {orderId} = useParams(); // Get order ID from URL
  const navigate = useNavigate();
  const dispatch:AppDispatch = useDispatch();
  const [order, setOrder] = useState<User_OrderHistorytypes | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [showReturnInput, setShowReturnInput] = useState(false);
  console.log(orderId);
  
  useEffect(() => {
    if (orderId) {
      dispatch(user_get_OrderbyOrderId(orderId))
        .unwrap()
        .then((res) => setOrder(res))
        .catch((err) => console.error(err));
    }
  }, [dispatch, orderId]);

  const handleCancelOrder = () => {
    if (!orderId) return;
    const data:User_orderEdit_types={
        orderId:orderId,
        status:'cancelled'
    

    }
    dispatch(user_put_Order(data))
      .unwrap()
      .then(() => setOrder((prev) => (prev ? { ...prev, orderStatus: "cancelled" } : prev)))
      .catch((err) => console.error(err));
  };

  const handleReturnOrder = () => {
    if (!orderId || !returnReason.trim()) {
        alert("Please provide a reason for return.");
        return;
      }
    const data:User_orderEdit_types={
        orderId,
        status:'returned',
        concern:returnReason


    }
    dispatch(user_put_Order(data))
      .unwrap()
      .then(() =>{ setOrder((prev) => (prev ? { ...prev, orderStatus: "returned" } : prev))
      setShowReturnInput(false)
    })
      .catch((err) => console.error(err));
  };

  if (!order) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-gray-700">Order Details</h2>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
      >
        Back
      </button>
    </div>

    <div className="border rounded-lg p-4">
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Total Price:</strong> ₹{order.total.toFixed(2)}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Order Status:</strong> 
        <span className={`ml-2 px-3 py-1 text-xs font-semibold rounded-full ${order.orderStatus === "pending"
            ? "bg-yellow-100 text-yellow-600"
            : order.orderStatus === "completed"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
          }`}>
          {order.orderStatus}
        </span>
      </p>
    </div>

    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Products</h3>
      <div className="border rounded-lg p-4">
        {order.cart.products.map((item) => (
          <div key={item.product._id} className="flex items-center gap-4 mb-2">
            <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-md shadow-sm border" />
            <div>
              <p className="text-sm font-medium">{item.product.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity} | Price: ₹{item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6 flex flex-col gap-4">
      {order.orderStatus === "pending" && (
        <button
          onClick={handleCancelOrder}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancel Order
        </button>
      )}

      {order.orderStatus === "completed" && !showReturnInput && (
        <button
          onClick={() => setShowReturnInput(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Return Order
        </button>
      )}

      {showReturnInput && (
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            rows={3}
            placeholder="Enter reason for return..."
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleReturnOrder}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Submit Return
            </button>
            <button
              onClick={() => {
                setShowReturnInput(false);
                setReturnReason("");
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  </div>

  );
};

export default OrderDetails;
