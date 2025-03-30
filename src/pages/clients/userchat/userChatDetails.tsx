import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
// import {  Socket } from "socket.io-client";
import { CallData, Response_ChatsTypes } from "../../../types/employee/EmployeeTypes";
import { AppDispatch } from "../../../store/store";
import { UserStateTypes } from "../../../types/clients/UsersTypes";
import { User_get_bookingHistories, user_get_EmployeeDetails, User_get_MessagesUserId } from "../../../reducers/users/UserapiCalls";
import ToastAlert from "../../../components/alert/ToastAlert";
import socket from "../../../socket/socket";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../../utils/uploads";
import MessageAttachment from "./MessageAttachment";
import FileUploader from "./fileUploade";
import AudioRecorder from "./audioRecord";
import { uploadAudioandVideo } from "../../../utils/uploadAudio";


const UserChatDetails = ({ employeeId, userId,userName }: { employeeId: string; userId: string,userName:string }) => {
  const [messages, setMessages] = useState<Response_ChatsTypes[]>([]);
  const [userDetails, setUserDetails] = useState<UserStateTypes>();
  const [inputMessage, setInputMessage] = useState("");
  // const [sockets, setSocket] = useState<Socket | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the end of the message container
  const [chatEnabled, setChatEnabled] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
const [showwarning ,setShowWarning]=useState<boolean>(false)
const navigate=useNavigate()
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);





const handleSendFile = async (file: File) => {
  if (!chatEnabled) {
    setShowWarning(true);
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  try {
    const uploadedFile = await uploadFile(file, (progress) =>
      console.log(`Upload progress: ${progress}%`)
    );

    // socket.emit("register", "user", userId);

    // Ensure that uploadedFile properties are correctly used
    const messagePayload: Response_ChatsTypes = {
      sender: userId,
      receiver: employeeId,
      message: "image",
      timestamp: new Date().toISOString(),
      isRead: false,
      userType: "employee",
      attachment: {
        type: uploadedFile.type,
        url: uploadedFile.url, // ✅ Fixed: Use uploadedFile.url
        name: uploadedFile.name, // ✅ Fixed: Use uploadedFile.name
        size: uploadedFile.size, // ✅ Fixed: Use uploadedFile.size
      },
    };

    socket.emit("sendMessage", messagePayload);
    setMessages((prevMessages) => [...prevMessages, messagePayload]);
  } catch (error) {
    console.error("Error sending file:", error);
    ToastAlert({
      message: "Failed to send file",
      type: "error",
      onClose() {},
    });
  } finally {
    setIsUploading(false);
  }
};



const handleSendAudio = async (audioBlob: Blob) => {
  if (!chatEnabled) {
    setShowWarning(true);
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);
  
  try {
    const fileName = `audio_message_${Date.now()}.wav`;
    const audioFile = new File([audioBlob], `audio_${Date.now()}.mp3`, { type: "audio/mp3" });

    const { url } = await uploadAudioandVideo(audioFile,
      (progress) => setUploadProgress(progress)
    );

    console.log(url);
    
    const messagePayload: Response_ChatsTypes = {
      sender: userId,
      receiver: employeeId,
      message: "[Audio Message]",
      timestamp: new Date().toISOString(),
      isRead: false,
      userType: "employee",
      attachment: {
        type: "audio",
        url,
        name: fileName,
        size: audioBlob.size
      }
    };
    
    socket.emit("sendMessage", messagePayload);
    setMessages((prevMessages) => [...prevMessages, messagePayload]);
  } catch (error) {
    console.error("Error sending audio:", error);
    ToastAlert({ message: "Failed to send audio", type: "error",onClose(){} });
  } finally {
    setIsUploading(false);
  }
};





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
          console.log("resultttttttttttt",result);
          
          const filteredMessages = result.filter(
            (msg) =>
              (msg.sender === employeeId && msg.receiver === userId) ||
              (msg.sender === userId && msg.receiver === employeeId)
          );
          console.log("fileter",filteredMessages);
       
            socket.emit("markAsRead", { sender: employeeId, receiver: userId });
          
          
          
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

    // const newSocket = socket;
    // setSocket(newSocket);

    // newSocket.emit("register", "user", userId);

    // newSocket.on("chatMessage", (data: Response_ChatsTypes) => {
    //   setMessages((prevMessages) => [...prevMessages, data]);
    // });

    // return () => {
    //   if (newSocket) {
    //     newSocket.off('chatMessage');
        
    //   }
    // };
  }, [dispatch, employeeId, userId]);



  useEffect(() => {
    if (!socket) return; // Ensure socket exists
  
    socket.emit("register", "user", userId);
  
    const handleMessage = (data: Response_ChatsTypes) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    
  
      // Emit a read receipt if the received message is from the employee
      if (data.sender === employeeId) {
        socket.emit("markAsRead", { sender: employeeId, receiver: userId });
      }
    }
    socket.on("chatMessage", handleMessage);
  
  
    socket.on("messagesRead", ({ sender }) => {
      console.log("✅ Messages read by:", sender);

      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.sender === sender ? { ...msg, isRead: true } : msg))
      );
    });
    return () => {
      socket.off("chatMessage", handleMessage);
      socket.off('messagesRead')
    };
  }, [userId,employeeId]); // Run only when userId changes
  


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
          isRead: false, // New messages are unread by default

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
  
