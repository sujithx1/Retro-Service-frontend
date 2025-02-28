import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { Store_logout } from "../../reducers/autopartsstore/autopartsStoreapicalls";
import { clear_Store } from "../../reducers/autopartsstore/autopartsstorereducerse";

const Sidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState({
    products: false,
    orders: false,
    customers: false,
    analytics: false,
    marketing: false,
    settings: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const dispatch:AppDispatch=useDispatch()
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-200">
      {/* Header Section */}


      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => navigate("/store/home")}
              className="flex items-center p-2 w-full text-gray-700 hover:bg-gray-100 rounded"
            >
              🏠 <span className="ml-3">Dashboard</span>
            </button>
          </li>

          {/* Products */}
          <li>
            <button
              onClick={() => toggleSection("products")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              📦 <span className="ml-3">Products</span>
              <span className="ml-auto">{openSections.products ? "▲" : "▼"}</span>
            </button>
            {openSections.products && (
              <ul className="ml-6 space-y-1">
                <li>
                  <button onClick={() => navigate("/store/products")} className="block w-full text-left p-2 text-gray-600 hover:bg-gray-100 rounded">
                    All Products
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/store/add-product")} className="block w-full text-left p-2 text-gray-600 hover:bg-gray-100 rounded">
                    Add Product
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Orders */}
          <li>
            <button
              onClick={() => toggleSection("orders")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              📑 <span className="ml-3">Orders</span>
              <span className="ml-auto">{openSections.orders ? "▲" : "▼"}</span>
            </button>
            {openSections.orders && (
              <ul className="ml-6 space-y-1">
                <li>
                  <button onClick={() => navigate("/store/orders")} className="block w-full text-left p-2 text-gray-600 hover:bg-gray-100 rounded">
                    All Orders
                  </button>
                </li>
                <li>
                  {/* <button onClick={() => navigate("/store/pending-orders")} className="block w-full text-left p-2 text-gray-600 hover:bg-gray-100 rounded">
                    Pending Orders
                  </button> */}
                </li>
              </ul>
            )}
          </li>

          {/* Customers */}
          <li>
            <button
              onClick={() => toggleSection("customers")}
              className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              👥 <span className="ml-3">Customers</span>
              <span className="ml-auto">{openSections.customers ? "▲" : "▼"}</span>
            </button>
            {openSections.customers && (
              <ul className="ml-6 space-y-1">
                <li>
                  <button onClick={() => navigate("/store/customers")} className="block w-full text-left p-2 text-gray-600 hover:bg-gray-100 rounded">
                    All Customers
                  </button>
                </li>
              </ul>
            )}
          </li>

        </ul>
      </nav>
      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200">
        {/* <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded">
          🔔 Notifications
        </button> */}
        <button className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded" type="button" onClick={()=>{
            dispatch(Store_logout()).unwrap()
            .then(()=>{
                dispatch(clear_Store())
                 navigate('/store/login')})
           
        }}>
          🏠 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
