import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { User_get_orderhistory } from "../../../reducers/users/UserapiCalls";
import { User_OrderHistorytypes } from "../../../types/clients/UsersTypes";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5; // Number of orders per page

const OrderHistory = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [orders, setOrders] = useState<User_OrderHistorytypes[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(User_get_orderhistory(user.id))
        .unwrap()
        .then((res) => {
          // Sort orders by latest (descending order)
          const sortedOrders = res.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sortedOrders);
        })
        .catch((err) => console.log(err));
    }
  }, [dispatch, user]);

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center max-h-full bg-gray-50 rounded-lg shadow-md p-6">
        <img
          src="https://res.cloudinary.com/ded1lrbaz/image/upload/v1741097388/emptyorders_bsp3ez.webp"
          alt="No Orders"
          className="w-32 h-32 mb-4"
        />
        <h2 className="text-lg font-semibold text-gray-700">No Orders Found</h2>
        <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
        <button
          onClick={() => navigate("/stores")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (

    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order History</h2>
      <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" onClick={()=>navigate('/profile')}>
      Back
    </button>
    </div>


      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Store</th>
              <th className="py-3 px-6 text-left">Products</th>
              <th className="py-3 px-6 text-left">Total Price</th>
              <th className="py-3 px-6 text-center">Payment Status</th>
              <th className="py-3 px-6 text-center">Order Status</th>
              <th className="py-3 px-6 text-center">Payment</th>
              <th className="py-3 px-6 text-center">Created At</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm">
            {currentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
               onClick={()=>navigate(`/order-detail/${order.id}`)} 
              >
                <td className="py-4 px-6 font-semibold">{order.userId.username}</td>
                <td className="py-4 px-6">{order.storeId.name}</td>
                <td className="py-4 px-6">
                  {order.cart.products.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-3 mb-2">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-md shadow-sm border"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} | Price: ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="py-4 px-6 font-semibold">₹{order.total.toFixed(2)}</td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold transition ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-600"
                        : order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold transition ${
                      order.orderStatus === "completed"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-4 px-6 text-center capitalize">{order.paymentMethod}</td>
                <td className="py-4 px-6 text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-3 py-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;
     