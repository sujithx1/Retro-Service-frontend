import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { Response_ChatsTypes } from "../../../types/employee/EmployeeTypes";
import { AppDispatch } from "../../../store/store";
import { UserStateTypes } from "../../../types/clients/UsersTypes";
import { User_get_bookingHistories, user_get_EmployeeDetails, User_get_MessagesUserId } from "../../../reducers/users/UserapiCalls";
import ToastAlert from "../../../components/alert/ToastAlert";

const UserChatDetails = ({ employeeId, userId }: { employeeId: string; userId: string }) => {
  const [messages, setMessages] = useState<Response_ChatsTypes[]>([]);
  const [userDetails, setUserDetails] = useState<UserStateTypes>();
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the end of the message container
  const [chatEnabled, setChatEnabled] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
const [showwarning ,setShowWarning]=useState<boolean>(false)

  useEffect(() => {
    if (userId) {
      dispatch(User_get_bookingHistories(userId))
        .unwrap()
        .then((result) => {
          if (!Array.isArray(result)) return;

          // Check if any booking is confirmed
          const hasConfirmedBooking = result.some((booking) => booking.status === "CONFIRMED");

          // Check if all bookings are completed
          const allJobsCompleted = result.every((booking) => booking.status === "COMPLETED");
console.log('hasConfirmedBooking',hasConfirmedBooking);
console.log('allJobsCompleted',allJobsCompleted);

          setChatEnabled(hasConfirmedBooking);
          setAllCompleted(allJobsCompleted);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [userId, dispatch]);

  





  useEffect(() => {
    if (employeeId && userId) {
      dispatch(User_get_MessagesUserId(userId))
        .unwrap()
        .then((result: Response_ChatsTypes[]) => {
          const filteredMessages = result.filter(
            (msg) =>
              (msg.sender === employeeId && msg.receiver === userId) ||
              (msg.sender === userId && msg.receiver === employeeId)
          );
          console.log("fileter",filteredMessages);
          
          setMessages(filteredMessages);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });

      dispatch(user_get_EmployeeDetails(employeeId))
        .unwrap()
        .then((result) => {
          setUserDetails(result);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.emit("register", "user", userId);

    newSocket.on("chatMessage", (data: Response_ChatsTypes) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [dispatch, employeeId, userId]);


  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (chatEnabled) {
      
      if (inputMessage.trim() && socket && employeeId) {
        const messagePayload: Response_ChatsTypes = {
          sender: userId,
          receiver: employeeId,
          message: inputMessage,
          timestamp: new Date().toISOString(),
          userType: "employee",
        };
  
        socket.emit("sendMessage", messagePayload);
        setMessages((prevMessages) => [...prevMessages, messagePayload]); // Optimistic UI update
        setInputMessage("");
      }
    }else{
      setShowWarning(true)
    }
  };
  

  return (
    
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-xl">
              {showwarning && <ToastAlert message="Please Book now" type="error" onClose={() => setShowWarning(false)} />}

        {/* Header Section */}
        <div className="p-4 bg-gray-800 flex items-center rounded-t-xl shadow-lg">
          <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden border-2 border-cyan-400">
            <img
              src={userDetails?.profilePic || "/default-avatar.png"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-base font-semibold text-gray-200">
              {userDetails?.username || "User"}
            </h3>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
    
        {/* Chat Messages Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 scrollbar-hide">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end ${
                msg.sender === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xs p-3 rounded-xl text-sm shadow-md ${
                  msg.sender === userId
                    ? "bg-cyan-600 text-gray-100"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {msg.sender === userId && (
                    <span className="flex items-center space-x-1">
                      {msg.isRead ? (
                        <span className="text-cyan-400">✓✓</span>
                      ) : (
                        <span className="text-gray-500">✓</span>
                      )}
                    </span>
                  )}
                </div>
                <span
                  className={`absolute w-3 h-3 ${
                    msg.sender === userId
                      ? "-right-1 bg-cyan-600"
                      : "-left-1 bg-gray-800"
                  } rotate-45 transform`}
                />
              </div>
            </div>
          ))}
    
          {/* Scroll to bottom ref */}
          <div ref={messagesEndRef} />
    
          {/* Chat Status Message (Placed at the Bottom) */}
          <div className="mt-4 text-center">
            {chatEnabled ? (
              <button className="bg-blue-500 text-white p-2 rounded hidden">Open Chat</button>
            ) : allCompleted ? (
              <p className="text-gray-600">Already Completed Job</p>
            ) : (
              <p className="text-gray-600">Waiting for Confirmation...</p>
            )}
          </div>
        </div>
    
        {/* Input Section */}
        <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center rounded-b-xl">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />

          
          <button
            className="ml-3 px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition text-sm"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    );
    

};

export default UserChatDetails;
