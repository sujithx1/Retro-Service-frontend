import { useRef, useState } from "react";
import { FaPaperclip, FaTimes, FaCheck } from "react-icons/fa";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  allowedTypes?: string[];
  maxSize?: number; // in MB
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect, 
  disabled,
  allowedTypes = ['image/*', 'audio/*', 'application/pdf'],
  maxSize = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    })) {
      setError("Unsupported file type");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(',')}
        className="hidden"
        disabled={disabled}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={`p-2 rounded-full ${disabled ? 'bg-gray-500 text-gray-300' : 'bg-blue-500 text-white'}`}
        title="Attach file"
      >
        <FaPaperclip />
      </button>

      {selectedFile && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300 max-w-xs truncate">
            {selectedFile.name}
          </span>
          <button
            onClick={handleUpload}
            className="p-1 bg-green-500 text-white rounded-full"
            title="Send file"
          >
            <FaCheck size={12} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-500 text-white rounded-full"
            title="Cancel"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  );
};

export default FileUploader;