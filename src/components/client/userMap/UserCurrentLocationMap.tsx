import { useEffect, useState, useRef } from "react";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { User_put_addLocation } from "../../../reducers/users/UserapiCalls";
import { Address_Types, Locationuser_types } from "../../../types/clients/UsersTypes";
import { MapPinIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const libraries: ("places")[] = ["places"]; // Import Google Places API

const UserCurrentLocationMap = () => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<Address_Types | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key, // Ensure API key is correct
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setSelectedLocation({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);

  const reverseGeocode = (lat: number, lng: number) => {
    setIsAddressLoading(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setIsAddressLoading(false);
      if (status === "OK" && results && results[0]) {
        const addressComponents = results[0].address_components;
        const formattedAddress = {
          country: addressComponents.find(comp => comp.types.includes("country"))?.long_name || "",
          county: addressComponents.find(comp => comp.types.includes("administrative_area_level_2"))?.long_name || "",
          neighbourhood: addressComponents.find(comp => comp.types.includes("neighborhood"))?.long_name || "",
          postcode: addressComponents.find(comp => comp.types.includes("postal_code"))?.long_name || "",
          road: addressComponents.find(comp => comp.types.includes("route"))?.long_name || "",
          state: addressComponents.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name || "",
          suburb: addressComponents.find(comp => comp.types.includes("sublocality"))?.long_name || "",
          town: addressComponents.find(comp => comp.types.includes("locality"))?.long_name || "",
          city: addressComponents.find(comp => comp.types.includes("locality"))?.long_name || "",
          state_district: addressComponents.find(comp => comp.types.includes('administrative_area_level_2'))?.long_name || '',

        };
        setAddress(formattedAddress);
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    const latLng = event.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setSelectedLocation({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && address && id) {
      const data: Locationuser_types = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: address,
      };
      dispatch(User_put_addLocation({ id: id, location: data }))
        .unwrap()
        .then(() => {
          navigate(-1);
        });
    }
  };

  const onPlaceSelected = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setSelectedLocation({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  if (loadError) return <div className="text-center text-red-500">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="text-center text-gray-600">Loading Google Maps...</div>;

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* 🔍 Search Bar */}
      <div className="relative w-full max-w-lg">
        <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceSelected}>
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full px-4 py-3 border rounded-lg shadow-md focus:ring focus:ring-blue-300 text-gray-700"
          />
        </Autocomplete>
        <MapPinIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>

      {/* 🗺️ Google Map */}
      <GoogleMap
        center={selectedLocation || currentLocation || { lat: 0, lng: 0 }}
        zoom={selectedLocation || currentLocation ? 15 : 2}
        mapContainerStyle={{ width: "100%", height: "400px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        onClick={onMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>

      {/* 📍 Address Details */}
      {address || isAddressLoading ? (
        <div className="mt-4 p-4 w-full max-w-lg bg-white shadow-md rounded-lg">
          {isAddressLoading ? (
            <p className="text-gray-500 text-center">Fetching address...</p>
          ) : (
            <>
              <p className="font-semibold text-gray-700 mb-2">📍 Selected Location:</p>
              <p className="text-gray-900 bg-gray-100 p-3 rounded-md shadow-sm border">
                {address ? `${address.suburb}, ${address.city}` : "No location selected"}
              </p>

              {/* ✅ Confirm & ❌ Cancel Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  className="flex-1 flex items-center justify-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={handleConfirm}
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" /> Confirm
                </button>
                <button
                  className="flex-1 flex items-center justify-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  onClick={() => navigate(-1)}
                >
                  <XMarkIcon className="w-5 h-5 mr-2" /> Cancel
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default UserCurrentLocationMap;
