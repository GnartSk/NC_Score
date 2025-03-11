const StatsCard = ({ value, label }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <h3 className="text-2xl font-semibold">{value}</h3>
      <p className="text-gray-500">{label}</p>
    </div>
  );
};

export default StatsCard;
