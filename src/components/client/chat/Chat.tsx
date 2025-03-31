import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { AppDispatch } from "../../../store/store";
import { useDispatch } from "react-redux";
import { employee_get_MessagesemployeeId } from "../../../reducers/employees/EmployeeApicalls";
import { EmployeeStateTypes, Response_ChatsTypes } from "../../../types/employee/EmployeeTypes";
import { user_get_EmployeeDetails } from "../../../reducers/users/UserapiCalls";

// interface Message {
//   sender: string;
//   message: string;
//   timestamp: string;
//   status?: "seen" | "delivered"; // Add status for user messages
// }

interface Props {
  userName: string;
  userId: string;
  employeeId: string;
  onclose:()=>void
}

const UserChat: React.FC<Props> = ({
  userId,
  employeeId,
  onclose
}) => {
  const [messages, setMessages] = useState<Response_ChatsTypes[]>([]);
  const [employeeDetails,setEmployeeDetails]=useState<EmployeeStateTypes>()
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference to scroll to the bottom
const dispatch:AppDispatch=useDispatch()
console.log("employeeid",employeeId);

  useEffect(() => {
    if (!employeeId) {
      console.error("Employee ID is missing. Ensure an employee is selected.");
      return;
    }
    dispatch(user_get_EmployeeDetails(employeeId)).unwrap()
    .then((result) => {
      console.log(result)
      setEmployeeDetails(result)

      
      
    }).catch((err) => {
      console.log(err);
      
      
    });

    dispatch(employee_get_MessagesemployeeId(userId))
    .unwrap()
    .then((result: Response_ChatsTypes[]) => {
              const filteredMessages = result.filter(
                (msg) =>
                  (msg.sender === userId && msg.receiver === employeeId) ||
                  (msg.sender === employeeId && msg.receiver === userId)
              );
              console.log("fileter",filteredMessages);
              
              setMessages(filteredMessages);
        




    }).catch((err) => {
      console.log(err);
      
      
    });  
    // Connect to the socket server
    const newSocket = io(import.meta.env.VITE_SOCKET_URL); // Replace with your backend server URL
    setSocket(newSocket);

    newSocket.emit("register", "user", userId);

    // Fetch previous messages when the component mounts

    newSocket.on("chatMessage", (data: Response_ChatsTypes) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

  

    return () => {
      newSocket.disconnect();
    };
  }, [userId, employeeId,dispatch]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket) {
      const newMessage: Response_ChatsTypes = {
        sender: userId,
        receiver:employeeId,
        message: inputMessage,
        timestamp: new Date().toISOString(),
        // status: "delivered",.
        userType:"employee"
      };

      // socket.emit("sendMessage", {
      //   sender: userId,
      //   receiver: employeeId,
      //   message: inputMessage,
      //   userType: "employee",
      //   timestamp: newMessage.timestamp,
      // });
      socket.emit('sendMessage',newMessage)

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
    }
  };

  return (
    <div className="w-full h-full max-w-lg mx-auto flex flex-col bg-gray-50 shadow-lg rounded-lg">
    {/* Header */}
    <div className="p-4 bg-gray-800 flex items-center justify-between rounded-t-xl shadow-lg">
  <div className="flex items-center">
    <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden border-2 border-cyan-400">
      <img
        src={employeeDetails?.profilePic || "/default-avatar.png"}
        alt="User Avatar"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="ml-3">
      <h3 className="text-base font-semibold text-gray-200">
        {employeeDetails?.username || "employee"}
      </h3>
      <p className="text-xs text-gray-400">Online</p>
    </div>
  </div>
  <button
    className="ml-auto p-2 text-gray-300 hover:text-gray-100 bg-gray-700 hover:bg-gray-600 rounded-full transition duration-200"
    onClick={onclose}
    aria-label="Close"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 8.586l3.95-3.95a1 1 0 111.414 1.414L11.414 10l3.95 3.95a1 1 0 01-1.414 1.414L10 11.414l-3.95 3.95a1 1 0 11-1.414-1.414L8.586 10 4.636 6.05A1 1 0 016.05 4.636L10 8.586z"
        clipRule="evenodd"
      />
    </svg>
  </button>
</div>


    {/* Messages */}
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
            {/* Message Bubble Tail */}
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
      {/* This is the ref for scrolling to the bottom */}
      <div ref={messagesEndRef} />
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

export default UserChat;
