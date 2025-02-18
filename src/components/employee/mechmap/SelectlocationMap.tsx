import { useEffect, useState, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { Address_Types, Locationuser_types } from '../../../types/clients/UsersTypes';
import { Emp_put_addLocation } from '../../../reducers/employees/EmployeeApicalls';

const libraries: ('places')[] = ['places'];

const EmpCurrentLocationMap = () => {
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
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key,
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
          console.error('Error getting current location:', error);
        }
      );
    }
  }, []);

  const reverseGeocode = (lat: number, lng: number) => {
    setIsAddressLoading(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setIsAddressLoading(false);
      if (status === 'OK' && results && results[0]) {
        const addressComponents = results[0].address_components;

        setAddress({
            country: addressComponents.find(comp => comp.types.includes('country'))?.long_name || '',
            county: addressComponents.find(comp => comp.types.includes('administrative_area_level_2'))?.long_name || '',
            neighbourhood: addressComponents.find(comp => comp.types.includes('neighborhood'))?.long_name || '',
            postcode: addressComponents.find(comp => comp.types.includes('postal_code'))?.long_name || '',
            road: addressComponents.find(comp => comp.types.includes('route'))?.long_name || '',
            state: addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || '',
            state_district: addressComponents.find(comp => comp.types.includes('administrative_area_level_2'))?.long_name || '',
            suburb: addressComponents.find(comp => comp.types.includes('sublocality'))?.long_name || '',
            town: addressComponents.find(comp => comp.types.includes('locality'))?.long_name || '',
            city: addressComponents.find(comp => comp.types.includes('city'))?.long_name || '',
        });
      } else {
        console.error('Geocoder failed due to: ' + status);
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

  const onPlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
        reverseGeocode(lat, lng);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedLocation && address && id) {
      const data: Locationuser_types = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address,
      };
      dispatch(Emp_put_addLocation({ id, location: data }))
        .unwrap()
        .then(() => navigate(-1));
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={onPlaceSelected}
      >
        <input
          type="text"
          placeholder="Search for a place..."
          className="w-full p-2 border rounded-md mb-4 shadow-sm"
        />
      </Autocomplete>

      <GoogleMap
        center={selectedLocation || currentLocation || { lat: 0, lng: 0 }}
        zoom={selectedLocation || currentLocation ? 15 : 2}
        mapContainerStyle={{ width: '100%', height: '400px' }}
        onClick={onMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
        {isAddressLoading ? (
          <p>Loading address...</p>
        ) : (
          <>
            <p className="font-semibold text-gray-700">📍 Selected Location:</p>
            <p className="text-gray-900 bg-white p-3 rounded-md shadow-sm border">
              {address ? `${address.suburb}, ${address.state}` : 'No location selected'}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                className="flex-1 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                onClick={handleConfirm}
              >
                ✅ Confirm
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                onClick={() => navigate(-1)}
              >
                ❌ Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmpCurrentLocationMap;
