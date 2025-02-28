"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User_get_CartnyUserId, User_put_addtoCart, User_removeFromCart } from "../../../../reducers/users/UserapiCalls";
import { X } from 'lucide-react';
import { Cart, Request_Cart } from "../../../../types/clients/UsersTypes";
import { AppDispatch, RootState } from "../../../../store/store";
import ConfirmModal from "../../../confirm_modal/ConfirmModal";
import UserHeader from "../../header/Header";
import { ToastMsg } from "../../../../types/admin/admintypes";
import ToastAlert from "../../../alert/ToastAlert";

export default function CartPage() {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [localCart, setLocalCart] = useState<Cart[]>([]);
  const { user, cart } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

 const [showMsg,setShowMsg]=useState<ToastMsg>({
    action:false,
    message:"",
    type:'idle'
  })
  const handleRemoveClick = (id: string) => {
    setSelectedItem(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(User_get_CartnyUserId(user?.id)).finally(() => setLoading(false));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (cart) {
      setLocalCart(cart);
    }
  }, [cart]);

  const confirmRemove = async () => {

    try {
        console.log("confirmed removing ",selectedItem);
        
        // Update local state immediately for better UX
        setLocalCart((prevCart) => prevCart.filter((item) => item.id !== selectedItem));
        
        // Make API call to remove item
        await dispatch(User_removeFromCart(selectedItem||"")).unwrap();
        setShowMsg({
            action: true,
            message: "removed...",
            type: "success"
          });
    
      } catch (error) {
        // If API call fails, revert the local state
        setLocalCart(cart);
        console.error("Failed to remove item:", error);
        setShowMsg({
            action: true,
            message: "Item not removed",
            type: "error"
          });
      }
    
   
  };

  const handleUpdateQuantity = async (item: Cart, newQuantity: number) => {
    if (newQuantity < 1) {
        setShowMsg({
          action: true,
          message: "Quantity cannot be less than 1",
          type: "error"
        });
        return;
      }
      console.log(item);
      
    
     if (newQuantity > item.productId.stock) { // Assuming `stock` exists in `productId`
       setShowMsg({
          action: true,
          message: `Only ${item.productId.stock} items available in stock`,
          type: "error"
        });
        return;
      }

      const unitPrice = item.price / item.quantity; // Get the unit price
  const updatedPrice = unitPrice * newQuantity; // Calculate new price

    const data: Request_Cart = {
      id: item.id,
      userId: item.userId._id||"",
      storeId: item.storeId,
      productId: item.productId._id||"",
      quantity: newQuantity,
      price: newQuantity * item.price,
    };
    try {
        // Update local state immediately
      
  const updatedCart = localCart.map((cartItem) =>
    cartItem.id === item.id
      ? { ...cartItem, quantity: newQuantity, price:updatedPrice }
      : cartItem
  );

  setLocalCart(updatedCart); // Update UI immediatel
    
        // Make API call to update quantity
        await dispatch(User_put_addtoCart(data)).unwrap();
        setShowMsg({
          action: true,
          message: "Updated successfully",
          type: "success"
        });
    
      } catch (error) {
        // If API call fails, revert the local state
        setLocalCart(cart);
        console.error("Failed to update quantity:", error);
        setShowMsg({
          action: true,
          message: "Failed to update quantity",
          type: "error"
        });
      }
  };
  const calculateTotal = () => {
    console.log("localcert",localCart);
    
    return localCart.reduce((total, item) => total + item.price, 0);
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
    {
      <ConfirmModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={()=>confirmRemove()}
    />
  }
  <UserHeader/>
    
    
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : localCart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {localCart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.productId?.images[0] || "/placeholder.svg"}
                    alt={item.productId?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.productId?.name}</h3>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      className="w-8 h-8 border rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      className="w-8 h-8 border rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveClick(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    aria-label="Remove item"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-lg font-bold">₹{calculateTotal()}</span>
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      </>
  );
}