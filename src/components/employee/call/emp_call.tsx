import { useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../../socket/socket";

const Emp_call = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const callType = params.get("type") || "video";
  const roomId = params.get("roomId");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  // const [joined, setJoined] = useState(false);
const navigate=useNavigate()
  const disconnectCall = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    [localVideoRef.current, remoteVideoRef.current].forEach((video) => {
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    });

    // setJoined(false);
    socket.emit("disconnect-call", { roomId });

    // Clean up socket listeners
    socket.off("ice-candidate");
    socket.off("offer");
    socket.off("answer");
    socket.off("call-disconnected");
    navigate('/employee/home')

  }, [roomId,navigate]);
   useEffect(() => {
    if (!roomId || peerConnection.current) return; // Prevent multiple connections
    console.log("everything ok ");
  
    // setJoined(true);
    socket.emit("join-room", roomId);
  
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  
    navigator.mediaDevices
      .getUserMedia({ video: callType === "video", audio: true })
      .then((stream) => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, stream));
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  
    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };
  
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };
  
    socket.on("ice-candidate", async (data) => {
      if (data?.candidate && peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error("Error adding received ICE candidate:", error);
        }
      }
    });
  
    socket.on("offer", async (offer) => {
      console.log("offer collected");
      
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
        console.log("anwer emmited");
        
      }
      console.log("peerconncetion.current  else case");
      
    });
  
    socket.on("answer", async (answer) => {
        console.log("answerr onnned");
        
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
  
    socket.on("call-disconnected", disconnectCall);
  
    return () => {
      disconnectCall();
    };
  }, [roomId, callType,disconnectCall]); // ✅ Removed `joined` and `disconnectCall`
  

  const callUser = async () => {
    if (!peerConnection.current) return; // Prevent duplicate calls

  const offer = await peerConnection.current.createOffer();
  await peerConnection.current.setLocalDescription(offer);
  socket.emit("offer", { roomId, offer });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">
        {callType === "video" ? "Video Call" : "Audio Call"}
      </h2>

      <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Remote Video Feed */}
        {callType === "video" && (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full" />
        )}

        {/* Local Video Feed (Overlay) */}
        {callType === "video" && (
          <div className="absolute bottom-4 right-4 w-1/4 rounded-lg overflow-hidden shadow-lg">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full" />
          </div>
        )}

        {/* Audio Call Indicator */}
        {callType === "audio" && (
          <div className="flex items-center justify-center h-64 bg-gray-800 text-white text-lg">
            Audio Call in Progress...
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={callUser}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
        >
          📞 Call
        </button>
        <button
          onClick={disconnectCall}
          className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
        >
          ❌ Hang Up
        </button>
      </div>
    </div>
  );
};

export default Emp_call;
