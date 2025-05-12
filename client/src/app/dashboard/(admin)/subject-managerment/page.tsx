'use client';

import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactPaginate from 'react-paginate';
import Select from 'react-dropdown-select';
import { FaXmark } from 'react-icons/fa6';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';

const schema = z.object({
    subjectCode: z.string().regex(/^[A-Z]{2}\d{3}$/, { message: 'VD: NT101' }),
    subjectName: z.string().min(1, 'Không được để trống'),
    credit: z.preprocess(Number, z.number().min(1, 'Tối thiểu 1 tín chỉ')),
    blockOfKnowledge: z.enum([
        'Các môn lý luận chính trị',
        'Toán – Tin học – Khoa học tự nhiên',
        'Ngoại ngữ',
        'Cơ sở ngành',
        'Chuyên ngành',
        'Tự chọn',
        'Thực tập doanh nghiệp',
        'Đồ án',
        'Khóa luận tốt nghiệp',
        'Chuyên đề tốt nghiệp',
    ]),
    specialized: z.enum(['MMTT', 'ATTT', 'Trường']).optional(),
    subjectDescription: z.string().optional(),
    relatedToIndustry: z.string().optional(),
});

type JobType = { id: string; name: number };

const job: JobType[] = [
    { id: 'Software Developer/ Engineer', name: 1 },
    { id: 'Front-end Developer', name: 2 },
    { id: 'Back-end Developer', name: 3 },
    { id: 'Full-stack Developer', name: 4 },
    { id: 'Mobile Application Developer', name: 5 },
    { id: 'Android Developer', name: 6 },
    { id: 'Kotlin Developer', name: 7 },
    { id: 'DevOps Engineer', name: 8 },
    { id: 'Software Architect', name: 9 },
    { id: 'Embedded Systems Developer', name: 10 },
    { id: 'C++ Developer', name: 11 },
    { id: 'Game Developer', name: 12 },
    { id: 'Data Engineer', name: 13 },
    { id: 'Systems Engineer', name: 14 },
    { id: 'AWS Cloud Engineer', name: 15 },
    { id: 'Azure Cloud Engineer', name: 16 },
    { id: 'Google Cloud (GCP) Engineer', name: 17 },
    { id: 'JavaScript Developer', name: 18 },
    { id: 'API Developer', name: 19 },
    { id: 'Integration Engineer', name: 20 },
    { id: 'Firmware Developer', name: 21 },
    { id: 'Cybersecurity Engineering', name: 22 },
    { id: 'Network and System Administration', name: 23 },
    { id: 'Ethical Hacking and Penetration Testing	', name: 24 },
    { id: 'Malware Analysis and Reverse Engineering	', name: 25 },
    { id: 'Cloud Security', name: 26 },
    { id: 'Linux System Administration', name: 27 },
    { id: 'Cloud & Server Management', name: 28 },
];

