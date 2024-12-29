
// import Header from "../../../components/client/header/Header";

import { useDispatch, useSelector } from "react-redux";
import Footer from "../../../components/client/footer/Footer";
import { AppDispatch, RootState } from "../../../store/store";
import UserHeader from "../../../components/client/header/Header";
import { useEffect, useState } from "react";
import { JobsStateTypes } from "../../../types/admin/admintypes";
import { User_get_allJobs } from "../../../reducers/users/UserapiCalls";
import ServiceBooking from "../../../components/client/booking/ServiceBooking";
import { reset } from "../../../reducers/users/UserReducers";
const UserHome = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const {jobs}=useSelector((state:RootState)=>state.admin)
  const [searchitem,setSearchItem]=useState<string>("")
  const dispatch:AppDispatch=useDispatch()

  useEffect(()=>{
    dispatch(User_get_allJobs())
   
    dispatch(reset())
    
  },[dispatch])
  console.log(user);
  console.log(jobs.map((li)=>li.image))
  const [service,setSetvice]=useState<JobsStateTypes>({
    id:"",
    name:"",
    description:"",
    minimum_wage:0,
    image:'',
  
  })
  
  const [showModal,setShowModal]=useState(false)


  // const services = [
  //   { id: 1, title: "Electrical And Mechanical", image: "/WrenchBot 3000_ The AI Mechanic Revolutionizing Auto Repairs (Stories about Ai).jpeg" },
  //   { id: 2, title: "Oil Service", image: "/Engine TLC_ Mastering the Art of DIY Oil Changes.jpeg" },
  //   { id: 3, title: "Engine Works", image: "/Roush Engines_.jpeg" },
  //   { id: 4, title: "Painting", image: "/Sign in.jpeg" },
  //   { id: 5, title: "Washing", image: "/The Benefits of Using a Touchless Car Wash in Florida_ A Review of Hypoluxo Car Wash.jpeg" },
  //   { id: 6, title: "Puncher Works", image: "/d6a49c1c-080d-4b56-baad-57ad9e69360d.jpeg" },
  //   { id: 7, title: "Pollution Test", image: "/Getting your Vehicle Smog Tested can help in Saving the Environment.jpeg" },
  // ];


  const filterSearch=jobs.filter((job:JobsStateTypes)=>job.name.toLowerCase().includes(searchitem.toLowerCase())
  
  )

  const handleServiceBooking=(job:JobsStateTypes)=>{
    setSetvice(job)
    setShowModal(true)


  }

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
        <div className="relative z-10 bg-white py-6 px-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search services..."
              onChange={(e)=>setSearchItem(e.target.value)}
              className="border rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Filter Dropdown */}
            <select className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Categories</option>
              <option value="Mechanic">Mechanic</option>
              <option value="Parts">Auto Parts</option>
              <option value="Cleaning">Cleaning</option>
              {/* Add more categories as needed */}
            </select>
          </div>
        </div>
        <div className="relative z-10 bg-gray-50 py-12">
  <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {filterSearch.map((service) => (
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
          <button className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition" onClick={()=>handleServiceBooking(service)}>

            Book Now
          </button>
        </div>
      </div>
    ))}


{showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ServiceBooking
            service={service}
            onClose={()=>setShowModal(false)}
          />
        </div>
      )}

  </div>
</div>

        <Footer />
      </section>
    </>
  )}
  export default UserHome