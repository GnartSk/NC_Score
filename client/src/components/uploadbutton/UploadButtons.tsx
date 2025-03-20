'use client'
import { useState } from "react";

interface UploadButtonsProps {
  label: string;
  icon: string;
}

const UploadButtons: React.FC<UploadButtonsProps> = ({ label, icon }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    document.getElementById(`fileInput-${label}`)?.click();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-300">
      <button
        onClick={handleUploadClick}
        className="flex flex-col items-center justify-center w-full h-32 bg-blue-50 rounded-md hover:bg-blue-100 transition-all"
      >
        <span className="text-4xl">{icon}</span>
        <span className="text-blue-600 font-bold">{label}</span>
      </button>

      <input
        id={`fileInput-${label}`}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <p className="mt-2 text-sm text-gray-700">Đã chọn: {selectedFile.name}</p>
      )}
    </div>
  );
};

export default UploadButtons;
