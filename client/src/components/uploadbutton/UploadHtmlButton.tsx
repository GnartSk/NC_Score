'use client';
import { Button, Upload, message, Modal, Table, Tabs, Space } from 'antd';
import { UploadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { getCookie } from 'cookies-next';
import { isGroupSubject } from '@/utils/groupSubjectMap';
import { getCourseSelection } from '@/utils/courseUtils';

interface Subject {
    id: number;
    code: string;
    name: string;
    credits: number;
    qt?: number;
    th?: number;
    gk?: number;
    ck?: number;
    total?: number;
    status: string;
    category: string;
}

interface UploadHtmlButtonProps {
    onUploadSuccess?: (data: any) => void;
}

// Helper function to get cookie value
const getCookieValue = (name: string): string | null => {
    if (typeof document === 'undefined') return null;

    try {
        return (getCookie(name) as string) || null;
    } catch (error) {
        console.error('Error getting cookie:', error);
        return null;
    }
};

// Hàm lấy ngành học từ API
async function fetchUserMajor(): Promise<string | null> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('NCToken') : null;
        if (!token) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data?.major || null;
    } catch {
        return null;
    }
}

// Hàm chuẩn hóa tên ngành về đúng key trong groupSubjectMap
function normalizeMajor(major: string) {
    if (!major) return '';
    if (major.toLowerCase().includes('an toàn thông tin')) return 'An toàn thông tin';
    if (major.toLowerCase().includes('mạng máy tính')) return 'Mạng máy tính & Truyền thông dữ liệu';
    return major;
}

function getMajorFromLocalStorage() {
    try {
        const profile = localStorage.getItem('profile');
        if (profile) {
            const parsed = JSON.parse(profile);
            if (parsed.major) return parsed.major;
        }
    } catch {}
    return null;
}

