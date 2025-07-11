const ProfileCard = ({ avatar, name, studentId, major, email, course }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src={avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-gray-500">MSSV: {studentId}</p>
          <p className="text-gray-500">Khóa: {course}</p>
          <p className="text-gray-500">Ngành: {major}</p>
          <p className="text-gray-500">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
