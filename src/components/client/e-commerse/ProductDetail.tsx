"use client"

import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"

import type { AppDispatch, RootState } from "../../../store/store"
import type { Store_Product_types } from "../../../types/storetypes"
import {
  User_get_ProductById,
  User_post_addtoCart,
  User_get_allProductwithStoreId,
} from "../../../reducers/users/UserapiCalls"
import type { Request_Cart } from "../../../types/clients/UsersTypes"
import ToastAlert from "../../alert/ToastAlert"
import UserHeader from "../header/Header"
import { CategoryStateTypes } from "../../../types/admin/admintypes"

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch: AppDispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const navigate=useNavigate()

  const [product, setProduct] = useState<Store_Product_types | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showMsg, setShowMsg] = useState({ action: false, message: "", type: "idle" })
  const [storeProducts, setStoreProducts] = useState<Store_Product_types[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Store_Product_types[]>([])
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const fetchRelatedProducts = useCallback(
    (category: CategoryStateTypes) => {
      // Simulate fetching related products by category
      const related = storeProducts.filter((p) => p.category === category && p.id !== id)
      setRelatedProducts(related.slice(0, 4)) // Show up to 4 related products
    },
    [id, storeProducts],
  )

  const fetchStoreProducts = useCallback(
    (storeId: string) => {
      dispatch(User_get_allProductwithStoreId(storeId))
        .unwrap()
        .then((res) => setStoreProducts(res))
        .catch(() => console.error("Failed to fetch store products"))
    },
    [dispatch],
  )
  useEffect(() => {
    if (id) {
      dispatch(User_get_ProductById(id))
        .unwrap()
        .then((res) => {
          setProduct(res)
          setSelectedImage(res.images[0])
          fetchStoreProducts(res.storeId) // Fetch store products first
        })
        .catch(() => console.error("Failed to fetch product"))
    }
  }, [id, dispatch, fetchStoreProducts])
  
  useEffect(() => {
    if (product && storeProducts.length > 0) {
      fetchRelatedProducts(product.category) // Now call fetchRelatedProducts
    }
  }, [product, storeProducts, fetchRelatedProducts])
  

  const increaseQuantity = () => {
    if (product && quantity < Math.min(product.stock, 10)) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!user?.id) {
      return setShowMsg({ action: true, message: "User not logged in", type: "error" })
    }
    if (!product) return
    if (quantity > product.stock) {
      return setShowMsg({ action: true, message: "Not enough stock available", type: "error" })
    }

    const cartData: Request_Cart = {
      id: "",
      userId: user.id,
      productId: product.id,
      storeId: product.storeId,
      quantity,
      price: quantity * product.price,
    }

    try {
      await dispatch(User_post_addtoCart(cartData)).unwrap()
      setShowMsg({ action: true, message: "Item added to cart", type: "success" })
    } catch {
      setShowMsg({ action: true, message: "Failed to add item", type: "error" })
    }
  }

  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image)
    setCurrentImageIndex(index)
  }

  const nextImage = () => {
    if (product && product.images.length > 0) {
      const newIndex = (currentImageIndex + 1) % product.images.length
      console.log(newIndex);
      
      setSelectedImage(product.images[newIndex])
      setCurrentImageIndex(newIndex)
    }
  }

  const prevImage = () => {
    if (product && product.images.length > 0) {
      const newIndex = (currentImageIndex - 1 + product.images.length) % product.images.length
      setSelectedImage(product.images[newIndex])
      setCurrentImageIndex(newIndex)
    }
  }

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-lg font-medium text-gray-500">Loading product details...</div>
      </div>
    )

  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gray-50">
        {showMsg.action && (
          <ToastAlert
            message={showMsg.message}
            type={showMsg.type as "error" | "success" | "info"}
            onClose={() => setShowMsg({ action: false, message: "", type: "idle" })}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Product Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-md p-6 mb-12">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative">
                <motion.img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-[400px] object-cover rounded-xl shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  key={selectedImage}
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                      aria-label="Previous image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-700"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                      aria-label="Next image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-700"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto py-2 px-1">
                  {product.images.slice(0, 5).map((image, index) => (
                    <motion.div
                      key={index}
                      className={`relative cursor-pointer rounded-lg overflow-hidden ${
                        selectedImage === image ? "ring-2 ring-blue-500 ring-offset-2" : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleImageSelect(image, index)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product Image ${index + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {product.category.name}
                  </span>
                  {product.stock > 0 ? (
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

              {/* Price and Stock */}
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</div>
                <div className="text-sm text-gray-500">
                  {product.stock > 0 ? `${product.stock} units available` : "Currently unavailable"}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-1">
                <span className="text-gray-700 mr-3">Quantity:</span>
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className={`h-9 w-9 rounded-md flex items-center justify-center border ${
                    quantity <= 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <div className="w-12 h-9 flex items-center justify-center border border-gray-300 rounded-md">
                  {quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  disabled={product.stock === 0 || quantity >= Math.min(product.stock, 10)}
                  className={`h-9 w-9 rounded-md flex items-center justify-center border ${
                    product.stock === 0 || quantity >= Math.min(product.stock, 10)
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 px-6 text-lg font-medium rounded-lg flex items-center justify-center ${
                  product.stock === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <motion.div key={relatedProduct.id} whileHover={{ y: -5 }} className="group">
                    <div className="bg-white rounded-xl overflow-hidden h-full shadow hover:shadow-lg transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedProduct.images[0] || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg truncate">{relatedProduct.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="font-bold text-gray-900">₹{relatedProduct.price.toLocaleString()}</p>
                          {relatedProduct.stock > 0 ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Store Products */}
          {storeProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">More from This Store</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {storeProducts.slice(0, 4).map((storeProduct) => (
                  <motion.div key={storeProduct.id} whileHover={{ y: -5 }} className="group cursor-pointer">
                    <div className="bg-white rounded-xl overflow-hidden h-full shadow hover:shadow-lg transition-shadow"  onClick={()=>navigate(`/product-detail/${storeProduct.id}`)}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={storeProduct.images[0] || "/placeholder.svg"}
                          alt={storeProduct.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg truncate">{storeProduct.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="font-bold text-gray-900">₹{storeProduct.price.toLocaleString()}</p>
                          {storeProduct.stock > 0 ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

