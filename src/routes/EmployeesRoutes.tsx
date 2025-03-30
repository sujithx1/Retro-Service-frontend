import { Routes,Route, useNavigate } from "react-router-dom";
import EmployeeSignup from "../pages/employees/signup/EmployeeSignup";
import Emp_Home from "../pages/employees/home/Emp_Home";
import NotFound from "../components/NotFound";
import Emp_Login from "../pages/employees/login/Emp_Login";
import Profile_Employee from "../pages/employees/profile/Profile_Employee";
import Emp_protecter from "../components/employee/protect/Emp_protecter";
import Emp_jobs from "../pages/employees/jobs/Emp_jobs";
import UnconfirmedBookings from "../pages/employees/booking/Emp_Booking";
import Emp_BookingHistory from "../pages/employees/booking/Emp_BookingHistory";
import ChatList from "../pages/employees/chat/ChatListEmployeeside";
import Emp_forgotPass_otp from "../pages/employees/login/Emp_forgotPass_otp";
import Emp_forgotPass from "../pages/employees/login/Emp_forgotPass";
import EmpCurrentLocationMap from "../components/employee/mechmap/SelectlocationMap";
import { useEffect, useRef, useState,  } from "react";
import socket from "../socket/socket";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import TransactionHistory from "../pages/clients/transactions/TransactionHistory";
import { CallData } from "../types/employee/EmployeeTypes";
import MEEET from "../components/calls/Videocall2";
import IncomingCallPopup from "../components/notification/incomecall";
// import Videocall from "../components/calls/Videocall";
// import Emp_call from "../components/employee/call/emp_call";
// import Call from "./call";
// import CallPage from "./Callercomponent";

// import VideoCallLobby from "../components/calls/Lobby";
// import { CallData } from "../types/employee/EmployeeTypes";

// import EmployeeChat from "../pages/employees/chat/Chatewindow";

const EmployeesRoutes = () => {
  const { employee } = useSelector((state: RootState) => state.employee);
  const notificationSound = useRef(new Audio("/wet-431.mp3"));
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);

  const canPlaySoundRef = useRef(false); // ✅ Use ref to track state outside React
const navigate=useNavigate()
  useEffect(() => {
    socket.emit("register", "employee", employee?.id);


    socket.off("callIncoming");

    socket.on("callIncoming", (data: CallData) => {
      console.log("Incoming call:", data);
      setIncomingCall(data);
    });
    socket.on("disconnect-call", (data) => {
      console.log("Incoming call:", data);
      setIncomingCall(null);
    });

   
    // Enable sound when user clicks
    const enableSound = () => {
      canPlaySoundRef.current = true; // ✅ Update ref to keep track of state
      document.removeEventListener("click", enableSound);
    };

    document.addEventListener("click", enableSound);

    // Listen for new booking notifications
    socket.on("bookingNotification", (booking) => {
      if (!Array.isArray(booking)) return;

      const matchedBooking = booking.find((emp) => emp?.employeeId === employee?.id);

      if (matchedBooking) {
        console.log("Received New Booking:", matchedBooking);

        // ✅ Check `canPlaySoundRef` instead of state
        if (canPlaySoundRef.current) {
          notificationSound.current.play().catch((err) => console.error("Sound play error:", err));
        }

        // Show toast notification
        toast.info(`New Booking Available`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    return () => {
      socket.off("bookingNotification");
      document.removeEventListener("click", enableSound);
      socket.off('callIncoming')
    };
  }, [employee?.id]);
  

  const acceptCall = (callData: CallData) => {
    console.log("📞 Call accepted function triggered with:", callData);

    if (!socket) {
        console.error("❌ Socket is undefined!");
        return;
    }

    if (!callData.roomId) {
        console.error("❌ Missing Room ID!");
        return;
    }

    // console.log("✅ Emitting 'joinCall' for room:", callData.roomId);
    // socket.emit("joinCall", { roomId: callData.roomId });

    console.log("✅ Emitting 'callAccepted' event...");
    setTimeout(() => {
      socket.emit("acceptCall", { roomId: callData.roomId, employeeId: callData.receiverId });
    }, 500);

    setIncomingCall(null)
    navigate(`/employee/call?type=${callData.callType}&action=${'receiver'}&sender=${callData.senderId}&receiver=${callData.receiverId}&senderName=${callData.senderName}&roomId=${callData.roomId}`)
    
    console.log("🔄 Removing 'callIncoming' listener...");
    socket.off('acceptCall');
};


const rejectCall=(callData:CallData)=>{
  setIncomingCall(null)
  socket.emit('rejectCall',{senderId:callData.senderId,roomId:callData.roomId})

  socket.off('rejectCall')  
}

  

  return (
    <>

{incomingCall && (
        // <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg">
        //   <p>{incomingCall.senderName} is calling...</p>
        //   <button className="bg-green-500 px-4 py-2 rounded mr-2" onClick={() => acceptCall(incomingCall)}>
        //     Accept
        //   </button>
        //   <button className="bg-red-500 px-4 py-2 rounded" onClick={() => rejectCall(incomingCall)}>
        //     Reject
        //   </button>
        // </div>
        <IncomingCallPopup incomingCall={incomingCall} acceptCall={()=>acceptCall(incomingCall)}  rejectCall={()=>rejectCall(incomingCall)}/>
      )}

    <Routes>

    <Route path="forgot-password/otp" element={<Emp_forgotPass_otp/>}/>
    <Route path="forgot-password" element={<Emp_forgotPass/>}/>
    {/* <Route path="emp-chatt" element={<ChatWindow/>} /> */}

       
        <Route path="signup" element={
                    <Emp_protecter>

                      <EmployeeSignup/>
                    </Emp_protecter>

          }/>
        <Route path="home" element={
          <Emp_protecter>

            <Emp_Home/>
           </Emp_protecter> 
          }/>
        <Route path="change-location/:id" element={
          <Emp_protecter>

            <EmpCurrentLocationMap/>
           </Emp_protecter> 
          }/>
        <Route path="login" element={
           <Emp_protecter>

             <Emp_Login/>
           </Emp_protecter>

          }/>
        <Route path="profile" element={
          <Emp_protecter>

            <Profile_Employee/>
          </Emp_protecter>
          }/>
        <Route path="jobs" element={
          <Emp_protecter>

            <Emp_jobs/>
          </Emp_protecter>
          }/>
        <Route path="booking" element={
          
<Emp_protecter>

  <UnconfirmedBookings/>
</Emp_protecter>
          }/>
        <Route path="booking-history" element={
          
<Emp_protecter>

  <Emp_BookingHistory/>
</Emp_protecter>
          }/>
<Route path="chat" element={
  <Emp_protecter>

    <ChatList/>
  </Emp_protecter>

  } />
<Route path="transactions" element={
  <Emp_protecter>

    <TransactionHistory/>
  </Emp_protecter>

  } />
<Route path="call" element={
  <Emp_protecter>

    <MEEET/>
  </Emp_protecter>

  } />


<Route path="*" element={<NotFound />} />
    </Routes>
      
    </>
  )
}

export default EmployeesRoutes
