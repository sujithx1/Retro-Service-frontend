import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";

export const uploadAudioandVideo = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; name: string; size: number; type: string }> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chatFile"); // Cloudinary preset
    formData.append("folder", "uploads"); // Cloudinary folder name

    const config: AxiosRequestConfig<FormData> = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          if (onProgress) onProgress(progress);
        }
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(import.meta.env.VITE_CLOUDINARY_AUDIO_VIDEO_URL, formData, config)
      .then((response) => {
        const fileType = getFileType(file.name);
        resolve({
          url: response.data.secure_url,
          name: file.name,
          size: file.size,
          type: fileType,
        });
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        reject(error);
      });
  });
};

export const getFileType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image";
    case "mp3":
    case "wav":
    case "ogg":
      return "audio";
    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return "document";
    default:
      return "file";
  }
};
