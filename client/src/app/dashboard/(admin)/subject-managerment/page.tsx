'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactPaginate from 'react-paginate';

// Schema validation
const schema = z.object({
    subjectCode: z
        .string()
        .regex(/^[A-Z]{2}\d{3}$/, { message: 'Mã môn học phải có 2 chữ cái đầu và 3 số cuối (VD: NT101)' }),
    subjectName: z.string().min(1, 'Tên môn học không được để trống'),
    credit: z.preprocess((val) => Number(val), z.number().min(1, 'Tín chỉ không được nhỏ hơn 1')),
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
    specialized: z.enum(['MMTT', 'ATTT', 'Tự chọn']),
    relatedToIndustry: z.string().optional(),
});

const fakeSubjects = [
    {
        subjectCode: 'CS101',
        subjectName: 'Lập trình C++',
        credit: 3,
        specialized: 'MMTT',
        blockOfKnowledge: 'Cơ sở ngành',
        relatedToIndustry: '',
    },
    {
        subjectCode: 'CS102',
        subjectName: 'Lập trình Java',
        credit: 3,
        specialized: 'ATTT',
        blockOfKnowledge: 'Chuyên ngành',
        relatedToIndustry: 'CNTT',
    },
];

const SubjectManagement = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: zodResolver(schema) });

    const [subjects, setSubjects] = useState(fakeSubjects);
    const [page, setPage] = useState(0);
    const subjectsPerPage = 5;

    type FormData = z.infer<typeof schema>;

    const onSubmit = (data: FormData) => {
        setSubjects((prev) => [
            ...prev,
            { ...data, relatedToIndustry: data.relatedToIndustry ?? '' }, // Đảm bảo luôn là string
        ]);
        alert('Thêm môn học thành công!');
        reset();
    };

    const pageCount = Math.ceil(subjects.length / subjectsPerPage);
    const handlePageClick = (event: any) => {
        setPage(event.selected as number);
    };
    const displayedSubjects = subjects.slice(page * subjectsPerPage, (page + 1) * subjectsPerPage);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Quản lý Môn Học</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-100 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Mã môn học</label>
                        <input {...register('subjectCode')} className="w-full p-2 border rounded" />
                        <p className="text-red-500 text-sm">{errors.subjectCode?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tên môn học</label>
                        <input {...register('subjectName')} className="w-full p-2 border rounded" />
                        <p className="text-red-500 text-sm">{errors.subjectName?.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Tín chỉ</label>
                        <input
                            type="number"
                            {...register('credit', { valueAsNumber: true })}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-red-500 text-sm">{errors.credit?.message}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Chuyên ngành</label>
                        <select {...register('specialized')} className="w-full p-2 border rounded">
                            {schema.shape.specialized._def.values.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

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

                <div>
                    <label className="block text-sm font-medium">Liên quan đến ngành</label>
                    <input {...register('relatedToIndustry')} className="w-full p-2 border rounded" />
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Thêm môn học
                </button>
            </form>

            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Danh sách môn học</h3>
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Mã môn</th>
                            <th className="border p-2">Tên môn</th>
                            <th className="border p-2">Tín chỉ</th>
                            <th className="border p-2">Chuyên ngành</th>
                            <th className="border p-2">Khối kiến thức</th>
                            <th className="border p-2">Liên quan đến ngành</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedSubjects.map((subject, index) => (
                            <tr key={index} className="text-center">
                                <td className="border p-2">{subject.subjectCode}</td>
                                <td className="border p-2">{subject.subjectName}</td>
                                <td className="border p-2">{subject.credit}</td>
                                <td className="border p-2">{subject.specialized}</td>
                                <td className="border p-2">{subject.blockOfKnowledge}</td>
                                <td className="border p-2">{subject.relatedToIndustry || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-center">
                    <ReactPaginate
                        previousLabel={'←'}
                        nextLabel={'→'}
                        pageCount={pageCount}
                        onPageChange={handlePageClick}
                        containerClassName={'flex space-x-2'}
                        activeClassName={'bg-blue-500 text-white px-3 py-1 rounded'}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubjectManagement;
