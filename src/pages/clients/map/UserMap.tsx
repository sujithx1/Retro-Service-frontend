import { useState, useEffect, FC } from "react";
import { useJsApiLoader, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Skelton from "./Skelton";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { User_get_Employees } from "../../../reducers/users/UserapiCalls";
import axios from "axios";
import { Emp_Location_Types } from "../../../types/employee/EmployeeTypes";
import { selectEmployee } from "../../../reducers/users/UserReducers";
interface Props{
  onclose:()=>void
}
const UserMap:FC<Props> = ({onclose}) => {

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { employee } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [mechanicLocations, setMechanicLocations] = useState<Emp_Location_Types[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState<Emp_Location_Types | null>(null);
  

  const [placeName, setPlaceName] = useState<string>("");


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Google_map_APi_key,
    libraries: ["places"],
  });

  useEffect(() => {
    dispatch(User_get_Employees());
  }, [dispatch]);
  
  
  useEffect(() => {
    if (employee.length>0) {
      
      
      const fetchMechanicLocations = async () => {
      try {
        const updatedLocations = await Promise.all(
          employee.map(async (emp) => {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json`,
              {
                params: {
                  address: emp.location,
                  key: import.meta.env.VITE_Google_map_APi_key,
                },
              }
            );

            if (response.data.status === "OK") {
              const { lat, lng } = response.data.results[0].geometry.location;
              return { id: emp.id, 
                username: emp.username,
                 lat, lng, 
                location:emp.location ,
                email:emp.email,
                userlocation:placeName
              };
            } else {
              console.error(
                `Failed to fetch lat/lng for ${emp.location}: ${response.data.status}`
              );
              return null;
            }
          })
        );
        
        setMechanicLocations(updatedLocations.filter((loc) => loc !== null));
      } catch (error) {
        console.error("Error fetching mechanic locations:", error);
      }
    };
    
    fetchMechanicLocations();
  }
}, [employee,placeName]);


console.log("employeee ",selectedMechanic);




  const fetchPlaceName = async (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_Google_map_APi_key;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url); // Axios already parses JSON
      const data = response.data; // Access parsed JSON directly
  
      if (data.status === "OK" && data.results.length > 0) {
        setPlaceName(data.results[0].formatted_address);
        console.log("Placeccccccccccccccccccccccccccccccccc:", data.results[0].formatted_address);
      } else {
        console.error("No results found for the given coordinates.");
      }
    } catch (error) {
      console.error("Error fetching place name:", error);
    }
  };
  
useEffect(() => {
  if (navigator.geolocation) {
    console.log("current location .. . . .. . . ."+navigator.geolocation.getCurrentPosition);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
       
        console.log("positionnnnnnnnnnnn",position);
        
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        fetchPlaceName(latitude, longitude);

      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation not supported by this browser.");
  }
}, []);
// Get user's current location
 
  if (!isLoaded || !currentLocation) {
    return <Skelton />;
  }
  const center = currentLocation;



  const handleConnectEmp=()=>{
    console.log("placeeeeeeeeeeeeeee",placeName);
    if (!selectedMechanic) {
      return
    }
    const updateEmployee:Emp_Location_Types={
       id:selectedMechanic.id,
       username:selectedMechanic.username,
       email:selectedMechanic.email,
       location:selectedMechanic.location,
       userLocation:placeName,
       lat:selectedMechanic.lat,
       lng:selectedMechanic.lng


    }
    dispatch(selectEmployee(updateEmployee))
    onclose()
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full h-96">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              label={{
                text: "You",
                fontSize: "14px",
                fontWeight: "bold",
              }}
              // icon={{
              //   url:' /location.png' , // Custom pulsating marker
              //   scaledSize: new google.maps.Size(30, 30),
              // }}
            />
          )}

          {/* Mechanic Markers */}
          {mechanicLocations.map((mechanic) => (
            <Marker
              key={mechanic.id}
              position={{ lat: mechanic.lat, lng: mechanic.lng }}
              icon={{
                url: "/icons8-mechanic-96.png",
                scaledSize: new google.maps.Size(40, 40),
              }}
              onClick={() => setSelectedMechanic(mechanic)}
            />
          ))}

          {/* Info Window for Selected Mechanic */}
          {selectedMechanic && (
            <InfoWindow
              position={{
                lat: selectedMechanic.lat,
                lng: selectedMechanic.lng,
              }}
              onCloseClick={() => setSelectedMechanic(null)}
            >
              
  <div className="p-4 bg-white shadow-md rounded-lg text-center">
    <h3 className="text-lg font-bold text-gray-800">{selectedMechanic.username}</h3>
    <p className="text-sm text-gray-600">
      Location: <span className="font-medium">{selectedMechanic.location}</span>
    </p>
    <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition" 
  
    onClick={handleConnectEmp
    } >
      Connect
    </button>
  </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default UserMap;
