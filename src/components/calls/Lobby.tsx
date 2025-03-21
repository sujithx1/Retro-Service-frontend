// import { useCallback, useEffect, useRef, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { FaVideo, FaMicrophone, FaPhone } from "react-icons/fa";
// import { CallData } from "../../types/employee/EmployeeTypes";
// import socket from "../../socket/socket";

// const VideoCallLobby = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [callType, setCallType] = useState<"video" | "audio">(searchParams.get("type") as "video" | "audio" || "video");
//   const [callDetails, setCallDetails] = useState<CallData | null>(null);
//   const [iceCandidatesBuffer, setIceCandidatesBuffer] = useState<RTCIceCandidateInit[]>([]);
//   const [connectionStatus, setConnectionStatus] = useState<string>("idle");
//   const [socketConnected, setSocketConnected] = useState<boolean>(false);
  
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const peerRef = useRef<RTCPeerConnection | null>(null);
//   const roomId = searchParams.get('roomId');

//   // Define roles
//   const action = searchParams.get("action");
//   const isCaller = action === "sender";
//   const isCallee = action === "receiver";
  
//   const senderId = searchParams.get("sender");
//   const receiverId = searchParams.get("receiver");
//   const senderName = searchParams.get("senderName");

//   // Set call details
//   useEffect(() => {
//     setCallDetails({
//       callType,
//       receiverId: receiverId || "",
//       senderId: senderId || "",
//       senderName: senderName || "",
//     });
//   }, [receiverId, senderId, senderName, callType]);

//   // Initialize socket connection
//   useEffect(() => {
//     if (!socket.connected) {
//       socket.connect();
//     }

//     const handleConnect = () => {
//       console.log("✅ Socket connected successfully");
//       setSocketConnected(true);
//     };

//     const handleDisconnect = () => {
//       console.log("❌ Socket disconnected");
//       setSocketConnected(false);
//     };

//     const handleError = (error: any) => {
//       console.error("Socket error:", error);
//     };

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('error', handleError);

//     // Initial connection status
//     setSocketConnected(socket.connected);

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('error', handleError);
      
//       // Cleanup function
//       if (peerRef.current) {
//         peerRef.current.close();
//         peerRef.current = null;
//       }
      
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//         streamRef.current = null;
//       }
//     };
//   }, []);

//   // Create and send offer
//   const createAndSendOffer = useCallback(async () => {
//     if (!peerRef.current || !roomId) {
//       console.error("Cannot create offer: peer connection or room ID is missing");
//       return;
//     }
    
//     if (peerRef.current.signalingState !== "stable") {
//       console.warn("Cannot create offer: signaling state is not stable");
//       return;
//     }
    
//     try {
//       console.log("Creating offer as caller...");
//       const offer = await peerRef.current.createOffer({
//         offerToReceiveAudio: true,
//         offerToReceiveVideo: callType === "video"
//       });
//       console.log("Offer created:", offer);
      
//       await peerRef.current.setLocalDescription(offer);
//       console.log("Local description set from offer");
      
//       console.log("📡 Sending offer for room:", roomId);
//       socket.emit("offer", { roomId, offer });
//     } catch (error) {
//       console.error("Error creating or sending offer:", error);
//       setConnectionStatus("failed");
//     }
//   }, [roomId, callType]);

//   // Setup media stream
//   useEffect(() => {
//     const setupMediaStream = async () => {
//       try {
//         if (callType === "video") {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//           streamRef.current = stream;
//           if (videoRef.current) videoRef.current.srcObject = stream;
//           console.log("✅ Video and audio stream acquired successfully");
//         } else {
//           // Audio-only call
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           streamRef.current = stream;
//           console.log("✅ Audio stream acquired successfully");
//         }
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//         alert("Could not access camera or microphone. Please check permissions.");
//       }
//     };

//     setupMediaStream();
    
//     return () => {
//       if (streamRef.current) {
//         console.log("📢 Stopping all tracks in stream");
//         streamRef.current.getTracks().forEach((track) => {
//           track.stop();
//           console.log(`Stopped track: ${track.kind}`);
//         });
//         streamRef.current = null;
//       }
//     };
//   }, [callType]);

