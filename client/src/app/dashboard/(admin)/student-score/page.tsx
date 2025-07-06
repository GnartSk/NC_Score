'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, List, Card, Spin } from 'antd';
import SemesterScoreTable from '@/components/SemesterScoreTable';
import { getCookie } from 'cookies-next';
import { StudentContext } from '@/lib/student.context';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setCollapseMenu } = useContext(StudentContext)!;

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user`, {
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
    } else {
      setScoreUserId(null);
      setSelectedUser(null);
    }
  }, [searchParams, users]);

  const handleUserClick = (user: UserInfo) => {
    setCollapseMenu(true);
    router.push(`?id=${user._id}`);
  };

  return (
    <div className="flex gap-8">
      <div className="w-1/3">
        <Card title="Danh sách sinh viên" className="h-full">
          {loading ? <Spin /> : (
            <List
              itemLayout="horizontal"
              dataSource={users}
              renderItem={user => (
                <List.Item
                  className={user._id === scoreUserId ? 'bg-blue-100' : ''}
                  onClick={() => handleUserClick(user)}
                  style={{ cursor: 'pointer' }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={user.avatar} />}
                    title={<span>{user.fullName}</span>}
                    description={<>
                      <div>MSSV: {user.studentId}</div>
                      <div>Khóa: {user.course || '-'}</div>
                      <div>Ngành: {user.major || '-'}</div>
                    </>}
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
      <div className="flex-1">
        {scoreUserId ? (
          <Card title={`Bảng điểm: ${selectedUser?.fullName || ''}`}>
            <SemesterScoreTable userId={scoreUserId} />
          </Card>
        ) : (
          <div className="text-gray-500 text-center mt-20">Chọn sinh viên để xem bảng điểm</div>
        )}
      </div>
    </div>
  );
};
export default StudentScore;