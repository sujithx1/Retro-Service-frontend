import { FaPhone, FaPhoneSlash } from "react-icons/fa";
import { CallData } from "../../types/employee/EmployeeTypes";

type IncomingCallProps = {
  incomingCall: CallData;
  acceptCall: (call: CallData) => void;
  rejectCall: (call: CallData) => void;
};

const IncomingCallPopup = ({ incomingCall, acceptCall, rejectCall }: IncomingCallProps) => {
  if (!incomingCall) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white/30 backdrop-blur-md shadow-xl rounded-2xl px-6 py-4 w-[350px] flex items-center justify-between border border-white/20 animate-fadeIn">
      {/* Caller Info */}
      <div className="flex items-center space-x-4">
        <img
          src={incomingCall.senderProfilePic || "/default-avatar.png"}
          alt="Caller"
          className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
        />
        <div>
        <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text drop-shadow-md">
            {incomingCall.senderName}
          </p>          <p className="text-sm text-gray-300 animate-pulse">Incoming Call...</p>
        </div>
      </div>

      {/* Call Controls */}
      <div className="flex space-x-4">
        <button
          className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 animate-pulse"
          onClick={() => acceptCall(incomingCall)}
        >
          <FaPhone className="text-white" size={18} />
        </button>
        <button
          className="bg-red-500 p-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
          onClick={() => rejectCall(incomingCall)}
        >
          <FaPhoneSlash className="text-white" size={18} />
        </button>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
