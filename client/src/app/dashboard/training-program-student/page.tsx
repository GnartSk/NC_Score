'use client';
import { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";
import { getCourseSelection } from "@/utils/courseUtils";

export default function TrainingProgramPage() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [major, setMajor] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);

  // Lấy ngành và khóa của user từ localStorage hoặc profile
  useEffect(() => {
    const courseSelection = getCourseSelection();
    if (courseSelection) {
      setMajor(courseSelection.major);
      setCourse(courseSelection.course);
    } else {
      // Nếu không có trong localStorage, thử lấy từ profile
      async function fetchUserProfile() {
        try {
          const token = typeof window !== "undefined" ? localStorage.getItem("NCToken") : null;
          if (!token) return null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return null;
          const data = await res.json();
          setMajor(data.data?.major || null);
          setCourse(data.data?.course || null);
        } catch {
          setMajor(null);
          setCourse(null);
        }
      }
      fetchUserProfile();
    }
  }, []);

  // Fetch CTĐT khi có major và course
  useEffect(() => {
    async function fetchTrainingProgram(major: string, course: string) {
      try {
        const url = `${process.env.NEXT_PUBLIC_BackendURL}/training-program/${encodeURIComponent(major)}/${encodeURIComponent(course)}`;
        console.log('[CTĐT] Fetch URL:', url);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không tìm thấy chương trình đào tạo phù hợp.");
        const data = await res.json();
        console.log('[CTĐT] API response:', data);
        return data.data?.subjects || [];
      } catch (err: any) {
        setError(err.message || "Lỗi khi lấy chương trình đào tạo.");
        return [];
      }
    }
    if (major && course) {
      setLoading(true);
      console.log('[CTĐT] Fetching with major:', major, 'course:', course);
      fetchTrainingProgram(major, course).then((subjects) => {
        setSubjects(subjects);
        setLoading(false);
      });
    }
  }, [major, course]);

  const columns = [
    { title: "Nhóm", dataIndex: "group", key: "group" },
    { title: "Mã môn", dataIndex: "subjectCode", key: "subjectCode" },
    { title: "Tên môn", dataIndex: "subjectName", key: "subjectName" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Chương trình đào tạo của bạn</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} showIcon />
      ) : subjects.length === 0 ? (
        <Alert type="info" message="Không tìm thấy chương trình đào tạo phù hợp với ngành và khóa của bạn." showIcon />
      ) : (
        <Table
          columns={columns}
          dataSource={subjects}
          rowKey={(record) => record.subjectCode}
          pagination={false}
          bordered
        />
      )}
    </div>
  );
} 