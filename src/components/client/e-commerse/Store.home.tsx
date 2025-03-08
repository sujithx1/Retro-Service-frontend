import { useState, useEffect } from "react";
import { FaStore, FaBoxOpen, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { User_get_20kmstores } from "../../../reducers/users/UserapiCalls";
import { User_Get_AllStores } from "../../../types/clients/UsersTypes";
import UserHeader from "../header/Header";
import { useNavigate } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";

const ClientStoreHome = () => {
  const [filter, setFilter] = useState({ distance: 20, rating: 4.0, products: 0 });
  const [stores, setStores] = useState<User_Get_AllStores[]>([]);
  const [filteredStores, setFilteredStores] = useState<User_Get_AllStores[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key || "",
    libraries: ["places"],
  });
  useEffect(() => {
    if (user && user.location) {
      dispatch(User_get_20kmstores(user.location))
        .unwrap()
        .then((res) => {
          // Initialize stores with a default distance of 0
          const formattedStores: User_Get_AllStores[] = res.map((store: User_Get_AllStores) => ({
            store: store.store,
            distance: 0, // Initialize distance as 0 instead of null
            rating: Math.random() * (5 - 3.5) + 3.5, // Simulating rating
            total_product: store.total_product,
          }));
          setStores(formattedStores);
          setFilteredStores(formattedStores);

          // Calculate distances asynchronously
          formattedStores.forEach((store, index) => {
            if (isLoaded&&store.store.location && user.location) {
              const directionsService = new google.maps.DirectionsService();
              directionsService.route(
                {
                  origin: { lat: store.store.location.lat, lng: store.store.location.lng },
                  destination: { lat: user.location.lat, lng: user.location.lng },
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (result&&status === google.maps.DirectionsStatus.OK && result.routes[0].legs[0].distance) {
                    const distance = result.routes[0].legs[0].distance.value / 1000; // Convert to km
                    const updatedStores = [...formattedStores];
                    updatedStores[index].distance = distance; // Update distance
                    setStores(updatedStores);
                    setFilteredStores(updatedStores);
                  } else {
                    console.error("Error fetching directions:", status);
                  }
                }
              );
            }
          });
        });
    }
  }, [dispatch, user,isLoaded]);

  useEffect(() => {
    if (stores.length > 0) {
      const updatedStores = stores.filter(
        (store) =>
          store.distance <= filter.distance && // Ensure distance is a number
          store.total_product >= filter.products
      );
      setFilteredStores(updatedStores);
    }
  }, [filter, stores]);



  if (loadError) {
    return <div className="text-red-500 text-center">Map cannot be loaded.</div>;
  }


  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-center gap-4 mb-6">
          <select
            className="p-2 border rounded"
            value={filter.distance}
            onChange={(e) => setFilter({ ...filter, distance: Number(e.target.value) })}
          >
            <option value={10}>Within 10 km</option>
            <option value={20}>Within 20 km</option>
          </select>
        </div>

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
                  <FaBoxOpen className="text-green-500" /> {store.total_product} Products
                </p>
                <p className="flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-red-500" /> {store.distance.toFixed(2)} km Away
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                  onClick={() => navigate(`/stores/autoparts/${store.store.id}?distance=${store.distance.toFixed(2)}`)}
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