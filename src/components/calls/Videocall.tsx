// import { Camera, CameraOff, Mic, MicOff, Phone, PhoneCall } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import socket from "../../socket/socket";

// // Utility function to generate a random ID
// function randomID(len: number) {
//   let result = "";
//   const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
//   const maxPos = chars.length;
//   len = len || 5;
//   for (let i = 0; i < len; i++) {
//     result += chars.charAt(Math.floor(Math.random() * maxPos));
//   }
//   return result;
// }

// const Videocall = () => {
//   const [searchParams] = useSearchParams();
//   const [isCameraOn, setIsCameraOn] = useState(true);
//   const [isMicOn, setIsMicOn] = useState(true);
//   const [isInCall, setIsInCall] = useState(false);

//   const [userId, setUserId] = useState<string | null>(null);
//   const [empId, setempId] = useState<string | null>(null);
//   const [roomId, setRoomId] = useState<string | null>(null);
//   const [senderName, setSenderName] = useState<string | null>(null);
//   const [callType, setCallType] = useState<string | null>(null);




  
//   useEffect(() => {
//         const roomIdParms = searchParams.get("roomId") || randomID(5);
//   const callTypeParams = searchParams.get("type");
//   const senderId = searchParams.get("sender");
//   const receiverId = searchParams.get("receiver");
//   const senderNameParams = searchParams.get("senderName");
//     setUserId(senderId);
//     setempId(receiverId);
//     setRoomId(roomIdParms);
//     setCallType(callTypeParams)
//     setSenderName(senderNameParams)
//   }, [searchParams]);


//   const appID = import.meta.env.VITE_ZEGO_APP_ID;
//   const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

//   useEffect(() => {
//     if (roomId && userId && empId && meetingContainerRef.current) {
//       const initializeVideoCall = async () => {
//         try {
//           const appID = 381031416;
//           const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
//           const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//             appID,
//             serverSecret,
//             roomId,
//             empId,
//             userId
//           );

//           const zp = ZegoUIKitPrebuilt.create(kitToken);
//           zp.joinRoom({
//             container:current,
//             showPreJoinView: false,
//             sharedLinks: [
//               {
//                 name: "Meeting link",
//                 url: comments.ZEGO_BASE_URL + roomId,
//               },
//             ],
//             scenario: {
//               mode: ZegoUIKitPrebuilt.VideoConference,
//             },
//             onLeaveRoom: () => {
//               window.close();
//             },
//           });

//        socket.emit("call",{senderId:userId,roomId,receiverId:empId})
//         } catch (error) {
//           console.error( error);
//         }
//       };

//       initializeVideoCall();
//     }
//   }, [roomId, userId, empId]);
  

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
//         <div className="relative">
//           <div className="aspect-video w-full bg-gray-900">
//             {isInCall ? (
//               <div
//                 ref={meetingRef}
//                 className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900"
//               ></div>
//             ) : (
//               <div className="flex h-full items-center justify-center bg-gray-800">
//                 <CameraOff size={48} className="text-gray-400" />
//               </div>
//             )}
//           </div>
//           <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
//             {isInCall ? "In Call" : "Lobby"}
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="flex flex-col gap-6">
//             <div className="text-center">
//               <h2 className="text-xl font-semibold">{senderName}</h2>
//               <p className="text-sm text-gray-500">Ready to join</p>
//             </div>

//             <div className="flex flex-wrap items-center justify-center gap-4">
//               <button
//                 className={`flex h-12 w-12 items-center justify-center rounded-full ${
//                   isCameraOn
//                     ? "bg-blue-600 text-white hover:bg-blue-700"
//                     : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
//                 }`}
//                 onClick={toggleCamera}
//               >
//                 {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
//                 <span className="sr-only">{isCameraOn ? "Turn camera off" : "Turn camera on"}</span>
//               </button>

//               <button
//                 className={`flex h-12 w-12 items-center justify-center rounded-full ${
//                   isMicOn
//                     ? "bg-blue-600 text-white hover:bg-blue-700"
//                     : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
//                 }`}
//                 onClick={toggleMic}
//               >
//                 {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
//                 <span className="sr-only">{isMicOn ? "Mute microphone" : "Unmute microphone"}</span>
//               </button>

//               {!isInCall ? (
//                 <button
//                   className="flex h-12 w-32 items-center justify-center gap-2 rounded-full bg-green-600 text-white hover:bg-green-700"
//                   onClick={joinCall}
//                 >
//                   <PhoneCall className="h-5 w-5" />
//                   <span>Join</span>
//                 </button>
//               ) : (
//                 <button
//                   className="flex h-12 w-32 items-center justify-center gap-2 rounded-full bg-red-600 text-white hover:bg-red-700"
//                   onClick={endCall}
//                 >
//                   <Phone className="h-5 w-5" />
//                   <span>End</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Videocall;