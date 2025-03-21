import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import socket from '../../socket/socket';
import { ToastMsg } from '../../types/admin/admintypes';
import ToastAlert from '../alert/ToastAlert';

function randomID(len: number = 5) {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  return Array.from({ length: len }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

export default function MEEET() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const [senderId, setSenderId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [callType, setCallType] = useState<string | null>(null);
  const [showError,setShowError]=useState<ToastMsg>({
    action:false,
    message:'',
    type:'idle'
  })
  const callContainerRef = useRef<HTMLDivElement | null>(null);

  const appId = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
  const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

  useEffect(() => {
    const roomIdParam = searchParams.get("roomId") || randomID(5);
    const callTypeParam = searchParams.get("type"); // video or audio
    const senderIdParam = searchParams.get("sender");
    const receiverIdParam = searchParams.get("receiver");

    setSenderId(senderIdParam);
    setReceiverId(receiverIdParam);
    setRoomId(roomIdParam);
    setCallType(callTypeParam);
  }, [searchParams]);



  useEffect(()=>{
    socket.on('rejected',(data)=>{
        console.log("rejected");
        if (data.roomId===roomId&&data.senderId==senderId) {
setShowError({
    action:true,
    message:'Call Rejected',
    type:'error'
})
navigate(-1)
            
        }
        
    })

    return  ()=>{
        socket.off('rejected')
    }
  },[roomId,senderId,navigate])

  useEffect(() => {
    if (senderId && receiverId && roomId && callContainerRef.current) {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        randomID(5),
        randomID(5)
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: callContainerRef.current,
        showPreJoinView: false,
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.origin}${window.location.pathname}?roomId=${roomId}&type=${callType}`,
          },
        ],
        scenario: {
          mode: callType === "video" ? ZegoUIKitPrebuilt.VideoConference : ZegoUIKitPrebuilt.OneONoneCall,
        },
        turnOnCameraWhenJoining: callType === "video",
        turnOnMicrophoneWhenJoining: true,             
        showMyCameraToggleButton: callType === "video", 
        showScreenSharingButton: callType === "video",  
        showTurnOffRemoteCameraButton: callType === "video", 
        showTurnOffRemoteMicrophoneButton: true,
        showTextChat: true,
        showUserList: true,
        showLeaveRoomConfirmDialog: true,
        layout: callType === "audio" ? "Grid" : "Auto",
        onLeaveRoom:()=>{
            console.log("Call ended. Navigating...");
            navigate(-1); 
        }
      });
    }
  }, [senderId, receiverId, roomId, callType, appId, serverSecret,navigate]);

  return (
    <>
        {showError.action && <ToastAlert onClose={()=>setShowError((prev)=>({...prev,action:false}))} message={showError.message} type={showError.type as "info"|"success"|"error"} />}

    <div
      className="w-full"
      ref={callContainerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
      </>
  );
}
