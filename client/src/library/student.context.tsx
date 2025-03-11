'use client'

import { createContext, useContext, useState } from "react";

interface IStudentContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
}

export const StudentContext = createContext<IStudentContext | null>(null);

export const StudentContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);

    return (
        <StudentContext.Provider value={{ collapseMenu, setCollapseMenu }}>
            {children}
        </StudentContext.Provider>
    )
};

export const useStudentContext = () => useContext(StudentContext);