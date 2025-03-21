import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { user_get_EmployeeDetails, User_get_MessagesUserId } from "../../../reducers/users/UserapiCalls";
import { Response_ChatsTypes } from "../../../types/employee/EmployeeTypes";
import { AppDispatch, RootState } from "../../../store/store";
import { EmployeeStateTypes } from "../../../types/employee/EmployeeTypes";
import { useNavigate } from "react-router-dom";
import UserChatDetails from "./userChatDetails";

const UserChatList = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<Response_ChatsTypes[]>([]);
  const [userDetails, setUserDetails] = useState<Map<string, EmployeeStateTypes>>(new Map()); // Store user details
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (!user?.id) {
      console.warn("User ID is missing!");
      return;
    }

    dispatch(User_get_MessagesUserId(user.id))
      .unwrap()
      .then(async (messages: Response_ChatsTypes[]) => {
        console.log("User Messages:", messages);

        const uniqueConnections = new Map<string, Response_ChatsTypes>();

        messages.forEach((message) => {
          const otherUserId = message.sender === user.id ? message.receiver : message.sender;
          if (!uniqueConnections.has(otherUserId)) {
            uniqueConnections.set(otherUserId, message);
          }
        });

        const employeeIds = Array.from(uniqueConnections.keys());

        const userDetailsPromises = employeeIds.map((empId) =>
        
          dispatch(user_get_EmployeeDetails(empId.toString())).unwrap()
        );

        try {
          const userDetailsResults = await Promise.allSettled(userDetailsPromises);
          const userDetailsMap = new Map<string, EmployeeStateTypes>();

          userDetailsResults.forEach((result, index) => {
            if (result.status === "fulfilled") {
              userDetailsMap.set(employeeIds[index], result.value);
            } else {
              console.warn(`Failed to fetch details for ${employeeIds[index]}`, result.reason);
            }
          });

          setUserDetails(userDetailsMap);
          setChatList(Array.from(uniqueConnections.values()));
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      })
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [dispatch, user?.id]);

  return (
    <div className="flex h-screen bg-black text-gray-200">
      {/* Left: Chat List */}
      <div className="w-1/4 bg-gradient-to-b from-gray-900 to-gray-800 p-6 shadow-lg rounded-xl overflow-y-auto max-h-screen border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Chat List</h2>
          <button
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
            onClick={() => navigate(-1)}
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          {chatList.length > 0 ? (
            chatList.map((chat) => {
              const { message, timestamp } = chat;
              const employeeID = chat.sender === user?.id ? chat.receiver : chat.sender;
              const employee = userDetails.get(employeeID) ?? {
              
                username: "Unknown",
                profilePic: "default-avatar.png",
              };
              {
                console.log(userDetails);
              }

              return (
                <div
                  key={employeeID}
                  className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-cyan-900 transition-transform duration-300 transform hover:-translate-y-1 shadow-lg"
                  onClick={() => setSelectedUserId(employeeID)}
                >
                  {/* Profile Picture */}
                  <img
                    src={employee.profilePic}
                    alt={employee.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-lg font-semibold text-gray-100">{employee.username}</h4>
                    <p className="text-sm text-gray-400 truncate">{message}</p>
                  </div>
                  <small className="text-sm text-gray-500">
                    {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
                  </small>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No chat history found.</p>
          )}
        </div>
      </div>

      {/* Right: Chat Details */}
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 p-8 shadow-2xl rounded-xl overflow-hidden ml-5 max-h-screen border border-gray-700">
        {selectedUserId ? (
          <div className="h-full overflow-y-auto scrollbar-hide">
            <UserChatDetails userName={user?.username||""} employeeId={selectedUserId } userId={user?.id||""} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-300">Start a Conversation</h2>
              <p className="text-gray-400 mt-2">Select a user from the list to begin chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChatList;
