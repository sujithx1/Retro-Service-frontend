import { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop, FaPlay, FaTrash } from "react-icons/fa";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder, isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      audioChunks.current = [];
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendRecording = () => {
    if (audioUrl) {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      onRecordingComplete(audioBlob);
      setAudioUrl(null);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
    setAudioUrl(null);
  };

  return (
    <div className="flex items-center gap-2">
      {!audioUrl ? (
        <>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className={`p-2 rounded-full ${isRecording 
              ? "bg-red-500 text-white animate-pulse" 
              : disabled 
                ? "bg-gray-500 text-gray-300" 
                : "bg-blue-500 text-white"}`}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </button>
          {isRecording && (
            <span className="text-sm text-gray-300">Recording...</span>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <audio controls src={audioUrl} ref={audioRef} className="max-w-xs" />
          <button
            onClick={sendRecording}
            className="p-2 bg-green-500 text-white rounded-full"
            title="Send audio"
          >
            <FaPlay />
          </button>
          <button
            onClick={cancelRecording}
            className="p-2 bg-red-500 text-white rounded-full"
            title="Cancel"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;