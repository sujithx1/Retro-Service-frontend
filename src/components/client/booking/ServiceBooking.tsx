import { useEffect, useState } from "react";
import { JobsStateTypes } from "../../../types/admin/admintypes";
// import UserMap from "../../../pages/clients/map/UserMap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { toast } from "react-toastify";
import { reset } from "../../../reducers/users/UserReducers";
import { FinduserLocation, Service_Booking_Sendreq_EveryEmp } from "../../../types/clients/UsersTypes";
import {  user_post_service_booking_send_every_Employee } from "../../../reducers/users/UserapiCalls";
import { useNavigate } from "react-router-dom";
import UserCurrentLocationMap from "../userMap/UserCurrentLocationMap";

interface Props {
    service: JobsStateTypes;
    onClose: () => void; // Callback to close the popup
  }
   const ServiceBooking: React.FC<Props> = ({ service, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [problem, setProblem] = useState('');
    const [userLocation,setUserLocation]=useState<FinduserLocation>()
// const [employee, setEmployee] = useState(false);
    // const [showMap, setShowMap] = useState(false);
    const [showuserCurrentLocationMap, setShowuserCurrentLocationMap] = useState(false);
    const {isSuccess,isError,message,user}=useSelector((state:RootState)=>state.user)
    const navigate=useNavigate()
    const dispstch:AppDispatch=useDispatch()
    useEffect(()=>{
        if (isError) {
            toast.error(message)
            dispstch(reset())
            return      
        }
    },[dispstch,isError,isSuccess,message])

    const handleToggleUserCurrentLocationMap = () => {
      setShowuserCurrentLocationMap((prev) => !prev); // Toggle the visibility of the map
    };
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    
      if (userLocation&&user) {
        console.log("find user location ",userLocation)
        
        const serviceBookingData:Service_Booking_Sendreq_EveryEmp={
          userId:user.id,
          userName:user.username,
          userEmail:user.email,
          userLocation:userLocation,
          jobId:service.id,
          jobName:service.name,
          Min_wage:service.minimum_wage,
          problem:problem
          
        }
        dispstch(user_post_service_booking_send_every_Employee(serviceBookingData)).unwrap()
          .then(()=>{toast.success("success Sevice Booking")
            navigate('/req-service/waiting')
          })
          .catch((err)=>toast.error(err))

        
      }
      // if(selectEmp){
      //   console.log("select employeee",selectEmp.userLocation);
        
      //   const serviceData:ServiceBooking_Types={
      //     id:"",
      //       userId:user?.id as string,
      //       userName:name,
      //       userEmail:email,
      //       problem:problem,
      //       employeeId:selectEmp.id,
      //       employeeName:selectEmp.username,
      //       empLocation:selectEmp.location as string,
      //       jobId:service.id,
      //       jobName:service.name,
      //       ServiceMin_wage:service.minimum_wage,
      //       userLocation:selectEmp.userLocation||"",
      //       status:""
      //   }
      //   console.log("serviceeeeeeeeeee",serviceData);
      //   dispstch(user_post_Service_Booking(serviceData)).unwrap()
      //   .then(()=>{toast.success("success Sevice Booking")
      //     navigate('/service-booking/prograss')
      //   })
      //   .catch((err)=>toast.error(err))
      // }
      onClose(); // Close the popup after submission
    };
  

    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Book {service.name}</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="text"
              id="name"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Problem:
            </label>
            <input
              type="text"
              id="name"
              name="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div> 
          <div className="mb-4 ">
          <button
              type="button"
           
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-1"
              onClick={handleToggleUserCurrentLocationMap}
            >
              Choose Location
            </button>
          {/* <button
              type="button"
              onClick={handleToggleMap}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
            location & Employee
            </button> */}


          </div>
          {/* {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
         
            <button
              onClick={handleToggleMap}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ✕
            </button>
            <UserMap onclose={()=>setShowMap(false)}/>
          </div>
        </div>
      )} */}
          {showuserCurrentLocationMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
         
            <button
              onClick={handleToggleUserCurrentLocationMap}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ✕
            </button>
            <UserCurrentLocationMap   onClose={()=>setShowuserCurrentLocationMap(false)}  onLocationSelect={(location) => {
              setUserLocation(location)


    console.log('Selected location:', location);
    // Handle the confirmed location with address
  }}/>
          </div>
        </div>
      )}
          {/* Other fields like email, vehicle number, problem, location */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"         >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default ServiceBooking;
  