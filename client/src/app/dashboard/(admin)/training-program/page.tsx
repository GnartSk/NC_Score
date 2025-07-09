"use client";
import React, { useEffect, useState } from "react";

interface TrainingProgram {
  _id: string;
  major: string;
  majorCode: string;
  course: string;
  subjects: { group: string; subjectCode: string; subjectName: string }[];
}

const TrainingProgramPage = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [major, setMajor] = useState("");
  const [majorCode, setMajorCode] = useState("");
  const [course, setCourse] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editing, setEditing] = useState<TrainingProgram | null>(null);
  const [editMajor, setEditMajor] = useState("");
  const [editMajorCode, setEditMajorCode] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [detail, setDetail] = useState<TrainingProgram | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(programs.length / pageSize);
  const pagedPrograms = programs.slice((page - 1) * pageSize, page * pageSize);

  const fixedMajors = [
    'An toàn thông tin',
    'Mạng máy tính & Truyền thông dữ liệu',
  ];
  const fixedMajorCodes = [
    'ATTT',
    'MMT',
  ];
  const fixedCourses = [
    'Khóa 2021 - K16',
    'Khóa 2022 - K17',
    'Khóa 2023 - K18',
    'Khóa 2024 - K19',
  ];


  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const token = getCookie('NCToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/training-program`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      console.log("DATA FROM API:", data);
      if (Array.isArray(data)) {
        setPrograms(data);
      } else if (Array.isArray(data.data)) {
        setPrograms(data.data);
      } else {
        setPrograms([]);
        console.error("API /training-program trả về không phải mảng:", data);
      }
    } catch (err) {
      setPrograms([]);
      console.error("Lỗi khi fetch /training-program:", err);
    }
    setLoading(false);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Hàm lấy cookie theo tên
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
    return '';
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !major || !majorCode || !course) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("major", major);
    formData.append("majorCode", majorCode);
    formData.append("course", course);
    const token = getCookie('NCToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/training-program/upload`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (res.ok) {
        setFile(null);
        setMajor("");
        setMajorCode("");
        setCourse("");
        fetchPrograms();
        showToast('success', 'Upload thành công!');
      } else {
        showToast('error', 'Upload thất bại!');
      }
    } catch (err) {
      showToast('error', 'Có lỗi xảy ra!');
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    try {
      const token = getCookie('NCToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/training-program/${id}`, { method: 'DELETE', credentials: 'include', headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.ok) {
        fetchPrograms();
        showToast('success', 'Xóa thành công!');
      } else {
        showToast('error', 'Xóa thất bại!');
      }
    } catch (err) {
      showToast('error', 'Có lỗi xảy ra!');
    }
  };

  const openEdit = (program: TrainingProgram) => {
    setEditing(program);
    setEditMajor(program.major);
    setEditMajorCode(program.majorCode);
    setEditCourse(program.course);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setEditLoading(true);
    try {
      const token = getCookie('NCToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/training-program/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ major: editMajor, majorCode: editMajorCode, course: editCourse }),
        credentials: 'include',
      });
      if (res.ok) {
        setEditing(null);
        fetchPrograms();
        showToast('success', 'Cập nhật thành công!');
      } else {
        showToast('error', 'Cập nhật thất bại!');
      }
    } catch (err) {
      showToast('error', 'Có lỗi xảy ra!');
    }
    setEditLoading(false);
  };

  // Xử lý upload file Excel và xóa chương trình đào tạo

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Quản lý Chương trình đào tạo</h1>
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded text-white shadow ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="mb-6 flex flex-col md:flex-row gap-2 items-center justify-between">
        <form className="flex flex-wrap gap-2 items-center" onSubmit={handleUpload}>
          <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)} className="border px-2 py-1 rounded" />
          <select value={major} onChange={e => setMajor(e.target.value)} className="border px-2 py-1 rounded">
            <option value="">Chọn ngành</option>
            {fixedMajors.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
          <select value={majorCode} onChange={e => setMajorCode(e.target.value)} className="border px-2 py-1 rounded">
            <option value="">Chọn mã ngành</option>
            {fixedMajorCodes.map((code, idx) => (
              <option key={idx} value={code}>{code}</option>
            ))}
          </select>
          <select value={course} onChange={e => setCourse(e.target.value)} className="border px-2 py-1 rounded">
            <option value="">Chọn khóa</option>
            {fixedCourses.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition" disabled={uploading}>{uploading ? "Đang tải..." : "Upload file Excel"}</button>
        </form>
      </div>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border rounded overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-center">
              <th className="border px-2 py-2 font-semibold">Ngành</th>
              <th className="border px-2 py-2 font-semibold">Mã ngành</th>
              <th className="border px-2 py-2 font-semibold">Khóa</th>
              <th className="border px-2 py-2 font-semibold">Số môn</th>
              <th className="border px-2 py-2 font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
            ) : pagedPrograms.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4">Không có dữ liệu</td></tr>
            ) : (
              pagedPrograms.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50 transition">
                  <td className="border px-2 py-2 text-center">{p.major}</td>
                  <td className="border px-2 py-2 text-center">{p.majorCode}</td>
                  <td className="border px-2 py-2 text-center">{p.course}</td>
                  <td className="border px-2 py-2 text-center">{p.subjects.length}</td>
                  <td className="border px-2 py-2 text-center">
                    <button className="text-green-700 hover:underline hover:text-green-900 font-semibold mr-2" onClick={() => setDetail(p)}>Chi tiết</button>
                    <button className="text-blue-700 hover:underline hover:text-blue-900 font-semibold mr-2" onClick={() => openEdit(p)}>Sửa</button>
                    <button className="text-red-700 hover:underline hover:text-red-900 font-semibold" onClick={() => handleDelete(p._id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Trước</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Sau</button>
        </div>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition">
          <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa chương trình đào tạo</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-3">
              <input type="text" placeholder="Ngành" value={editMajor} onChange={e => setEditMajor(e.target.value)} className="border px-2 py-1 rounded" />
              <input type="text" placeholder="Mã ngành" value={editMajorCode} onChange={e => setEditMajorCode(e.target.value)} className="border px-2 py-1 rounded" />
              <input type="text" placeholder="Khóa" value={editCourse} onChange={e => setEditCourse(e.target.value)} className="border px-2 py-1 rounded" />
              <div className="flex gap-2 mt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={editLoading}>{editLoading ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={() => setEditing(null)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition">
          <div className="bg-white p-6 rounded-lg shadow w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Danh sách môn học ({detail.major} - {detail.course})</h2>
            <table className="min-w-full border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Nhóm môn</th>
                  <th className="border px-2 py-1">Mã môn</th>
                  <th className="border px-2 py-1">Tên môn</th>
                </tr>
              </thead>
              <tbody>
                {detail.subjects.map((s, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{s.group}</td>
                    <td className="border px-2 py-1">{s.subjectCode}</td>
                    <td className="border px-2 py-1">{s.subjectName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setDetail(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingProgramPage; 