


// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// import { useSearchParams } from 'react-router-dom';

// function randomID(len:number) {
//   let result = '';
//   if (result) return result;
//   const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP'
//     const maxPos = chars.length;
//    let i;
//   len = len || 5;
//   for (i = 0; i < len; i++) {
//     result += chars.charAt(Math.floor(Math.random() * maxPos));
//   }
//   return result;
// }

//  function getUrlParams(
//   url = window.location.href
// ) {
//   const urlStr = url.split('?')[1];
//   return new URLSearchParams(urlStr);
// }



// export default function LocalMeet() {
//     const [searchParams]=useSearchParams()
//     const roomIdParms = searchParams.get("roomId") || randomID(5);
//   const roomID = getUrlParams().get('roomID') || randomID(5);
  
//   const appId = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
//   const server_Secret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

//   const  myMeeting = async (element:HTMLDivElement) => {

//  // generate Kit Token 
//  const appID = appId;
//  const serverSecret = server_Secret;
//  const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  randomID(5),  randomID(5));

//  // Create instance object from Kit Token.
//  const zp = ZegoUIKitPrebuilt.create(kitToken);
//  // start the call
//  zp.joinRoom({
//         container: element,
//         showPreJoinView:false,
        
//         sharedLinks: [
//           {
//             name: 'Personal link',
//             url:
//              window.location.protocol + '//' + 
//              window.location.host + window.location.pathname +
//               '?roomID=' +
//               roomID,
//           },
//         ],
//         scenario: {
//          mode: ZegoUIKitPrebuilt.VideoConference,
//         },
//    });
//   };

//   return (
//     <div
//       className="w-full"
//       ref={myMeeting}
//       style={{ width: '100vw', height: '100vh' }}
//     ></div>
//   );
// }
