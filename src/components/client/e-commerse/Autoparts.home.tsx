import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import UserHeader from "../header/Header";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { user_delete_Wishlist, User_get_allCategories, User_get_allProductwithStoreId, user_get_whislistuserId, user_post_addtoWishlist, User_searchProducts } from "../../../reducers/users/UserapiCalls";
import { Store_Product_types } from "../../../types/storetypes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CategoryStateTypes } from "../../../types/admin/admintypes";
import AddtoCartModal from "./cart/AddcartModal";
import { Add_WishlistTypes, WishlistTypes } from "../../../types/clients/UsersTypes";
import { debounce } from "lodash";

const AutopartsHome: React.FC = () => {
  const [categories, setCategories] = useState<CategoryStateTypes[] | null>(null);
  const [products, setProducts] = useState<Store_Product_types[] | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Store_Product_types[]>([]);
  const { user, wishlists } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const distance = queryParams.get("distance");
  const [addtoCartModal, setAddtoCartModal] = useState(false);
  const [addtoCartProduct, setAddtoCartProduct] = useState<Store_Product_types>();

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(User_get_allCategories())
        .unwrap()
        .then((res) => setCategories(res));

      dispatch(User_get_allProductwithStoreId(id))
        .unwrap()
        .then((res) => setProducts(res));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user?.id) {
      dispatch(user_get_whislistuserId(user.id));
    }
  }, [dispatch, user]);

  const toggleWishlist = async (productId: string) => {
    if (!user?.id) return;

    const isInWishlist = wishlists.find((wishItem: WishlistTypes) => wishItem.productId.id === productId);

    if (isInWishlist) {
      try {
        await dispatch(user_delete_Wishlist(isInWishlist?.id || "")).unwrap();
        setWishlist((prev) => ({ ...prev, [productId]: false }));
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      const data: Add_WishlistTypes = {
        userId: user.id,
        productId: productId,
      };

      try {
        await dispatch(user_post_addtoWishlist(data)).unwrap();
        setWishlist((prev) => ({ ...prev, [productId]: true }));
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    }
  };

  const handleSearch = debounce(async (term: string) => {
    if (term.length > 2) {
      try {
        const result = await dispatch(User_searchProducts(term)).unwrap();
        setSuggestions(result);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSuggestionClick = (product: Store_Product_types) => {
    setSearchTerm(product.name);
    setSuggestions([]);
    navigate(`/product-detail/${product.id}`);
  };

  const filteredProducts = products
    ?.filter((item) => selectedCategory === "all" || item.category.id === selectedCategory)
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handle_addtocart = (product: Store_Product_types) => {
    setAddtoCartModal(true);
    setAddtoCartProduct(product);
  };

  return (
    <>
      {addtoCartModal && addtoCartProduct && (
        <AddtoCartModal onClose={() => setAddtoCartModal(false)} product={addtoCartProduct} delivery={Number(distance)} />
      )}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800">
        <UserHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600">Auto Parts</h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-300"
                onClick={() => navigate('/wishlist')}
              >
                <FaHeart className="text-xl" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-purple-100 rounded-full text-purple-600 hover:bg-purple-200 transition-colors duration-300"
                onClick={() => navigate('/stores/cart')}
              >
                <FaShoppingCart className="text-xl" />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {suggestions.length > 0 && (
  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
    {suggestions.map((product) => (
      <div
        key={product.id}
        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
        onClick={() => handleSuggestionClick(product)}
      >
        {/* Product Image */}
        <img
          src={product.images[0]} // Use the first image from the product's images array
          alt={product.name}
          className="w-10 h-10 object-cover rounded-md mr-3"
        />
        {/* Product Name */}
        <span>{product.name}</span>
      </div>
    ))}
  </div>
)}
            </div>
            <div className="flex space-x-4">
              <select
                className="px-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-300"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredProducts?.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <img
                      src={hoveredProduct === item.id ? item.images[1] : item.images[0]}
                      alt={item.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onMouseEnter={() => setHoveredProduct(item.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      onClick={() => navigate(`/product-detail/${item.id}`)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full text-gray-500 hover:text-red-500 transition-colors duration-300"
                      onClick={() => toggleWishlist(item.id)}
                    >
                      <FaHeart
                        className={`text-xl ${
                          wishlists.some((wishItem: WishlistTypes) => wishItem.productId.id === item.id) || wishlist[item.id]
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      />
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">₹{item.price}</span>
                      <span className="text-sm text-gray-500">
                        Delivery: {(Number(distance) * 2).toFixed(2)} mins
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handle_addtocart(item)}
                      className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default AutopartsHome;