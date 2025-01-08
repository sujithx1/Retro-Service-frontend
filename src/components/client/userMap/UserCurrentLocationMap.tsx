import { FC, useEffect, useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

type Library = 'places'; // Explicitly define the type for the library

// Static libraries definition
const libraries: Library[] = ['places']; // Use the explicit type for the library

interface Props {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose:()=>void
}

const UserCurrentLocationMap: FC<Props> = ({ onLocationSelect ,onClose}) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isAddressLoading, setIsAddressLoading] = useState<boolean>(false);


  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key, // Ensure the key is correct
    libraries, // Use the static array
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
    setIsAddressLoading(true);  // Set loading state
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setIsAddressLoading(false);  // Set loading state to false
      if (status === 'OK' && results && results[0]) {
        setAddress(results[0].formatted_address);
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

  const handleConfirm = () => {
    if (selectedLocation && address) {
      onLocationSelect({ ...selectedLocation, address });
      onClose()
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div>
      <GoogleMap
        center={selectedLocation || currentLocation || { lat: 0, lng: 0 }}
        zoom={selectedLocation || currentLocation ? 15 : 2}
        mapContainerStyle={{ width: '100%', height: '400px' }}
        onClick={onMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>

      {address || isAddressLoading ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
          {isAddressLoading ? (
            <p>Loading address...</p>
          ) : (
            <>
              <p className="font-semibold">Selected Location:</p>
              <p>{address}</p>
              <button
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default UserCurrentLocationMap;
