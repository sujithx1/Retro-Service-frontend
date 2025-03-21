

// import { useEffect, useRef } from "react";

// const LocalStream = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       })
//       .catch(err => console.error("Error accessing media", err));
//   }, []);

//   return <video ref={videoRef} autoPlay playsInline className="w-1/2" />;
// };
 
// export default LocalStream;
