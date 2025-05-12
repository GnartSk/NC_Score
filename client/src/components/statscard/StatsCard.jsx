const StatsCard = ({ value, label,  bgColor }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md w-full">
      <div className={`w-16 h-16 flex items-center justify-center rounded-full ${bgColor}`}>
          <span className="text-2xl font-bold text-blue-600">{value}</span>
      </div>
      
      <p className="text-gray-600 mt-2 text-sm">{label}</p>
    </div>
  );
};

export default StatsCard;