const UploadHtmlButton = ({ onUploadSuccess }: UploadHtmlButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [parsedData, setParsedData] = useState<{ [key: string]: Subject[] }>({});
    const [activeTab, setActiveTab] = useState('political');
    const [refreshKey, setRefreshKey] = useState(0);
    const [major, setMajor] = useState<string>('');

    useEffect(() => {
        // Ưu tiên lấy ngành từ localStorage profile
        if (typeof window !== 'undefined') {
            const localMajor = getMajorFromLocalStorage();
            if (localMajor) {
                setMajor(normalizeMajor(localMajor));
            } else {
                const courseSelection = getCourseSelection();
                setMajor(normalizeMajor(courseSelection?.major || ''));
            }
        }
    }, []);

    // Cấu hình cột cho bảng xác nhận
    const columns: ColumnsType<Subject> = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: 'Mã môn',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên môn',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'TC',
            dataIndex: 'credits',
            key: 'credits',
            width: 60,
        },
        {
            title: 'QT',
            dataIndex: 'qt',
            key: 'qt',
            render: (val) => {
                if (val === 'Miễn') return 'Miễn';
                if (typeof val === 'number') return val.toFixed(1);
                return val || '-';
            },
        },
        {
            title: 'TH',
            dataIndex: 'th',
            key: 'th',
            render: (val) => {
                if (val === 'Miễn') return 'Miễn';
                if (typeof val === 'number') return val.toFixed(1);
                return val || '-';
            },
        },
        {
            title: 'GK',
            dataIndex: 'gk',
            key: 'gk',
            render: (val) => {
                if (val === 'Miễn') return 'Miễn';
                if (typeof val === 'number') return val.toFixed(1);
                return val || '-';
            },
        },
        {
            title: 'CK',
            dataIndex: 'ck',
            key: 'ck',
            render: (val) => {
                if (val === 'Miễn') return 'Miễn';
                if (typeof val === 'number') return val.toFixed(1);
                return val || '-';
            },
        },
        {
            title: 'TK',
            dataIndex: 'total',
            key: 'total',
            render: (val) => {
                if (val === 'Miễn') return 'Miễn';
                if (typeof val === 'number') return val.toFixed(1);
                return val || '-';
            },
        },
        {
            title: 'TT',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    // Hàm xử lý dữ liệu từ API để phân loại theo category
    const processApiData = (apiData: any) => {
        const categorizedData: { [key: string]: any[] } = {
            'Toán - Tin học - Khoa học tự nhiên': [],
            'Môn lý luận chính trị và pháp luật': [],
            'Ngoại ngữ': [],
            'Cơ sở ngành': [],
            'Chuyên ngành': [],
            'Môn học khác': [],
        };

        const semesterData: { [key: string]: any[] } = {};

        // Dùng biến major từ state (đã lấy ở useEffect)

        // Xử lý dữ liệu theo mẫu API trả về
        try {
            if (apiData?.data?.semesters) {
                // Lặp qua các học kỳ
                Object.keys(apiData.data.semesters).forEach((semester) => {
                    const semesterInfo = apiData.data.semesters[semester];

                    // Lặp qua danh sách môn học trong học kỳ
                    if (semesterInfo && Array.isArray(semesterInfo.subjects)) {
                        semesterInfo.subjects.forEach((subject: any, index: number) => {
                            // Xác định category dựa vào mã môn học
                            let category = 'Môn học khác'; // Default category
                            const code = subject.subjectCode || '';

                            // Ưu tiên kiểm tra theo ngành
                            if (isGroupSubject('Cơ sở ngành', major, code)) {
                                category = 'Cơ sở ngành';
                            } else if (isGroupSubject('Chuyên ngành', major, code)) {
                                category = 'Chuyên ngành';
                            } else if (code.startsWith('SS') && code !== 'SS004') {
                                category = 'Môn lý luận chính trị và pháp luật';
                            } else if (code.startsWith('MA') || code.startsWith('PH') || code === 'IT001') {
                                category = 'Toán - Tin học - Khoa học tự nhiên';
                            } else if (code.startsWith('EN')) {
                                category = 'Ngoại ngữ';
                            }

                            console.log(`Categorized as: ${category}`);

                            // Xác định trạng thái
                            let status = 'Chưa học';
                            if (subject.TK === 'Miễn') {
                                status = 'Miễn';
                            } else if (subject.TK === 'Hoãn thi') {
                                status = 'Hoãn thi';
                            } else if (
                                subject.TK === '&nbsp;' ||
                                subject.TK === '' ||
                                subject.TK === undefined ||
                                subject.TK === null
                            ) {
                                status = 'Đang học';
                            } else if (!isNaN(Number(subject.TK))) {
                                status = parseFloat(subject.TK) >= 5 ? 'Hoàn thành' : 'Rớt';
                            }
                            // Log trạng thái từng môn để debug
                            console.log(
                                `[DEBUG] ${code} - ${subject.subjectName} | TK: ${subject.TK} | Status: ${status}`,
                            );

                            const subjectData = {
                                id: index + 1,
                                code: subject.subjectCode || '',
                                name: subject.subjectName || '',
                                credits: parseInt(subject.credit || '0'),
                                qt: subject.QT ? parseFloat(subject.QT) : undefined,
                                th: subject.TH ? parseFloat(subject.TH) : undefined,
                                gk: subject.GK ? parseFloat(subject.GK) : undefined,
                                ck: subject.CK ? parseFloat(subject.CK) : undefined,
                                total: subject.TK
                                    ? subject.TK === 'Miễn'
                                        ? 'Miễn'
                                        : parseFloat(subject.TK)
                                    : undefined,
                                status: status,
                                category: category,
                                semester: semester,
                            };

                            // Thêm vào danh sách theo category
                            categorizedData[category].push(subjectData);

                            // Thêm vào danh sách theo học kỳ
                            if (!semesterData[semester]) {
                                semesterData[semester] = [];
                            }
                            semesterData[semester].push(subjectData);
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error processing API data:', error);
        }

        // Debug output - log how many subjects are in each category
        console.log('Categorized data summary:');
        Object.keys(categorizedData).forEach((category) => {
            console.log(`${category}: ${categorizedData[category].length} subjects`);
            if (categorizedData[category].length > 0) {
                console.log(
                    'Sample subjects:',
                    categorizedData[category].slice(0, 3).map((s) => `${s.code} - ${s.name}`),
                );
            }
        });

        return {
            categories: categorizedData,
            semesters: semesterData,
        };
    };

    // Xử lý file HTML và hiển thị dữ liệu để xác nhận
    const handleUpload = async (file: File) => {
        setLoading(true);

        try {
            // Lấy token từ cookie hoặc localStorage
            const token = localStorage.getItem('NCToken') || getCookieValue('NCToken');
            console.log(token);

            if (!token) {
                message.error('Bạn cần đăng nhập để sử dụng tính năng này');
                return;
            }

            // Tạo form data để gửi file
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/reader/html`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Lỗi khi đọc file: ${response.status}`);
            }

            const result = await response.json();

            if (!result.data) {
                throw new Error('Không tìm thấy dữ liệu từ file HTML');
            }

            // Lưu dữ liệu server gốc để xác nhận lưu
            (window as any)._lastServerScoreData = result.data;
            // Xử lý và phân loại dữ liệu chỉ để hiển thị modal
            const processedData = processApiData(result);

            // Lưu dữ liệu để hiển thị trong modal (chỉ show categories)
            setParsedData(processedData.categories);

            // Lưu tạm processedData vào state để dùng khi xác nhận
            (window as any)._lastProcessedScoreData = processedData;

            // Hiển thị modal xác nhận
            setModalVisible(true);
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Lỗi khi xử lý file HTML');
        } finally {
            setLoading(false);
        }
    };

    // Gửi dữ liệu đã xác nhận lên server
    const handleConfirmUpload = async () => {
        setConfirmLoading(true);

        try {
            // Lấy dữ liệu server gốc đã lưu tạm ở window
            const serverData = (window as any)._lastServerScoreData;

            // Lưu dữ liệu vào localStorage đúng định dạng server
            localStorage.setItem('html_score_data', JSON.stringify(serverData));

            // Gọi callback khi upload thành công
            if (onUploadSuccess) {
                onUploadSuccess(serverData);
            }

            message.success('Đã lưu điểm thành công!');
            setModalVisible(false);
            setRefreshKey((prev) => prev + 1);
            uploadAllScoreToServer();
        } catch (error) {
            console.error('Error saving score data:', error);
            message.error('Có lỗi xảy ra khi lưu điểm!');
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancelModal = () => {
        setModalVisible(false);
        setParsedData({});
    };

    const beforeUpload = (file: File) => {
        const isHTML = file.type === 'text/html';
        if (!isHTML) {
            message.error('Chỉ hỗ trợ file HTML!');
            return Upload.LIST_IGNORE;
        }

        // Thực hiện upload để phân tích file
        handleUpload(file);
        return false; // Ngăn chặn upload tự động
    };

    // Đếm số lượng môn học trong mỗi danh mục
    const getTabTitle = (category: string) => {
        const count = parsedData[category]?.length || 0;
        const titles: { [key: string]: string } = {
            political: 'Môn lý luận chính trị',
            math: 'Toán - Tin học',
        };
        return `${titles[category] || category} (${count})`;
    };

    // Hàm gọi API lưu điểm lên server
    const uploadAllScoreToServer = async () => {
        const htmlScoreData = localStorage.getItem('html_score_data');
        // Lấy token từ cookie hoặc localStorage
        const token = getCookie('NCToken') || localStorage.getItem('NCToken');
        if (!token || token === 'null') {
            message.error('Bạn cần đăng nhập lại để sử dụng tính năng này!');
            return;
        }
        try {
            // Lọc lại dữ liệu semesters nếu cần (giữ nguyên logic cũ)
            const rawData = htmlScoreData ? JSON.parse(htmlScoreData) : {};
            const rawSemesters = rawData.semesters || {};
            const cumulativePoint = rawData.cumulativePoint;
            const semesters: Record<string, any> = {};
            Object.entries(rawSemesters).forEach(([key, value]) => {
                if (value && Array.isArray((value as any).subjects)) {
                    semesters[key] = { subjects: (value as any).subjects };
                }
            });
            // Gửi cả cumulativePoint lên backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_BackendURL}/score/allScore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    semesters,
                    cumulativePoint,
                }),
            });
            if (res.ok) {
                message.success('Đã lưu điểm lên hệ thống!');
            } else {
                message.error('Lưu điểm lên hệ thống thất bại!');
            }
        } catch (e) {
            message.error('Lỗi khi lưu điểm lên hệ thống!');
        }
    };

    return (
        <>
            <Upload accept=".html,.htm" showUploadList={false} beforeUpload={beforeUpload}>
                <Button
                    icon={<UploadOutlined />}
                    loading={loading}
                    type="primary"
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Tải lên file HTML
                </Button>
            </Upload>

            {/* Modal xác nhận dữ liệu */}
            <Modal
                title="Xác nhận thông tin điểm"
                open={modalVisible}
                onCancel={handleCancelModal}
                width={1000}
                footer={[
                    <Button key="back" onClick={handleCancelModal}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={confirmLoading}
                        onClick={handleConfirmUpload}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Xác nhận và lưu điểm
                    </Button>,
                ]}
                maskClosable={false}
            >
                <p>Vui lòng kiểm tra và xác nhận thông tin điểm trước khi lưu:</p>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={Object.keys(parsedData).map((category) => ({
                        label: getTabTitle(category),
                        key: category,
                        children: (
                            <Table
                                columns={columns}
                                dataSource={Array.isArray(parsedData[category]) ? parsedData[category] : []}
                                pagination={false}
                                rowKey={(record, index) => `${category}-${record.code || ''}-${index}`}
                                size="small"
                                scroll={{ y: 400 }}
                            />
                        ),
                    }))}
                />
            </Modal>
        </>
    );
};

export default UploadHtmlButton;
