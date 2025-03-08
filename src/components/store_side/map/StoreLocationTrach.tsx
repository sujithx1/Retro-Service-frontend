import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

interface Props {
  storeLat: number;
  storeLng: number;
  userLat: number;
  userLng: number;
}

const StoreLocationDistanceTracker: React.FC<Props> = ({
  storeLat,
  storeLng,
  userLat,
  userLng,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key || "",
    libraries: ["places"],
  });

  if (loadError) {
    return <div className="text-red-500 text-center">Map cannot be loaded.</div>;
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-gray-300">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{
            lat: (storeLat + userLat) / 2,
            lng: (storeLng + userLng) / 2,
          }}
          zoom={12}
        >
          {/* Store Marker */}
          <Marker position={{ lat: storeLat, lng: storeLng }} label="Store" />

          {/* User Marker */}
          <Marker position={{ lat: userLat, lng: userLng }} label="User" />
        </GoogleMap>
      ) : (
        <p className="text-center text-gray-500">Loading map...</p>
      )}
    </div>
  );
};

export default StoreLocationDistanceTracker;
