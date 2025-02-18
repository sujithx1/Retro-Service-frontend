import Footer from "../../../components/client/footer/Footer";
import UserHeader from "../../../components/client/header/Header";
import { useEffect, useState, useCallback } from "react";
import ServiceBooking from "../../../components/client/booking/ServiceBooking";
import { JobsStateTypes } from "../../../types/admin/admintypes";
import useraxiosInstance from "../../../axios-api/Usersideapi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

let debounceTimer:ReturnType<typeof setTimeout>; // Declare a debounce timer globally

const UserHome = () => {
  const [searchItem, setSearchItem] = useState<string>(""); // Search input value
  const [services, setServices] = useState<JobsStateTypes[]>([]); // Array for services fetched from backend
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message
  const [service, setService] = useState<JobsStateTypes>({
    id: "",
    name: "",
    description: "",
    minimum_wage: 0,
    image: "",
  });


  const [showModal, setShowModal] = useState(false); // Modal state for booking
  const {user}=useSelector((state:RootState)=>state.user)
  // Function to fetch services from the backend
  const fetchServices = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await useraxiosInstance.get(`/home?search=${query}`);
      console.log(response);

      const data = Array.isArray(response.data.services) ? response.data.services : []; // Ensure response data is an array
      console.log(data);

      setServices(data); // Set services from backend
    } catch (err) {
      setError("Failed to fetch services: " + err); // Set error if the request fails
    } finally {
      setLoading(false); // Stop loading spinner
    }
  }, []);

  // Effect to fetch all services on initial render
  useEffect(() => {
    fetchServices(""); // Fetch all services initially
  }, [fetchServices]);

  // Handle search input changes with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchItem(query);

    // Clear the previous timer and set a new one
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      fetchServices(query); // Fetch services after debounce delay
    }, 300); // 300ms debounce delay
  };

  // Handle service booking
  const handleServiceBooking = (job: JobsStateTypes) => {
    setService(job); // Set the selected service
    setShowModal(true); // Open the modal
  };
  const navigate=useNavigate()

  return (
    <>
   
      <UserHeader />

      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/service.jpeg')",
          height: "70vh",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-opacity-40"></div>

        {/* Header */}
        <div className="relative z-10 text-center text-white py-16">
          <h1 className="text-4xl font-bold">Services</h1>
          <p className="mt-4 text-lg">Explore the wide range of services we offer.</p>
        </div>

        {/* Search and Filter */}

        <div className="relative z-10 bg-white py-6 px-4 shadow-md">
  <div className="max-w-4xl mx-auto flex justify-between items-center">
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search services..."
      onChange={handleSearchChange}
      value={searchItem}
      className="border border-gray-300 rounded-lg p-2 w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
    />

    {/* Change Location Button */}
    <button className="ml-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300" onClick={()=>navigate(`/change-location/${user?.id}`)}>
      📍 Change Location
    </button>
  </div>
</div>


        {/* Services List */}
        <div className="relative z-10 bg-gray-50 py-12">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              <p className="col-span-full text-center text-lg text-gray-500">Loading services...</p>
            ) : error ? (
              <p className="col-span-full text-center text-red-500">{error}</p>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={`${service.image}`}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Minimum Wage: <span className="font-medium">₹{service.minimum_wage}</span>
                    </p>
                    <button
                      className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition"
                      onClick={() => handleServiceBooking(service)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-lg text-gray-500">
                  No services found for "<span className="font-medium">{searchItem}</span>". Please try a different search term.
                </p>
              </div>
            )}

            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <ServiceBooking
                  service={service}
                  onClose={() => setShowModal(false)}
                />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default UserHome;
