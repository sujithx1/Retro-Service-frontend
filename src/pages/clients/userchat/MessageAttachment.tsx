import { FaFileImage, FaFileAudio, FaFilePdf, FaFileAlt } from "react-icons/fa";
import AudioPlayer from "./audioplayer";

interface MessageAttachmentProps {
  attachment: {
    type: string;
    url: string;
    name: string;
    size: number;
  };
}

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachment }) => {
  console.log("Rendeing message attachemett");
  
  console.log("Rendering audio:", attachment.url);

  const renderIcon = () => {
    switch (attachment.type) {
      case "image":
        return <FaFileImage className="text-blue-400" size={24} />;
      case "audio":
        return <FaFileAudio className="text-purple-400" size={24} />;
      case "pdf":
        return <FaFilePdf className="text-red-400" size={24} />;
      default:
        return <FaFileAlt className="text-gray-400" size={24} />;
    }
  };

  const formatFileSize = (size: number) => {
    return size > 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(1)} KB`;
  };

  const renderContent = () => {
    switch (attachment.type) {
      case "image":
        return (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-full h-auto rounded-lg border border-gray-600"
          />
        );
         
        case "audio":
  return (
    
      <>
      <AudioPlayer audioUrl={attachment.url}/>
      </>
   
  );

        
        
      case "pdf":
        return (
          <embed
            src={attachment.url}
            type="application/pdf"
            className="w-full h-56 border border-gray-600 rounded-lg"
          />
        );
      default:
        return (
          <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
            {renderIcon()}
            <div>
              <p className="text-sm font-medium">{attachment.name}</p>
              <p className="text-xs text-gray-400">{formatFileSize(attachment.size)}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}
      </>
     
  );
};

export default MessageAttachment;