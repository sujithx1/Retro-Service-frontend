
import  {  useEffect, useState } from "react";
import UserHeader from "../../../components/client/header/Header";
import {   useSelector } from "react-redux";
import {   RootState } from "../../../store/store";
// import { ReviewRating_Types } from "../../../types/clients/UsersTypes";
// import { User_post_Employee_feedBack } from "../../../reducers/users/UserapiCalls";
// import { toast } from "react-toastify";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
const Emp_Service_booking_progress = () => {
  
    // const [reportModal,setReportModal]=useState(false)
    const [rejectionReason, setRejectionReason] = useState<string | null>(null);

    // const {user}=useSelector((state:RootState)=>state.user)
    const {serviceBooking}=useSelector((state:RootState)=>state.user)
    console.log("service booking",serviceBooking);
    
    // const [reportfeedBack,setReportFeedBack]=useState<ReviewRating_Types>({
    //   userId:user?.id||"",
    //   userEmail:user?.email||"",
    //   name:"",
    //   feedBack:"",
    //   employeeId:serviceBooking?.employeeId||"",
    //   rating:0,

      

    // })

    // const handleOnchange_report_feedBack=(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    //   const {name,value}=e.target
    //   setReportFeedBack((prev)=>({
    //     ...prev,
    //     [name]:value
    //   }))



    // }
// const dispatch:AppDispatch=useDispatch()
    // const handleSubmit_report_feedBack=(e:FormEvent)=>{
    //   e.preventDefault()
    //   console.log(reportfeedBack);
    //   dispatch(User_post_Employee_feedBack(reportfeedBack))
    //   .unwrap()
    //   .then(()=>toast.success("success feedback"))
    //   .catch((err)=>toast.error(err))
      
      


    //   }
    
    
    //   // Simulate a rejection reason fetch (replace with API logic)
//   const fetchRejectionReaeson = () => {
   

      
//   };

// useEffect(()=>{
//     dispatch(User_get_service_Booking(serviceBooking.id))
    
// },[dispatch,serviceBooking.id])
// const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds

console.log(serviceBooking);
  // const navigate=useNavigate()
//   useEffect(() => {
//     if (!serviceBooking) {
//         toast.error("The mechanic is currently unavailable for this booking")
//         navigate("/home")
// return

//     }

//     if (serviceBooking.status === "CONFIRMED") {
//         setTimeLeft(0); // Stop timer
//         localStorage.removeItem("timerStartTime"); // Clear timer start time
//         return; // Exit the effect
//       }
    
//     const storedStartTime = localStorage.getItem("timerStartTime");
//     const currentTime = Date.now();

//     if (storedStartTime) {
//       const elapsedTime = Math.floor((currentTime - parseInt(storedStartTime)) / 1000);
//       const remainingTime = Math.max(300 - elapsedTime, 0); // Ensure no negative time
//       setTimeLeft(remainingTime);
//     } else {
//       localStorage.setItem("timerStartTime", currentTime.toString());
//     }

//     const timerInterval = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime <= 1) {
//           clearInterval(timerInterval);
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);


//     if (timeLeft === 0 && serviceBooking.status !== "CONFIRMED") {
//     toast.error("The mechanic is currently unavailable for this booking");
//     navigate("/home");
//     localStorage.removeItem("timerStartTime");
//     return;
//   }

//     return () => clearInterval(timerInterval);
//   }, [navigate,timeLeft,serviceBooking,]);

  // const formatTime = (seconds: number) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
  //     .toString()
  //     .padStart(2, "0")}`;
  // };


  // Call fetch rejection reason for demonstration
  useEffect(() => {
      
    if (!serviceBooking) {
      return
      
    }
      
      if (serviceBooking.status=="CANCELLED") {
          
          
          setRejectionReason("The mechanic is currently unavailable for this booking.");
          
          
        }
    },[serviceBooking])
//     console.log(employeeBook);

  return (
    <>
      <UserHeader />

      <div className="container mx-auto p-8">
        {/* Mechanic Info */}
        <div className="mechanic-info flex flex-col items-center bg-white rounded-lg shadow-lg p-6">
          <img
            src="mechanic-image.jpg" // Replace with actual image URL
            alt="Mechanic"
            className="w-48 h-48 object-cover rounded-full mb-4 border-4 border-blue-500 shadow-md"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Service Booking</h1>

          <div className="flex gap-4">
            <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
              Contact
            </button>
            {/* <button
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
              onClick={() => setReportModal(true)}
            >
              Report as Feedback
            </button> */}
          </div>
        </div>

        {/* Modal */}
        {/* {reportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Report Feedback</h2>
              <form>
                <div className="mb-4">

                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Name
                  </label>
                 
                  <input
                    type="text"
                    id="username"
                    name="name"
                    value={reportfeedBack.name}
                    onChange={handleOnchange_report_feedBack}
                    placeholder="Enter your name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2">
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    name="feedBack"
                    value={reportfeedBack.feedBack}
                    onChange={handleOnchange_report_feedBack}
                    placeholder="Write your feedback here"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    onClick={() => setReportModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={handleSubmit_report_feedBack}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )} */}

        {/* Rejection Banner */}
        {rejectionReason && (
          <div className="rejection-banner bg-red-100 text-red-600 p-4 mt-6 rounded-lg">
            <strong>Booking Rejected:</strong> {rejectionReason}
          </div>
        )}
      </div>
    </>
      );

    
}

export default Emp_Service_booking_progress