"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Store_Product_types } from "../../../../types/storetypes";
import { Request_Cart } from "../../../../types/clients/UsersTypes";
import { AppDispatch, RootState } from "../../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { ToastMsg } from "../../../../types/admin/admintypes";
import ToastAlert from "../../../alert/ToastAlert";
import { User_get_CartnyUserId, User_post_addtoCart, User_put_addtoCart } from "../../../../reducers/users/UserapiCalls";

interface ProductModalProps {
  onClose: () => void;
  product: Store_Product_types;
  delivery: number;
}

export default function AddtoCartModal({ onClose, product, delivery }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state: RootState) => state.user);
  const [showMsg, setShowMsg] = useState<ToastMsg>({
    action: false,
    message: "",
    type: "idle",
  });
  const dispatch: AppDispatch = useDispatch();

  const increaseQuantity = () => {
    if (quantity < Math.min(10, product.stock)) {
      setQuantity((prev) => prev + 1);
    } else {
      setShowMsg({
        action: true,
        message: "Cannot add more than available stock",
        type: "error",
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handletoCart = async (product: Store_Product_types, quantity: number) => {
    if (!user?.id) {
      setShowMsg({
        action: true,
        message: "User not logged in",
        type: "error",
      });
      return;
    }

    if (quantity > product.stock) {
      setShowMsg({
        action: true,
        message: "Not enough stock available",
        type: "error",
      });
      return;
    }

    try {
      // Fetch the user's cart
      const cart = await dispatch(User_get_CartnyUserId(user.id)).unwrap();

      if (!cart) {
        // If no cart exists, create a new one
        const data: Request_Cart = {
          id: "",
          userId: user.id,
          productId: product.id,
          storeId: product.storeId,
          quantity: quantity,
          price: quantity * product.price,
        };

        await dispatch(User_post_addtoCart(data)).unwrap();
      } else {
        const safeCart = cart || {
          id: "",
          userId: user.id,
          storeId: product.storeId,
          products: [],
        };

        // Check if the product is already in the cart
        const existingProduct = safeCart.products.find(
          (item) => item.product._id === product.id
        );

        if (existingProduct) {
          // Validate if the total quantity exceeds stock
          const newQuantity = existingProduct.quantity + quantity;
          if (newQuantity > product.stock) {
            setShowMsg({
              action: true,
              message: "Not enough stock available",
              type: "error",
            });
            return;
          }

          // Update product quantity
          const updatedData: Request_Cart = {
            id: cart.id,
            userId: user.id,
            productId: product.id,
            storeId: cart.storeId,
            quantity: newQuantity,
            price: newQuantity * product.price,
          };

          await dispatch(User_put_addtoCart(updatedData)).unwrap();
        } else {
          const updatedData: Request_Cart = {
            id: cart.id,
            userId: user.id,
            productId: product.id,
            storeId: cart.storeId,
            quantity: quantity,
            price: quantity * product.price,
          };

          await dispatch(User_put_addtoCart(updatedData)).unwrap();
        }
      }

      setShowMsg({
        action: true,
        message: "Item added to cart",
        type: "success",
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setShowMsg({
        action: true,
        message: "Item not added",
        type: "error",
      });
    }
  };

  return (
    <>
      {showMsg.action && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100]">
          <ToastAlert
            onClose={() => setShowMsg((prev) => ({ ...prev, action: false }))}
            message={showMsg.message}
            type={showMsg.type as "success" | "error" | "info"}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white rounded-lg max-w-2xl w-full relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="max-w-full h-auto object-contain"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
              <button className="text-blue-600 hover:text-blue-700 text-left mt-1">
                See all item details
              </button>

              {/* Quantity Selector */}
              <div className="mt-6">
                <p className="text-gray-700 mb-2">Quantity:</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={decreaseQuantity}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                {quantity >= product.stock && (
                  <p className="text-red-500 text-sm mt-1">Max stock limit reached</p>
                )}
              </div>

              {/* Price */}
              <div className="mt-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold">₹{quantity * product.price}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <p className="mt-4 text-gray-700">
                FREE delivery {Number(delivery) * 2} mins
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-yellow-400 rounded-md text-gray-900 font-medium hover:bg-yellow-500"
                  onClick={() => handletoCart(product, quantity)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
