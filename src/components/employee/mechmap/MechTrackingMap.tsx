import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "12px",
};

interface Props {
  userLat: number;
  userLng: number;
  empLat: number;
  empLng: number;
  onClose: () => void;
}

const LocationDistanceTracker: React.FC<Props> = ({
  onClose,
  userLat,
  userLng,
  empLat,
  empLng,
}) => {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key,
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded) {
      calculateRoute(
        { lat: empLat, lng: empLng },
        { lat: userLat, lng: userLng }
      );
    }
  }, [isLoaded, userLat, userLng, empLat, empLng]);

  const calculateRoute = (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setLoading(false);
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          setDistance(result.routes[0].legs[0].distance?.text || null);
        } else {
          setError("Failed to get directions");
          console.error(`Error fetching directions:`, result);
        }
      }
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
        aria-label="Close"
      >
        ❌
      </button>

      {/* Distance Display */}
      {distance && (
        <div className="mb-4 text-center">
          <p className="text-xl font-semibold text-green-700">
            Distance: <span className="font-bold">{distance}</span>
          </p>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <p className="text-center text-gray-500 text-sm">
          Fetching route information...
        </p>
      )}

      {/* User & Mechanic Info */}
      {/* <div className="flex justify-center gap-4 text-lg mb-4">
        <div className="flex items-center gap-2">
          <img src="/user-icon.png" alt="User Icon" className="w-5 h-5" />
          <p className="text-gray-700 font-semibold">User</p>
        </div>
        <div className="flex items-center gap-2">
          <img src="/mechanic-icon.png" alt="Mechanic Icon" className="w-5 h-5" />
          <p className="text-gray-700 font-semibold">Mechanic</p>
        </div>
      </div> */}

      {/* Map Display */}
      {isLoaded && (
        <div className="rounded-lg overflow-hidden shadow-md border border-gray-300">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: (userLat + empLat) / 2, lng: (userLng + empLng) / 2 }}
            zoom={10}
          >
            {/* User Marker */}
            <Marker
              position={{ lat: userLat, lng: userLng }}
            
              label={{ text: "User", color: "black", fontWeight: "bold" }}
            />

            {/* Mechanic Marker */}
            <Marker
              position={{ lat: empLat, lng: empLng }}
              
              label={{ text: "Mechanic", color: "black", fontWeight: "bold" }}
            />

            {/* Route without "A" and "B" labels */}
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{ suppressMarkers: true }}
              />
            )}
          </GoogleMap>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <p className="mt-4 text-red-500 bg-red-100 border border-red-400 rounded-lg p-3 text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default LocationDistanceTracker;
