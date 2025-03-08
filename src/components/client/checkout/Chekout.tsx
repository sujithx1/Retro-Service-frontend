import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { Cart } from '../../../types/clients/UsersTypes';
import { User_get_CartnyUserId, User_Get_storeDetails } from '../../../reducers/users/UserapiCalls';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Store_types } from '../../../types/storetypes';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
};

const Checkout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const [cartProduct, setCartProduct] = useState<Cart | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [storeDetails, setStoreDetails] = useState<Store_types | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'wallet' | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key || "",
    libraries: ["places"],
  });

  const navigate=useNavigate()
  useEffect(() => {
    if (user?.id) {
      dispatch(User_get_CartnyUserId(user.id))
        .unwrap()
        .then((res) => setCartProduct(res))
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (cartProduct?.storeId) {
      dispatch(User_Get_storeDetails(cartProduct.storeId))
        .unwrap()
        .then((res) => {
          setStoreDetails(res);
          setShowMap(true);
        })
        .catch((err) => console.error("Error fetching store details:", err));
    }
  }, [dispatch, cartProduct]);

  useEffect(() => {
    if (isLoaded && storeDetails?.location && user?.location) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: storeDetails.location.lat, lng: storeDetails.location.lng },
          destination: { lat: user.location.lat, lng: user.location.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (result && status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const route = result.routes[0].legs[0];
            setDistance(route && route.distance?.value ? route.distance.value / 1000 : null);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [isLoaded, storeDetails, user]);

  const handlePaymentMethodChange = (method: 'razorpay' | 'stripe' | 'wallet') => {
    setPaymentMethod(method);
    
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    navigate(`/stores/checkout/${paymentMethod}/${user?.id}`)

  };

  const total = cartProduct?.products.reduce((sum, product) => sum + product.price , 0);

  if (loadError) {
    return <div className="text-red-500 text-center">Map cannot be loaded.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">{user?.username}</div>
              <div className="p-4 bg-gray-100 rounded-lg">{user?.email}</div>
              <div className="p-4 bg-gray-100 rounded-lg">{user?.location?.address?.suburb}, {user?.location?.address?.town}</div>
            </div>
            <h3 className="text-lg font-semibold mt-6">Order Summary</h3>
            <div className="mt-4 space-y-2">
              {cartProduct?.products.map((product) => (
                <div key={product.product._id} className="flex justify-between">
                  <span>{product.product.name}</span>
                  <span>{product.quantity} x ₹{product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between font-semibold border-t pt-4">
              <span>Total</span>
              <span>₹{total?.toFixed(2)}</span>
            </div>
            <h3 className="text-lg font-semibold mt-6">Payment Method</h3>
            <div className="mt-4 space-y-2">
              {['razorpay', 'stripe', 'wallet'].map((method) => (
                <label key={method} className="flex items-center space-x-3">
                  <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => handlePaymentMethodChange(method as 'razorpay' | 'stripe' | 'wallet')} className="form-radio h-5 w-5 text-indigo-600" />
                  <span className="capitalize">{method}</span>
                </label>
              ))}
            </div>
            <button type="submit" className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition">Place Order</button>
          </form>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Delivery Location</h2>
          {isLoaded && showMap && storeDetails?.location && user?.location ? (
            <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: (storeDetails.location.lat + user.location.lat) / 2, lng: (storeDetails.location.lng + user.location.lng) / 2 }} zoom={12}>
              <Marker position={storeDetails.location} label="Store 🏪" />
              <Marker position={user.location} label="User 👤" />
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          ) : (
            <p className="text-gray-500">Loading map...</p>
          )}
          <p className="mt-4 text-center font-semibold">Distance: {distance} km</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
