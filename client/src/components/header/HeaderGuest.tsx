'use client';

import { useRouter } from 'next/navigation';

const HeaderGuest = () => {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <div className="h-[60px] w-full fixed z-10 flex justify-center bg-white shadow-md transition-colors duration-300 ease-in-out">
            <div className="h-full w-full flex items-center px-[var(--default-layout-horizontal-spacer)] md:px-[15px]">
                <div className="flex items-center" onClick={handleLogoClick}>
                    <img
                        className="flex items-center object-contain h-[60px] w-[60px] ml-[90px] hover:cursor-pointer hover:scale-105 transition-transform duration-200 md:h-[60px] md:w-[60px] md:ml-[15px]"
                        alt="VertexOps"
                        src="https://upload.wikimedia.org/wikipedia/commons/3/38/Logo_UIT_updated.jpg"
                    />
                </div>
                <h1 className="flex items-center text-[#0a0a0a] text-[3rem] font-semibold ml-[15px] whitespace-nowrap hover:cursor-pointer">
                    NC Score
                </h1>
            </div>

            <div className="flex m-[5px] md:mr-[15px]">
                <button
                    className="flex items-center justify-center px-6 py-2 text-white text-xl font-bold bg-[#727996] rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#3e4562] hover:-translate-y-0.5 hover:shadow-lg active:bg-[#727996] active:translate-y-0 whitespace-nowrap min-w-[100px]"
                    onClick={handleLoginClick}
                >
                    <h1>Log in</h1>
                </button>
            </div>
        </div>
    );
};

export default HeaderGuest;