//   // Initialize peer connection
//   const initializePeerConnection = useCallback(() => {
//     if (peerRef.current) {
//       console.log("PeerConnection already exists, not re-initializing");
//       return;
//     }
  
//     console.log("📡 Initializing new PeerConnection");
//     setConnectionStatus("connecting");
    
//     peerRef.current = new RTCPeerConnection({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun1.l.google.com:19302" },
//         {
//           urls: "turn:numb.viagenie.ca",
//           credential: "muazkh",
//           username: "webrtc@live.com"
//         }
//       ],
//     });
  
//     // Track ICE candidates
//     peerRef.current.onicecandidate = (event) => {
//       if (event.candidate && roomId) {
//         console.log("📡 Sending ICE Candidate:", event.candidate);
//         socket.emit("ice-candidate", { candidate: event.candidate, roomId });
//       }
//     };

//     // Track ICE connection state
//     peerRef.current.oniceconnectionstatechange = () => {
//       const state = peerRef.current?.iceConnectionState;
//       console.log("ICE Connection State:", state);
      
//       switch (state) {
//         case "connected":
//           setConnectionStatus("connected");
//           console.log("✅ ICE Connection established successfully");
//           break;
//         case "completed":
//           setConnectionStatus("connected");
//           console.log("✅ ICE Connection completed");
//           break;
//         case "disconnected":
//           setConnectionStatus("disconnected");
//           console.log("❌ ICE Connection disconnected");
//           break;
//         case "failed":
//           setConnectionStatus("failed");
//           console.log("❌ ICE Connection failed");
//           if (peerRef.current) {
//             console.log("🔄 Attempting ICE restart...");
//             peerRef.current.restartIce();
//           }
//           break;
//         case "closed":
//           setConnectionStatus("closed");
//           console.log("❌ ICE Connection closed");
//           break;
//       }
//     };

//     // Handle remote track
//   peerRef.current.ontrack = (event) => {
//   console.log("Remote track received:", event.streams[0]);
//   if (remoteVideoRef.current) {
//     remoteVideoRef.current.srcObject = event.streams[0];
//   } else if (videoRef.current && !isCaller) {
//     videoRef.current.srcObject = event.streams[0];
//   }
// };
    
//     // Add local tracks to the peer connection
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => {
//         if (peerRef.current && streamRef.current) {
//           console.log("Adding local track to peer connection:", track.kind);
//           peerRef.current.addTrack(track, streamRef.current);
//         }
//       });
//     } else {
//       console.warn("No local stream available to add tracks");
//     }
//   }, [roomId, isCaller]);

//   // Process buffered ICE candidates
//   useEffect(() => {
//     const processBufferedCandidates = async () => {
//       if (peerRef.current && peerRef.current.remoteDescription && iceCandidatesBuffer.length > 0) {
//         console.log(`🔄 Processing ${iceCandidatesBuffer.length} buffered ICE candidates.`);
        
//         for (const candidate of iceCandidatesBuffer) {
//           try {
//             await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//             console.log("✅ Buffered ICE Candidate added successfully.");
//           } catch (error) {
//             console.error("⚠️ Error adding buffered ICE Candidate:", error);
//           }
//         }
        
//         setIceCandidatesBuffer([]);
//       }
//     };

//     processBufferedCandidates();
//   }, [iceCandidatesBuffer]);

//   // Handle socket events
//   useEffect(() => {
//     const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
//       if (!peerRef.current) {
//         console.warn("Received answer but peer connection doesn't exist");
//         return;
//       }

//       if (peerRef.current.signalingState === "stable") {
//         console.warn("🚨 Already in stable state, ignoring duplicate answer.");
//         return;
//       }

//       console.log("✅ Answer received, setting remote description...");
//       try {
//         await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
//         console.log("Remote description set successfully from answer");
        
//         // Process any buffered ICE candidates
//         if (iceCandidatesBuffer.length > 0) {
//           console.log(`Processing ${iceCandidatesBuffer.length} buffered ICE candidates after answer.`);
//           for (const candidate of iceCandidatesBuffer) {
//             try {
//               await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//             } catch (error) {
//               console.error("Error adding buffered ICE candidate:", error);
//             }
//           }
//           setIceCandidatesBuffer([]);
//         }
//       } catch (error) {
//         console.error("Error setting remote description from answer:", error);
//         setConnectionStatus("failed");
//       }
//     };

//     const handleJoinCall = ({ roomId: joinedRoomId }: { roomId: string }) => {
//       if (joinedRoomId !== roomId) return;
      
//       console.log("Receiver joined room:", joinedRoomId);
      
//       if (isCaller) {
//         if (!peerRef.current) {
//           initializePeerConnection();
//         }
        
//         setTimeout(() => {
//           if (peerRef.current && peerRef.current.signalingState === "stable") {
//             createAndSendOffer();
//           } else {
//             console.log("Skipping offer creation: signaling state is not stable");
//           }
//         }, 1000);
//       }
//     };

//     const handleOffer = async ({ offer, roomId: offerRoomId }: { offer: RTCSessionDescriptionInit, roomId: string }) => {
//       if (offerRoomId !== roomId) return;
      
//       console.log("📡 Received offer for room:", offerRoomId);
      
//       if (!peerRef.current) {
//         initializePeerConnection();
//       }
      
//       if (!peerRef.current) {
//         console.error("Failed to initialize peer connection");
//         return;
//       }

//       // Wait for the peer connection to be stable
//       if (peerRef.current.signalingState !== "stable") {
//         console.warn("🚨 PeerConnection is not stable. Waiting...");
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }

