const UploadButtons = () => {
  return (
    <div className="flex space-x-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
        Tải lên thời khóa biểu
      </button>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
        Tải lên bảng điểm
      </button>
    </div>
  );
};

export default UploadButtons;
