import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

interface Props {
  userLat: number;
  userLng: number;
  onClose: () => void;
}

const LocationDistanceTracker: React.FC<Props> = ({ userLat, userLng, onClose }) => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(currentLatLng);
          calculateRoute(currentLatLng, { lat: userLat, lng: userLng });
        },
        (err) => {
          setError('Unable to retrieve your location');
          console.error(err);
        }
      );
    }
  }, [isLoaded, userLat, userLng]);

  const calculateRoute = (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          setDistance(result.routes[0].legs[0].distance?.text || null);
        } else {
          console.error(`Error fetching directions ${result}`);
          setError('Failed to get directions');
        }
      }
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {distance && (
        <div className="mb-6">
          <p className="text-lg font-semibold text-green-600">
            Distance to user location: {distance}
          </p>
        </div>
      )}

      {isLoaded && (
        <div className="rounded-lg overflow-hidden shadow-md">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentPosition || { lat: 0, lng: 0 }}
            zoom={10}
          >
            {currentPosition && <Marker position={currentPosition} />}
            <Marker position={{ lat: userLat, lng: userLng }} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
          </GoogleMap>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 bg-red-100 border border-red-400 rounded-lg p-3">
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationDistanceTracker;

