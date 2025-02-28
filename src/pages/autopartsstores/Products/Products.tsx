import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaBan } from "react-icons/fa";
import Sidebar from "../../../components/store_side/Sidebar";
import StoreHeader from "../../../components/store_side/Header";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Store_getAll_ProductWithstoreId } from "../../../reducers/autopartsstore/autopartsStoreapicalls";

const StoreProductList = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(true);
  const { products, store, isError } = useSelector((state: RootState) => state.store);

  useEffect(() => {
    if (store) {
      dispatch(Store_getAll_ProductWithstoreId(store.id))
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, store]);

  return (
    <>
      <StoreHeader />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold">🛒 Product List</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700"
              onClick={() => navigate("/store/add-product")}
            >
              <FaPlus /> Add Product
            </motion.button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center text-gray-600">Loading products...</div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center text-red-500">Failed to load products.</div>
          )}

          {/* Product List */}
          {!isLoading && !isError && (
            <>
              {products && products.length > 0 ? (
                <ul className="space-y-6">
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="p-5 bg-white shadow-md rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                        />
                        <span className="text-lg font-semibold">{product.name} - ₹{product.price}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                          onClick={() => navigate(`/store/edit-product/${product.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                          <FaBan />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-600">No products available.</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StoreProductList;
