import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { employee_get_MessagesemployeeId, employee_get_UserDetails } from "../../../reducers/employees/EmployeeApicalls";
import {  CallData, Response_ChatsTypes } from "../../../types/employee/EmployeeTypes";
import { AppDispatch } from "../../../store/store";
import { UserStateTypes } from "../../../types/clients/UsersTypes";
import socket from "../../../socket/socket";

const ChatDetails = ({ employeeId, userId }: { employeeId: string; userId: string }) => {
  const [messages, setMessages] = useState<Response_ChatsTypes[]>([]);
  const [userDetails, setUserDetails] = useState<UserStateTypes>();
  const [inputMessage, setInputMessage] = useState("");
  // const [sockets, setSocket] = useState<Socket  | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    console.log("🔗 Checking socket connection...");
    if (!socket.connected) {
      socket.connect();
    }
  
    return () => {
      console.log("🛑 Disconnecting socket...");
    };
  }, []);
  
  useEffect(() => {
    if (employeeId && userId) {
      dispatch(employee_get_MessagesemployeeId(employeeId))
        .unwrap()
        .then((result: Response_ChatsTypes[]) => {
          const filteredMessages = result.filter(
            (msg) =>
              (msg.sender === userId && msg.receiver === employeeId) ||
              (msg.sender === employeeId && msg.receiver === userId)
          );
          setMessages(filteredMessages);
        })
        .catch((error) => console.error("Error fetching messages:", error));

      dispatch(employee_get_UserDetails(userId))
        .unwrap()
        .then(setUserDetails)
        .catch(console.error);
    }
  }, [dispatch, employeeId, userId]);

  useEffect(() => {
    // const newSocket = socket;
    // setSocket(newSocket);
    socket.emit("register", "employee", employeeId);

    socket.on("chatMessage", (data: Response_ChatsTypes) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    // socket.off("incomingCall");

    // socket.on("incomingCall", (data: CallData) => {
    //   console.log("Incoming call:", data);
    //   setIncomingCall(data);
    // });

    return () => {
      socket.off('chatMessage');
      // socket.off("incomingCall");

    };
  }, [employeeId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket) {
      const messagePayload: Response_ChatsTypes = {
        sender: employeeId,
        receiver: userId,
        message: inputMessage,
        timestamp: new Date().toISOString(),
        userType: "user",
      };
      socket.emit("sendMessage", messagePayload);
      setMessages((prevMessages) => [...prevMessages, messagePayload]);
      setInputMessage("");
    }
  };

  const acceptCall = (callData: CallData) => {
    console.log("Call accepted:", callData);
    // Handle WebRTC call acceptance logic here
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-xl">
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

      {incomingCall && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg">
          <p>{incomingCall.senderId} is calling...</p>
          <button className="bg-green-500 px-4 py-2 rounded mr-2" onClick={() => acceptCall(incomingCall)}>
            Accept
          </button>
          <button className="bg-red-500 px-4 py-2 rounded" onClick={() => setIncomingCall(null)}>
            Reject
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 scrollbar-hide">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end ${msg.sender === employeeId ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-xs p-3 rounded-xl text-sm shadow-md ${msg.sender === employeeId ? "bg-cyan-600 text-gray-100" : "bg-gray-800 text-gray-200"}`}>
              <p className="text-sm">{msg.message}</p>
              <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {msg.sender === employeeId && <span className="text-cyan-400">✓✓</span>}
              </div>
              <span className={`absolute w-3 h-3 ${msg.sender === employeeId ? "-right-1 bg-cyan-600" : "-left-1 bg-gray-800"} rotate-45 transform`} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center rounded-b-xl">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-700 border border-gray-600 text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button className="ml-3 px-4 py-2 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition text-sm" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatDetails;