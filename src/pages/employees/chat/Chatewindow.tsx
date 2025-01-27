import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store"; // Adjust the path based on your project structure
import { io, Socket } from "socket.io-client";

interface Message {
  from: string;
  message: string;
  timestamp: string;
  status?: "seen" | "delivered"; // Add status for user messages
}

const ChatWindow: React.FC = () => {
  // State to manage messages and socket connection
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgFrom, setMsgFrom] = useState<string>("");
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  // Get the logged-in employee's data from Redux
  const { employee } = useSelector((state: RootState) => state.employee);

  useEffect(() => { 
    if (!employee || !employee.id) {
      console.error("Employee data is missing. Ensure the employee is logged in.");
      return;
    }

    // Connect to the backend socket server
    const newSocket = io("http://localhost:3000"); // Replace with your backend server URL
    setSocket(newSocket);

    // Register employee after connecting
    newSocket.emit("register", "employee", employee.id);

    // Listen for incoming chat messages
    newSocket.on("chatMessage", (data: Message) => {
        console.log(data);
        setMsgFrom(data.from)
        
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [employee]);

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (inputMessage.trim() && socket&&employee) {
      // Send message to the server
      socket.emit("sendMessage", {
        sender: employee.id,
        receiver: msgFrom,
        message: inputMessage,
        userType:"user"
      });

      const newMessage: Message = {
        from: "You",
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "delivered",
      };
      // Append the message to the local state
     
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");
      

    }
  };

  return (
    <div className="w-full h-full max-w-lg mx-auto flex flex-col bg-gray-100 shadow-lg rounded-lg">
    {/* Header */}
    <div className="p-4 bg-green-600 text-white flex items-center rounded-t-lg">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
        <img
          src={employee?.profilePic || ""}
          alt="Employee Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-bold">{employee?.username}</h3>
        <p className="text-sm">Online</p>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.from === "You" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs p-3 rounded-lg text-sm relative shadow-md ${
              msg.from === "You"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <p>{msg.message}</p>
            <div className="text-xs text-gray-300 mt-1 flex items-center justify-end space-x-1">
              <span>{msg.timestamp}</span>
              {msg.from === "You" && (
                <span>{msg.status === "seen" ? "✓✓" : "✓"}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Input Field */}
    <div className="p-4 bg-gray-50 border-t border-gray-300 flex items-center rounded-b-lg">
      <input
        type="text"
        className="flex-1 p-2 border rounded-lg outline-none text-sm"
        placeholder="Type a message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
        }}
      />
      <button
        className="ml-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  </div>
  );
};

export default ChatWindow;
