"use client";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/store";
import { Store_Product_types } from "../../../../types/storetypes";
import { useEffect, useState } from "react";
import { User_get_ProductById, User_post_addtoCart } from "../../../../reducers/users/UserapiCalls";
import ToastAlert from "../../../alert/ToastAlert";
import { Request_Cart } from "../../../../types/clients/UsersTypes";

// 

export default function ProductDetailPage() {
  const { id } = useParams();
//   const router = useRouter();

  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  
  const [product, setProduct] = useState<Store_Product_types | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showMsg, setShowMsg] = useState({ action: false, message: "", type: "idle" });

  useEffect(() => {
    if (id) {
      dispatch(User_get_ProductById(id))
        .unwrap()
        .then((res) => setProduct(res))
        // .catch(() => router.push("/404"));
    }
  }, [id, dispatch]);

  const increaseQuantity = () => {
    if (product && quantity < Math.min(product.stock, 10)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user?.id) {
      return setShowMsg({ action: true, message: "User not logged in", type: "error" });
    }
    if (!product) return;
    if (quantity > product.stock) {
      return setShowMsg({ action: true, message: "Not enough stock available", type: "error" });
    }

    const cartData: Request_Cart = {
      id: "",
      userId: user.id,
      productId: product.id,
      storeId: product.storeId,
      quantity,
      price: quantity * product.price,
    };

    try {
      await dispatch(User_post_addtoCart(cartData)).unwrap();
      setShowMsg({ action: true, message: "Item added to cart", type: "success" });
    } catch {
      setShowMsg({ action: true, message: "Failed to add item", type: "error" });
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      {showMsg.action && (
        <ToastAlert message={showMsg.message} type={showMsg.type as "error"|"success"|"info"} onClose={() => setShowMsg({ action: false, message: "", type: "idle" })} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-full h-auto object-contain" />

        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-lg font-semibold">₹{product.price}</p>
          <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </p>

          <div className="flex items-center mt-4">
            <button onClick={decreaseQuantity} className="px-3 py-1 border rounded">-</button>
            <span className="mx-3">{quantity}</span>
            <button onClick={increaseQuantity} className="px-3 py-1 border rounded">+</button>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