//       try {
//         console.log("Setting remote description from offer...");
//         await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
//         console.log("✅ Remote description set from offer.");

//         // Create and send answer
//         console.log("Creating answer...");
//         const answer = await peerRef.current.createAnswer();
//         console.log("Answer created:", answer);
        
//         await peerRef.current.setLocalDescription(answer);
//         console.log("Local description set from answer");
        
//         console.log("📡 Sending answer for room:", roomId);
//         socket.emit("answer", { answer, roomId });
//       } catch (error) {
//         console.error("Error handling offer:", error);
//         setConnectionStatus("failed");
//       }
//     };
//     const handleIceCandidate = async ({ candidate, roomId: candidateRoomId }: { candidate: RTCIceCandidateInit, roomId: string }) => {
//       if (candidateRoomId !== roomId) return;
      
//       console.log("📡 ICE Candidate received for room:", candidateRoomId);
    
//       if (!peerRef.current || !peerRef.current.remoteDescription) {
//         console.log("🔄 Buffering ICE candidate until remote description is set.");
//         setIceCandidatesBuffer(prev => [...prev, candidate]);
//         return;
//       }
    
//       try {
//         await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//         console.log("✅ ICE Candidate added successfully.");
//       } catch (error) {
//         console.error("⚠️ Error adding ICE Candidate:", error);
//         setIceCandidatesBuffer(prev => [...prev, candidate]);
//       }
//     };

//     socket.on("answer", handleAnswer);
//     socket.on("joinCall", handleJoinCall);
//     socket.on("offer", handleOffer);
//     socket.on("ice-candidate", handleIceCandidate);

//     return () => {
//       socket.off("answer", handleAnswer);
//       socket.off("joinCall", handleJoinCall);
//       socket.off("offer", handleOffer);
//       socket.off("ice-candidate", handleIceCandidate);
//     };
//   }, [roomId, initializePeerConnection, createAndSendOffer, isCaller, callType, iceCandidatesBuffer]);

//   // Handle start call
//   const handleStartCall = () => {
//     if (!roomId || !callDetails || !socketConnected) {
//       console.error("❌ Missing room ID, call details, or socket connection.");
//       return;
//     }
    
//     console.log("Emitting call event:", { ...callDetails, roomId });
//     socket.emit("call", { ...callDetails, roomId });
//     initializePeerConnection();
//   };