const handleCall = (callType: "audio" | "video") => {


  if (socket && employeeId) {
    const generatedRoomId = uuidv4(); // Generate a unique ID

    const callData: CallData = {
      senderId: userId,
      senderName:userName,  
      receiverId: employeeId,
      senderProfilePic:userDetails?.profilePic||"",
      callType,
      roomId:generatedRoomId
    };

    socket.emit("call", callData);
    console.log("socket id",socket.id);
   
    
    navigate(`/call?type=${callData.callType}&action=${'sender'}&sender=${callData.senderId}&receiver=${callData.receiverId}&senderName=${callData.senderName}&roomId=${callData.roomId}`)
    console.log(`${callType} call initiated`);
  
  } 
};


const handleAudioCall = () => handleCall("audio");
const handleVideoCall = () => handleCall("video");


  return (
    
      <div className="w-full h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl rounded-xl">
              {showwarning && <ToastAlert message="Please Book now" type="error" onClose={() => setShowWarning(false)} />}
{/* Header Section */}
<div className="p-4 bg-gray-800 flex items-center justify-between rounded-t-xl shadow-lg">
  <div className="flex items-center">
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

  {/* Call Buttons */}
  <div className="flex gap-3">
    <button 
      onClick={handleAudioCall} 
      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition"
    >
      📞
    </button>
    <button 
      onClick={handleVideoCall} 
      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition"
    >
      🎥
    </button>
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
                            { 
              msg.attachment?.url?"":
              <p className="text-sm">{msg.message}
              
              </p>}

                
                    {msg.attachment?.url && <MessageAttachment attachment={msg.attachment}/>}


                
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                     {msg.sender === userId && (
                  <span  className="text-cyan-400">{msg.isRead ? "✓✓" : "✓"}</span>
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

{isUploading && (
          <div className="fixed bottom-20 right-4 bg-gray-800 p-3 rounded-lg shadow-lg">
            <div className="w-64">
              <p className="text-sm text-white mb-1">Uploading...</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{uploadProgress}%</p>
            </div>
          </div>
        )}
    
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
           <div className="flex items-center gap-2 mr-2">
                    <FileUploader 
                      onFileSelect={handleSendFile}
                      disabled={!chatEnabled}
                    />
                    <AudioRecorder 
                      onRecordingComplete={handleSendAudio}
                      disabled={!chatEnabled}
                    />
                  </div>
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
