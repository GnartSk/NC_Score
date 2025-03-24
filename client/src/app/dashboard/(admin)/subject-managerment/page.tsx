'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactPaginate from 'react-paginate';
import Select from 'react-dropdown-select';
import { FaXmark } from 'react-icons/fa6';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const schema = z.object({
    subjectCode: z.string().regex(/^[A-Z]{2}\d{3}$/, { message: 'VD: NT101' }),
    subjectName: z.string().min(1, 'Không được để trống'),
    credit: z.preprocess(Number, z.number().min(1, 'Tối thiểu 1 tín chỉ')),
    blockOfKnowledge: z.enum([
        'Lý luận chính trị',
        'Toán - Tin',
        'Ngoại ngữ',
        'Cơ sở ngành',
        'Chuyên ngành',
        'Tự chọn',
        'Thực tập',
        'Đồ án',
        'Khóa luận',
        'Chuyên đề',
    ]),
    specialized: z.enum(['MMTT', 'ATTT', 'Trường']).optional(),
    subjectDescription: z.string().optional(),
    relatedToIndustry: z.string().optional(),
});

const fakeSubjects = [
    {
        subjectCode: 'CS101',
        subjectName: 'Lập trình C++',
        credit: 3,
        specialized: 'MMTT',
        subjectDescription: 'Hehe',
        blockOfKnowledge: 'Cơ sở ngành',
    },
    {
        subjectCode: 'CS102',
        subjectName: 'Lập trình Java',
        credit: 3,
        specialized: 'ATTT',
        blockOfKnowledge: 'Chuyên ngành',
        relatedToIndustry: 'CNTT, Web dev',
    },
];

type JobType = { id: string; name: number };

const job: JobType[] = [
    { id: 'Web dev', name: 1 },
    { id: 'Mobile dev', name: 2 },
    { id: 'zzzzzz dev', name: 3 },
    { id: 'CNTT', name: 4 },
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
    const [subjects, setSubjects] = useState(fakeSubjects);
    const [page, setPage] = useState(0);
    const subjectsPerPage = 5;
    const [selectedJob, setSelectedJob] = useState<JobType[]>([]);

    type FormData = z.infer<typeof schema>;

    const onSubmit = (data: FormData) => {
        setSubjects((prev) =>
            prev.map((item) => ({
                ...item,
                specialized: item.specialized ?? '',
            })),
        );
        alert('Thêm môn học thành công!');
        reset();
    };

    const handlePatchSubject = (data: FormData) => {
        console.log(data);
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
                        {watch('blockOfKnowledge') === 'Chuyên ngành' && (
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
                        {/* <input {...register('relatedToIndustry')} className="w-full p-2 border rounded" /> */}
                        <Select
                            options={job} // Danh sách lựa chọn có kiểu đúng
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
                            dropdownPosition="auto"
                            dropdownHandleRenderer={() => null} // Ẩn phần điều khiển dropdown
                            dropdownGap={5}
                            dropdownHeight="200px"
                        />

                        {/* Input ẩn để lưu giá trị vào react-hook-form */}
                        <input type="hidden" {...register('relatedToIndustry')} />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                        Thêm môn học
                    </button>
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
                        {subjects.slice(page * subjectsPerPage, (page + 1) * subjectsPerPage).map((sub, index) => (
                            <tr
                                key={index}
                                className="text-center"
                                onClick={() =>
                                    handlePatchSubject({
                                        ...sub,
                                        blockOfKnowledge: sub.blockOfKnowledge as
                                            | 'Lý luận chính trị'
                                            | 'Toán - Tin'
                                            | 'Ngoại ngữ'
                                            | 'Cơ sở ngành'
                                            | 'Chuyên ngành'
                                            | 'Tự chọn'
                                            | 'Thực tập'
                                            | 'Đồ án'
                                            | 'Khóa luận'
                                            | 'Chuyên đề',
                                        specialized: sub.specialized as 'MMTT' | 'ATTT' | 'Trường' | undefined,
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
                                    sub.subjectDescription || 'Không có mô tả',
                                ].map((val, i) => (
                                    <td key={i} className={`border p-2 ${i === 6 ? 'w-[40%] text-left' : 'w-[10%]'}`}>
                                        {val}
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
                        pageCount={Math.ceil(subjects.length / subjectsPerPage)}
                        onPageChange={(e) => setPage(e.selected)}
                        containerClassName={'flex space-x-2 border border-gray-300 rounded-lg p-2 bg-white'}
                        pageClassName={
                            'px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition duration-200'
                        }
                        pageLinkClassName={'block'}
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