const SubjectManagement = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
        watch,
    } = useForm({ resolver: zodResolver(schema) });

    const [subjects, setSubjects] = useState<z.infer<typeof schema>[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const subjectsPerPage = 10;
    const [selectedJob, setSelectedJob] = useState<JobType[]>([]);
    const token = Cookies.get('NCToken') || '';

    const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
    const [searchTerm, setSearchTerm] = useState('');

    const toggleExpand = (index: number) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const filteredJobs = job.filter((item) => item.id.toLowerCase().includes(searchTerm.toLowerCase()));

    type FormData = z.infer<typeof schema>;

    const getSubject = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BackendURL}/subject?page=${page + 1}&limit=${subjectsPerPage}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!res.ok) {
                const errorData = await res.json();
                console.log('Error Response:', errorData);
                throw new Error(errorData.message || 'Invalid credentials');
            }

            const responseData = await res.json();
            console.log('Response: ', responseData.data);
            setTotalPages(responseData.data.totalPages);
            setSubjects(responseData.data.subject);
        } catch (error) {
            console.error('Post subject error:', error);
            return;
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
        getSubject();
    }, [page]);

    console.log(page);
    console.log(subjects);

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/subject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    subjectCode: data.subjectCode,
                    subjectName: data.subjectName,
                    credit: data.credit,
                    blockOfKnowledge: data.blockOfKnowledge,
                    specialized: data.specialized,
                    subjectDescription: data.subjectDescription,
                    relatedToIndustry: data.relatedToIndustry,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log('Error Response:', errorData);
                throw new Error(errorData.message || 'Invalid credentials');
            }

            const responseData = await res.json();
            console.log('Response: ', responseData);
        } catch (error) {
            console.error('Post subject error:', error);
            return;
        }

        setSubjects((prev: z.infer<typeof schema>[]) =>
            prev.map((item) => ({
                ...item,
                specialized: item.specialized ?? undefined,
            })),
        );

        alert('Thêm môn học thành công!');
        window.location.reload();
    };

    const onDeleteSubject = async () => {
        const deleteSubjectCode = watch('subjectCode');
        // console.log(deleteSubjectCode);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/subject/${deleteSubjectCode}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.log('Error Response:', errorData);
                throw new Error(errorData.message || 'Invalid credentials');
            }

            const responseData = await res.json();
            console.log('Response: ', responseData);
        } catch (error) {
            console.error('Delete subject error:', error);
            return;
        }

        alert(`Xóa môn học ${deleteSubjectCode}!`);
        window.location.reload();
    };

    const handlePatchSubject = (data: FormData) => {
        setValue('subjectCode', data.subjectCode);
        setValue('credit', data.credit);
        setValue('subjectName', data.subjectName);
        setValue('blockOfKnowledge', data.blockOfKnowledge);
        setValue('subjectDescription', data.subjectDescription);
        setValue('specialized', data.specialized);

        if (data.relatedToIndustry) {
            const selectedJobs = data.relatedToIndustry
                .split(', ')
                .map((id) => job.find((item) => item.id === id))
                .filter(Boolean) as JobType[]; // Lọc các giá trị hợp lệ

            setSelectedJob(selectedJobs);
            setValue('relatedToIndustry', selectedJobs.map((item) => item.id).join(', '));
        } else {
            setSelectedJob([]);
            setValue('relatedToIndustry', '');
        }
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Quản lý Môn Học</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-100 p-4 rounded-md">
                    <div className="grid grid-cols-10 gap-4">
                        <div className="col-span-3">
                            <label className="block text-sm font-medium">Mã môn học</label>
                            <input {...register('subjectCode')} className="w-full p-2 border rounded" />
                            <p className="text-red-500 text-sm">{errors.subjectCode?.message}</p>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium">Số tín chỉ</label>
                            <input type="number" {...register('credit')} className="w-full p-2 border rounded" />
                            <p className="text-red-500 text-sm">{errors.credit?.message}</p>
                        </div>
                        <div className="col-span-5">
                            <label className="block text-sm font-medium">Tên môn học</label>
                            <input {...register('subjectName')} className="w-full p-2 border rounded" />
                            <p className="text-red-500 text-sm">{errors.subjectName?.message}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Khối kiến thức</label>
                            <select {...register('blockOfKnowledge')} className="w-full p-2 border rounded">
                                {schema.shape.blockOfKnowledge._def.values.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(watch('blockOfKnowledge') === 'Chuyên ngành' ||
                            watch('blockOfKnowledge') === 'Cơ sở ngành') && (
                            <div>
                                <label className="block text-sm font-medium">Thuộc chuyên ngành</label>
                                <select {...register('specialized')} className="w-full p-2 border rounded">
                                    {schema.shape.specialized.unwrap()._def.values.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Mô tả môn học</label>
                        <textarea {...register('subjectDescription')} className="w-full h-20 p-2 border rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Liên quan đến ngành</label>

                        <Select
                            options={filteredJobs} // Danh sách lựa chọn có kiểu đúng
                            labelField="id"
                            valueField="name"
                            multi
                            values={selectedJob} // Đảm bảo kiểu của values khớp với options
                            onChange={(selectedValues) => {
                                setSelectedJob(selectedValues);
                                setValue('relatedToIndustry', selectedValues.map((item) => item.id).join(', '));
                            }}
                            className="bg-white p-5 rounded-md border border-gray-300 focus:border-blue-500"
                            contentRenderer={({ state }) => (
                                <div className="flex flex-wrap gap-2">
                                    {state.values.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center my-1 px-1.5 py-1 border border-blue-500 text-black bg-white rounded-md"
                                        >
                                            {item.id}
                                            <button
                                                className="ml-1 p-0.5 flex items-center justify-center text-red-500 rounded-[5px] transition-transform ease-in duration-30 border-white hover:bg-red-500 hover:text-white"
                                                onClick={() =>
                                                    setSelectedJob((prev) => prev.filter((j) => j.id !== item.id))
                                                }
                                            >
                                                <FaXmark />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            itemRenderer={({ item }) => {
                                const isSelected = selectedJob.some((j) => j.id === item.id);

                                return (
                                    <div
                                        className={`flex items-center justify-between p-2 cursor-pointer ${
                                            isSelected ? 'bg-blue-200' : ''
                                        }`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedJob(selectedJob.filter((j) => j.id !== item.id));
                                            } else {
                                                setSelectedJob([...selectedJob, item]);
                                            }
                                        }}
                                    >
                                        {item.id}
                                        <FontAwesomeIcon
                                            icon={isSelected ? faSquareCheck : faSquare}
                                            className="ml-2"
                                        />
                                    </div>
                                );
                            }}
                            dropdownRenderer={() => (
                                <div className="p-2">
                                    {/* Ô tìm kiếm trong dropdown */}
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />

                                    {/* Hiển thị danh sách đã lọc */}
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((item) => {
                                            const isSelected = selectedJob.some((j) => j.id === item.id);

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`flex items-center justify-between p-2 cursor-pointer ${
                                                        isSelected ? 'bg-blue-200' : ''
                                                    }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedJob(selectedJob.filter((j) => j.id !== item.id));
                                                        } else {
                                                            setSelectedJob([...selectedJob, item]);
                                                        }
                                                    }}
                                                >
                                                    {item.id}
                                                    <FontAwesomeIcon
                                                        icon={isSelected ? faSquareCheck : faSquare}
                                                        className="ml-2"
                                                    />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 text-center">Không tìm thấy kết quả</p>
                                    )}
                                </div>
                            )}
                            dropdownPosition="auto"
                            dropdownHandleRenderer={() => null} // Ẩn phần điều khiển dropdown
                            dropdownGap={5}
                            dropdownHeight="300px"
                        />

                        {/* Input ẩn để lưu giá trị vào react-hook-form */}
                        <input type="hidden" {...register('relatedToIndustry')} />
                    </div>

                    <div className="w-full flex justify-between">
                        <button type="submit" className="w-[49.5%] bg-blue-500 text-white py-2 rounded">
                            Thêm môn học
                        </button>
                        <button
                            type="button"
                            className="w-[49.5%] bg-red-500 text-white py-2 rounded"
                            onClick={onDeleteSubject}
                        >
                            Xóa môn học
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-6 bg-white p-6 mx-auto shadow-md rounded-lg">
                <h3 className="text-lg font-bold mb-2">Danh sách môn học</h3>
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            {[
                                'Mã môn',
                                'Tên môn',
                                'Tín chỉ',
                                'Chuyên ngành',
                                'Khối kiến thức',
                                'Ngành liên quan',
                                'Mô tả',
                            ].map((title, index) => (
                                <th
                                    key={title}
                                    className={`border p-2 ${index === 6 ? 'w-[40%]' : 'w-[10%]'}`} // 👈 Mô tả lớn nhất
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length > 0
                            ? subjects.map((sub, index) => (
                                  <Fragment key={index}>
                                      <tr
                                          className="text-center hover:bg-gray-100 transition"
                                          onClick={() =>
                                              handlePatchSubject({
                                                  ...sub,
                                                  blockOfKnowledge: sub.blockOfKnowledge as
                                                      | 'Các môn lý luận chính trị'
                                                      | 'Toán – Tin học – Khoa học tự nhiên'
                                                      | 'Ngoại ngữ'
                                                      | 'Cơ sở ngành'
                                                      | 'Chuyên ngành'
                                                      | 'Tự chọn'
                                                      | 'Thực tập doanh nghiệp'
                                                      | 'Đồ án'
                                                      | 'Khóa luận tốt nghiệp'
                                                      | 'Chuyên đề tốt nghiệp',
                                                  specialized: sub.specialized as
                                                      | 'MMTT'
                                                      | 'ATTT'
                                                      | 'Trường'
                                                      | undefined,
                                              })
                                          }
                                      >
                                          {[
                                              sub.subjectCode,
                                              sub.subjectName,
                                              sub.credit,
                                              sub.specialized || 'N/A',
                                              sub.blockOfKnowledge,
                                              sub.relatedToIndustry || 'N/A',
                                          ].map((val, i) => (
                                              <td
                                                  key={i}
                                                  className={`border p-3 text-sm ${
                                                      [0, 2, 3, 4].includes(i)
                                                          ? 'w-[10%]'
                                                          : i === 1
                                                          ? 'w-[15%] font-medium'
                                                          : i === 5
                                                          ? 'w-[30%]'
                                                          : ''
                                                  }`}
                                              >
                                                  {val}
                                              </td>
                                          ))}
                                          <td className="border p-3 w-[5%]">
                                              <button
                                                  className="text-blue-600 hover:underline font-medium"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleExpand(index);
                                                  }}
                                              >
                                                  {expandedRows[index] ? 'Thu gọn' : 'Xem thêm'}
                                              </button>
                                          </td>
                                      </tr>
                                      {expandedRows[index] && (
                                          <tr className="bg-gray-50 border-t">
                                              <td colSpan={7} className="p-4 text-left">
                                                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                      {sub.subjectDescription || 'Không có mô tả'}
                                                  </div>
                                              </td>
                                          </tr>
                                      )}
                                  </Fragment>
                              ))
                            : Array.from({ length: 5 }).map((_, index) => (
                                  <tr key={index} className="text-center animate-pulse">
                                      {Array.from({ length: 7 }).map((_, i) => (
                                          <td
                                              key={i}
                                              className={`border p-2 ${
                                                  i === 6 ? 'w-[5%] text-left' : i === 5 ? 'w-[30%]' : 'w-[10%]'
                                              }`}
                                          >
                                              <div className="h-5 w-full bg-gray-300 rounded"></div>
                                          </td>
                                      ))}
                                  </tr>
                              ))}
                    </tbody>
                </table>
                <div className="mt-4 flex justify-center">
                    <ReactPaginate
                        previousLabel={'←'}
                        nextLabel={'→'}
                        pageCount={totalPages}
                        onPageChange={(e) => {
                            console.log('Selected page:', e.selected);
                            setPage(e.selected);
                        }}
                        containerClassName={'flex space-x-2 border border-gray-300 rounded-lg p-2 bg-white'}
                        pageClassName={
                            'px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition duration-200'
                        }
                        pageLinkClassName={'block'}
                        activeLinkClassName="text-white"
                        activeClassName={'bg-blue-500 text-white border-blue-500'}
                        previousClassName={
                            'px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-200'
                        }
                        nextClassName={
                            'px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-200'
                        }
                        disabledClassName={'opacity-50 cursor-not-allowed'}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubjectManagement;
