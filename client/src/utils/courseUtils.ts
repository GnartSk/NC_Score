export interface CourseSelection {
    course: string;
    major: string;
}

export const getCourseSelection = (): CourseSelection | null => {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem('userCourseSelection');
    if (!stored) return null;
    
    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error parsing course selection:', error);
        return null;
    }
};

export const setCourseSelection = (selection: CourseSelection): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('userCourseSelection', JSON.stringify(selection));
};

export const clearCourseSelection = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('userCourseSelection');
};

export const getCourseDisplayName = (courseId: string): string => {
    const courseMap: { [key: string]: string } = {
        'K17': 'K17 - Khóa 2022',
        'K18': 'K18 - Khóa 2023',
        'K19': 'K19 - Khóa 2024'
    };
    return courseMap[courseId] || courseId;
};

export const getMajorDisplayName = (majorId: string): string => {
    const majorMap: { [key: string]: string } = {
        'ATTT': 'An toàn thông tin',
        'MMT': 'Mạng máy tính & Truyền thông dữ liệu'
    };
    return majorMap[majorId] || majorId;
}; 