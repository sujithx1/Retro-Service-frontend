import { FaTrash, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../header/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect } from "react";
import { user_delete_Wishlist, user_get_whislistuserId } from "../../../../reducers/users/UserapiCalls";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch:AppDispatch=useDispatch()

  const {user,wishlists}=useSelector((state:RootState)=>state.user)
  useEffect(()=>{
    if (user?.id) {
dispatch(user_get_whislistuserId(user.id))     
    }
  },[dispatch,user])

  // Static wishlist items
//   const wishlist = [
//     {
//       id: "1",
//       name: "Wireless Headphones",
//       image: "https://via.placeholder.com/150",
//       price: 99.99,
//     },
//     {
//       id: "2",
//       name: "Smartwatch",
//       image: "https://via.placeholder.com/150",
//       price: 149.99,
//     },
//     {
//       id: "3",
//       name: "Gaming Mouse",
//       image: "https://via.placeholder.com/150",
//       price: 49.99,
//     },
//   ];
const handleremoveWishlist = (id: string) => {
  dispatch(user_delete_Wishlist(id))
    .unwrap()
    .catch((error) => {
      console.error("Failed to remove from wishlist:", error);
    });
};


  return (
    <>
    <UserHeader/>
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
        <FaHeart className="text-red-500 mr-2" /> My Wishlist
      </h2>

      {wishlists.length === 0 ? (
        <p className="text-gray-500 text-lg">Your wishlists is empty. 🛒</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center hover:shadow-xl transition-all"
            >
              <img
                src={item.productId.images[0]}
                alt={item.productId.name}
                className="w-32 h-32 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">{item.productId.name}</h3>
              <p className="text-gray-600 font-medium">₹
              {item.productId.price}</p>
              <div className="flex mt-3 space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  View
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all flex items-center"
                 onClick={()=>handleremoveWishlist(item.id||"")} >
                  <FaTrash className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
                    </>
  );
};

export default Wishlist;