//   // Handle join call
//   const handleJoinCall = () => {
//     if (!roomId || !socketConnected) {
//       console.error("❌ Missing room ID or socket connection.");
//       return;
//     }
    
//     initializePeerConnection();
//     console.log("Emitting joinCall event for room:", roomId);
//     socket.emit("joinCall", { roomId });
//   };

//   // Handle end call
//   const handleEndCall = () => {
//     console.log("Ending call...");
    
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => {
//         track.stop();
//         console.log(`Stopped track: ${track.kind}`);
//       });
//       streamRef.current = null;
//     }
    
//     if (peerRef.current) {
//       console.log("Closing peer connection");
//       peerRef.current.close();
//       peerRef.current = null;
//     }
    
//     setConnectionStatus("idle");
//     navigate("/");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white px-6">
//       <div className="bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-2xl text-center">
//         <h1 className="text-4xl font-extrabold mb-6 flex items-center justify-center gap-3">
//           {callType === "video" ? <FaVideo /> : <FaMicrophone />} {isCaller ? "Start" : "Join"} {callType} Call
//         </h1>
        
//         <div className="flex flex-col gap-4">
//           {/* Main video container */}
//           <div className="relative w-full">
//             {callType === "video" && (
//               <video 
//                 ref={videoRef} 
//                 className="w-full rounded-lg bg-black h-64 object-cover" 
//                 autoPlay 
//                 playsInline 
//                 muted 
//               />
//             )}
            
//             {/* Remote video (for caller) */}
//             {isCaller && callType === "video" && (
//               <video 
//                 ref={remoteVideoRef} 
//                 className="absolute top-4 right-4 w-1/3 rounded-lg bg-black border-2 border-white" 
//                 autoPlay 
//                 playsInline 
//               />
//             )}
//           </div>
          
//           {/* Connection status */}
//           <div className="text-sm mt-2 text-gray-400">
//             <div className="flex items-center justify-center gap-2">
//               <div className={`w-3 h-3 rounded-full ${
//                 connectionStatus === "connected" ? "bg-green-500" :
//                 connectionStatus === "connecting" ? "bg-yellow-500" :
//                 connectionStatus === "failed" || connectionStatus === "disconnected" ? "bg-red-500" :
//                 "bg-gray-500"
//               }`}></div>
//               <span>Connection: {connectionStatus}</span>
//               {!socketConnected && (
//                 <span className="text-red-400 ml-2">(Socket disconnected)</span>
//               )}
//             </div>
//             <div className="text-xs mt-1">Role: {isCaller ? "Caller (Initiator)" : "Callee (Receiver)"}</div>
//           </div>
          
//           {/* Actions */}
//           <div className="flex gap-4 justify-center mt-4">
//             {isCaller ? (
//               <button 
//                 className={`p-3 rounded-xl transition-colors ${
//                   connectionStatus === "idle" || connectionStatus === "disconnected" || connectionStatus === "failed"
//                     ? "bg-green-500 hover:bg-green-600"
//                     : "bg-gray-500 cursor-not-allowed"
//                 }`}
//                 onClick={handleStartCall}
//                 disabled={connectionStatus !== "idle" && connectionStatus !== "disconnected" && connectionStatus !== "failed"}
//               >
//                 Start Call
//               </button>
//             ) : (
//               <button 
//                 className={`p-3 rounded-xl transition-colors ${
//                   connectionStatus === "idle" || connectionStatus === "disconnected" || connectionStatus === "failed"
//                     ? "bg-green-500 hover:bg-green-600"
//                     : "bg-gray-500 cursor-not-allowed"
//                 }`}
//                 onClick={handleJoinCall}
//                 disabled={connectionStatus !== "idle" && connectionStatus !== "disconnected" && connectionStatus !== "failed"}
//               >
//                 Join Call
//               </button>
//             )}
//             <button 
//               className="bg-red-500 hover:bg-red-600 p-3 rounded-xl transition-colors flex items-center gap-2" 
//               onClick={handleEndCall}
//             >
//               <FaPhone /> End Call
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCallLobby;