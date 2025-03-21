import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User_get_CartnyUserId, User_put_addtoCart, User_removeFromCart } from "../../../../reducers/users/UserapiCalls";
import { X } from 'lucide-react';
import { Cart, Remove_Cart, Request_Cart } from "../../../../types/clients/UsersTypes";
import { AppDispatch, RootState } from "../../../../store/store";
import ConfirmModal from "../../../confirm_modal/ConfirmModal";
import UserHeader from "../../header/Header";
import { ToastMsg } from "../../../../types/admin/admintypes";
import ToastAlert from "../../../alert/ToastAlert";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [localCart, setLocalCart] = useState<Cart|null>(null);
  const { user, cart } = useSelector((state: RootState) => state.user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [showMsg, setShowMsg] = useState<ToastMsg>({
    action: false,
    message: "",
    type: 'idle'
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(User_get_CartnyUserId(user.id))
        .unwrap()
        .then((cart) => setLocalCart(cart))
        .catch(() => setLocalCart(null))
        .finally(() => setLoading(false));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (cart) {
      setLocalCart(cart);
    }
  }, [cart]);

  const handleRemoveClick = (id: string) => {
    setSelectedItem(id);
    setIsModalOpen(true);
  };
  const confirmRemove = async () => {
    if (!selectedItem) return;
  
    try {
      // Remove the product from the cart
      setLocalCart((prevCart) => {
        if (!prevCart) return null;
  
        const updatedProducts = prevCart.products.filter(
          (product) => product.product._id !== selectedItem
        );
  
        return {
          ...prevCart,
          products: updatedProducts,
        };
      });

    const data:Remove_Cart={
      id:localCart?.id||"",
      userId:localCart?.userId._id||"",
      productId:selectedItem

    }
     
      // Dispatch the action to remove the item from the backend
      await dispatch(User_removeFromCart(data)).unwrap();
  
      // Show success message
      setShowMsg({ action: true, message: "Item removed successfully", type: "success" });
  
    } catch (error) {
      // If the request fails, revert localCart to the original cart state
      setLocalCart(cart);
  
      // Show error message
      setShowMsg({ action: true, message: "Failed to remove item", type: "error" });
      console.log(error);
      
    } finally {
      // Close the modal
      setIsModalOpen(false);
    }
  };
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (!localCart) return;
  
    const productToUpdate = localCart.products.find(
      (product) => product.product._id === productId
    );
  
    if (!productToUpdate) return;
  
    if (newQuantity < 1) {
      setShowMsg({ action: true, message: "Quantity cannot be less than 1", type: "error" });
      return;
    } 
  
    if (newQuantity > productToUpdate.product.stock) {
      setShowMsg({
        action: true,
        message: `Only ${productToUpdate.product.stock} items available`,
        type: "error",
      });
      return;
    }
  
    const unitPrice = productToUpdate.price / productToUpdate.quantity;
    const updatedPrice = unitPrice * newQuantity;
  
    const data: Request_Cart = {
      id: localCart.id,
      userId: localCart.userId._id||"",
      storeId: localCart.storeId,
      productId: productToUpdate.product._id||"",
      quantity: newQuantity,
      price: updatedPrice,
    };
  
    try {
      // Update the local cart
      setLocalCart((prevCart) => {
        if (!prevCart) return null;
  
        const updatedProducts = prevCart.products.map((product) =>
          product.product._id === productId
            ? { ...product, quantity: newQuantity, price: updatedPrice }
            : product
        );
  
        console.log("cart products",updatedProducts);
        
        return {
          ...prevCart,
          products: updatedProducts,
        };
      });
  
      // Dispatch the action to update the cart in the backend
      await dispatch(User_put_addtoCart(data)).unwrap();
  
      // Show success message
      setShowMsg({ action: true, message: "Updated successfully", type: "success" });
  
    } catch (error) {
      // If the request fails, revert localCart to the original cart state
      setLocalCart(cart);
  console.log(error);
  
      // Show error message
      setShowMsg({ action: true, message: "Failed to update quantity", type: "error" });
    }
  };


 const calculateTotal = () => {
  if (!localCart) return 0;
  return localCart.products.reduce((total, product) => total + product.price, 0);
};
return (
  <>
    {showMsg.action && (
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
        <ToastAlert
          onClose={() => setShowMsg({ ...showMsg, action: false })}
          message={showMsg.message}
          type={showMsg.type as "error"|"success"|"info"}
        />
      </div>
    )}

    <ConfirmModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={confirmRemove}
    />

    <UserHeader />

    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">🛒 Shopping Cart</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : !localCart || localCart.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {localCart.products.map((product) => (
              <div
                key={product.product._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={product.product.images[0] || "/placeholder.svg"}
                    alt={product.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.product.name}
                    </h3>
                    <p className="text-gray-600">₹{product.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(product.product._id||"", product.quantity - 1)
                      }
                      className="w-8 h-8 border rounded-full hover:bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(product.product._id||"", product.quantity + 1)
                      }
                      className="w-8 h-8 border rounded-full hover:bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveClick(product.product._id||"")}
                    className="text-red-500 hover:text-red-700 transition p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-lg font-bold">₹{calculateTotal()}</span>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => navigate('/stores/checkout', { state: { cartId: localCart.id } })}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
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