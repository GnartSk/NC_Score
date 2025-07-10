'use client';
import { useEffect, useState, useContext, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, List, Card, Spin, Input, Select, Row, Col, Empty, Tag } from 'antd';
import { SearchOutlined, UserOutlined, BookOutlined, CrownOutlined, ExpandOutlined, CompressOutlined } from '@ant-design/icons';
import SemesterScoreTable from '@/components/SemesterScoreTable';
import { getCookie } from 'cookies-next';
import { StudentContext } from '@/lib/student.context';

const { Search } = Input;
const { Option } = Select;

interface UserInfo {
  _id: string;
  fullName: string;
  studentId: string;
  course?: string;
  major?: string;
  avatar?: string;
}

const StudentScore = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [scoreUserId, setScoreUserId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isScoreExpanded, setIsScoreExpanded] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setCollapseMenu } = useContext(StudentContext)!;

  // Lấy danh sách unique majors và courses
  const majors = useMemo(() => {
    const uniqueMajors = [...new Set(users.map(user => user.major).filter(Boolean))];
    return uniqueMajors.sort();
  }, [users]);

  const courses = useMemo(() => {
    const uniqueCourses = [...new Set(users.map(user => user.course).filter(Boolean))];
    return uniqueCourses.sort();
  }, [users]);

  // Lọc danh sách sinh viên
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user.fullName || '';
      const mssv = user.studentId ? String(user.studentId) : '';
      const matchesSearch =
        searchText === '' ||
        name.toLowerCase().includes(searchText.toLowerCase()) ||
        mssv.includes(searchText);

      const matchesMajor = selectedMajor === 'all' || user.major === selectedMajor;
      const matchesCourse = selectedCourse === 'all' || user.course === selectedCourse;

      return matchesSearch && matchesMajor && matchesCourse;
    });
  }, [users, searchText, selectedMajor, selectedCourse]);

  useEffect(() => {
    // Fetch danh sách user
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Ưu tiên lấy token từ cookie
        let token = '';
        if (typeof window !== 'undefined') {
          token = getCookie('NCToken') as string;
          if (!token || token === 'null') {
            token = localStorage.getItem('NCToken') || '';
          }
        }
        if (!token || token === 'null') {
          setUsers([]);
          setLoading(false);
          return;
        }
        const res = await fetch(`${process.env.BackendURL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data.data?.users || []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Nếu có query id thì chọn user đó
    const id = searchParams.get('id');
    if (id) {
      setScoreUserId(id);
      const found = users.find(u => u._id === id);
      setSelectedUser(found || null);
      setIsScoreExpanded(true); // Tự động mở rộng bảng điểm khi có id từ URL
    } else {
      setScoreUserId(null);
      setSelectedUser(null);
    }
  }, [searchParams, users]);

  const handleUserClick = (user: UserInfo) => {
    setCollapseMenu(true);
    setIsScoreExpanded(true); // Tự động mở rộng bảng điểm khi chọn sinh viên
    router.push(`?id=${user._id}`);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleMajorFilter = (value: string) => {
    setSelectedMajor(value);
  };

  const handleCourseFilter = (value: string) => {
    setSelectedCourse(value);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedMajor('all');
    setSelectedCourse('all');
  };

  const toggleScoreExpanded = () => {
    setIsScoreExpanded(!isScoreExpanded);
  };

  return (
    <div className="flex gap-8">
      <div className={isScoreExpanded ? "w-1/3" : "w-full"}>
        <Card 
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-blue-500" />
              <span>Danh sách sinh viên</span>
              <Tag color="blue" className="ml-auto">
                {filteredUsers.length}/{users.length}
              </Tag>
            </div>
          } 
          className="h-full"
          extra={
            <div className="flex items-center gap-2">
              <button 
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-blue-500"
              >
                Xóa bộ lọc
              </button>
              {scoreUserId && (
                <button
                  onClick={toggleScoreExpanded}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  title={isScoreExpanded ? "Thu gọn bảng điểm" : "Mở rộng bảng điểm"}
                >
                  {isScoreExpanded ? (
                    <CompressOutlined className="text-gray-600" />
                  ) : (
                    <ExpandOutlined className="text-gray-600" />
                  )}
                </button>
              )}
            </div>
          }
        >
          {/* Search and Filters */}
          <div className="space-y-3 mb-4">
            <Search
              placeholder="Tìm kiếm theo tên hoặc MSSV..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              prefix={<SearchOutlined />}
            />
            
            <Row gutter={8}>
              <Col span={12}>
                <Select
                  placeholder="Lọc theo ngành"
                  value={selectedMajor}
                  onChange={handleMajorFilter}
                  className="w-full"
                  allowClear
                >
                  <Option value="all">Tất cả ngành</Option>
                  {majors.map(major => (
                    <Option key={major} value={major}>{major}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={12}>
                <Select
                  placeholder="Lọc theo khóa"
                  value={selectedCourse}
                  onChange={handleCourseFilter}
                  className="w-full"
                  allowClear
                >
                  <Option value="all">Tất cả khóa</Option>
                  {courses.map(course => (
                    <Option key={course} value={course}>{course}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>

          {/* Student List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <Empty 
              description="Không tìm thấy sinh viên nào" 
              className="py-8"
            />
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <List
                itemLayout="horizontal"
                dataSource={filteredUsers}
                renderItem={user => (
                  <List.Item
                    className={`
                      p-3 rounded-lg mb-2 transition-all duration-200 cursor-pointer
                      ${user._id === scoreUserId 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'hover:bg-gray-50 border-transparent'
                      }
                    `}
                    onClick={() => handleUserClick(user)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={user.avatar} 
                          size={48}
                          icon={<UserOutlined />}
                          className="border-2 border-gray-200"
                        />
                      }
                      title={
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {user.fullName}
                          </span>
                              {user._id === scoreUserId && (
                             <Tag color="blue">Đang xem</Tag>
                           )}
                        </div>
                      }
                      description={
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="font-medium text-gray-600">MSSV:</span>
                            <span className="text-gray-800">{user.studentId}</span>
                          </div>
                          {user.course && (
                                                         <div className="flex items-center gap-1 text-sm">
                               <CrownOutlined className="text-gray-400" />
                               <span className="text-gray-600">Khóa:</span>
                               <span className="text-gray-800">{user.course}</span>
                             </div>
                          )}
                          {user.major && (
                            <div className="flex items-center gap-1 text-sm">
                              <BookOutlined className="text-gray-400" />
                              <span className="text-gray-600">Ngành:</span>
                              <span className="text-gray-800">{user.major}</span>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </Card>
      </div>
      {isScoreExpanded && (
        <div className="flex-1">
        {scoreUserId ? (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <BookOutlined className="text-green-500" />
                <span>Bảng điểm: {selectedUser?.fullName || ''}</span>
              </div>
            }
          >
            <SemesterScoreTable userId={scoreUserId} />
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <UserOutlined className="text-6xl mb-4 text-gray-300" />
            <p className="text-lg">Chọn sinh viên để xem bảng điểm</p>
            <p className="text-sm text-gray-400">Sử dụng danh sách bên trái để chọn sinh viên</p>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default StudentScore;