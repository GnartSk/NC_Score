const UploadButtons = ({ label, icon }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-gray-200 w-90">
      <div className="w-full bg-blue-100 rounded-lg p-6 flex flex-col items-center">
        <div className="bg-yellow-400 p-3 rounded-lg mb-2">
          {icon}
        </div>
        <p className="text-blue-600 font-semibold text-center">{label}</p>
      </div>
    </div>
  );
};


export default UploadButtons;
