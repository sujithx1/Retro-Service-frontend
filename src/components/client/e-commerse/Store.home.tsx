import { useState, useEffect } from "react";
import { FaStore, FaBoxOpen, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { User_get_20kmstores } from "../../../reducers/users/UserapiCalls";
import { User_Get_AllStores } from "../../../types/clients/UsersTypes";
import UserHeader from "../header/Header";
import { useNavigate } from "react-router-dom";

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
};

const ClientStoreHome = () => {
  const [filter, setFilter] = useState({ distance: 20, rating: 4.0, products: 0 });
  const [stores, setStores] = useState<User_Get_AllStores[]>([]);
  const [filteredStores, setFilteredStores] = useState<User_Get_AllStores[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
const navigate=useNavigate()

  useEffect(() => {
    if (user && user.location) {
        dispatch(User_get_20kmstores(user.location))
            .unwrap()
            .then((res) => {
                // Map stores correctly into User_Get_AllStores type
                const formattedStores: User_Get_AllStores[] = res.map((store: User_Get_AllStores) => {
                    console.log("res",res)
                    
                    const distance = store.store.location&&user.location
                        ? calculateDistance(
                            user.location.lat,
                            user.location.lng,
                            store.store.location.lat,
                            store.store.location.lng
                        )
                        : Infinity; // If no location, set to Infinity

                        console.log(store.total_product);
                        
                    return {
                        store:store.store, // Store object as required by User_Get_AllStores
                        distance,
                        rating: Math.random() * (5 - 3.5) + 3.5, // Simulating rating
                        total_product: store.total_product, // Simulating product count
                    };
                });

                console.log("formated store",formattedStores);
                
                setStores(formattedStores); // ✅ Now correctly typed
                setFilteredStores(formattedStores);
            });
    }
}, [dispatch, user]);

console.log("stooress",stores);
console.log("filterrddddd stooress",filteredStores);

//   Apply filtering when filter or stores change
  useEffect(() => {
    if (stores.length > 0) {
      const updatedStores = stores.filter(
        (store) =>
          store.distance <= filter.distance &&
        //   store.rating >= filter.rating &&
          store.total_product >= filter.products
      );
      setFilteredStores(updatedStores);
    }
  }, [filter, stores]);

  return (
    <>
    <UserHeader/>
    <div className="min-h-screen bg-gray-100 p-6">
      {/* <h1 className="text-3xl font-bold text-center mb-6">🛒 Available Stores</h1> */}

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <select
          className="p-2 border rounded"
          value={filter.distance}
          onChange={(e) => setFilter({ ...filter, distance: Number(e.target.value) })}
        >
          <option value={10}>Within 10 km</option>
          <option value={20}>Within 20 km</option>
        </select>
        {/* <select
          className="p-2 border rounded"
          value={filter.rating}
          onChange={(e) => setFilter({ ...filter, rating: Number(e.target.value) })}
        >
          <option value={4.0}>4+ Stars</option>
          <option value={4.5}>4.5+ Stars</option>
        </select> */}
        {/* <select
          className="p-2 border rounded"
          value={filter.products}
          onChange={(e) => setFilter({ ...filter, products: Number(e.target.value) })}
        >
          <option value={50}>50+ Products</option>
          <option value={100}>100+ Products</option>
        </select> */}
      </div>

      {/* Store List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <motion.div
              key={store.store.id}
              className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaStore className="text-blue-500" /> {store.store.name}
              </h2>
              <p className="flex items-center gap-2 mt-2">
                {/* <FaStar className="text-yellow-500" /> {store.rating} Stars */}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <FaBoxOpen className="text-green-500" /> {store.total_product} Products
              </p>
              <p className="flex items-center gap-2 mt-1">
                <FaMapMarkerAlt className="text-red-500" /> {(Number(store.distance)*1.5).toFixed(2)} km Away
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full" 
  onClick={() => navigate(`/stores/autoparts/${store.store.id}?distance=${(Number(store.distance)*1.5).toFixed(2)}`)}
  >
                Visit Store
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No stores match your criteria.</p>
        )}
      </div>
    </div>
          </>
  );
};

export default ClientStoreHome;
