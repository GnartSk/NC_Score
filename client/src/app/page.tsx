'use client';
import HeaderGuest from '@/components/header/HeaderGuest';
import styles from './Home.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter(); // Khởi tạo useNavigate

    const handleSignupClick = () => {
        router.push('/signup'); // Điều hướng đến trang login
    };

    const handleLearnMoreClick = () => {};

    return (
        <div className={`flex flex-col min-h-screen ${styles.montserrat}`}>
            <HeaderGuest />
            <div className="relative min-h-screen p-5 mt-[70px] flex justify-center bg-[#647FEA] shadow-md overflow-hidden">
                <div className="mt-[60px] flex flex-col text-white items-center justify-between pb-5 max-w-[1600px] w-[86%] h-auto gap-5 md:flex-row">
                    <div className="mr-[30px] pb-[10rem] flex-1 w-full mb-5 md:w-auto md:mb-0">
                        <div>
                            <h2 className="text-[2rem] mb-[15px] font-semibold md:text-[3rem] text-white">
                                The distance will not be a problem if we care enough for each other.
                            </h2>
                            <p className="mb-7 font-normal text-white md:text-[1.8rem]">
                                That's why VertexOps was created — to help you excel at learning from home. If you're
                                struggling with self-study, you've come to the right place.
                            </p>
                        </div>

                        <div className="flex flex-col gap-[10px] md:flex-row md:gap-[20px]">
                            <button
                                className="flex items-center justify-center px-5 py-2 text-[1.2rem] md:text-[2.4rem] text-white rounded-lg transition-all duration-300 ease-in-out shadow-md shadow-black/10 bg-[#EB6581] hover:bg-[#d25260] hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 active:bg-[#d25260] active:translate-y-0"
                                onClick={handleLearnMoreClick}
                            >
                                Lean more
                            </button>
                            <button
                                className="flex items-center justify-center px-5 py-2 text-[1.2rem] md:text-[2.4rem] text-white rounded-lg transition-all duration-300 ease-in-out shadow-md shadow-black/10 font-bold bg-transparent border-2 border-white hover:bg-white hover:text-[#647FEA] hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/15 active:bg-[#d2969d] active:translate-y-0"
                                onClick={handleSignupClick}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full mb-5 md:w-auto md:mb-0 max-w-full mr-12 md:mr-0">
                        <div className="block h-auto max-w-full">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/38/Logo_UIT_updated.jpg"
                                alt="Description 1"
                                className="ml-[300px] w-[250px] h-auto mb-[50px] md:ml-[280px] md:w-[240px]"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/38/Logo_UIT_updated.jpg"
                                alt="Description 2"
                                className="mt-[-120px] w-[250px] h-auto md:mt-[-110px] md:w-[240px]"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/38/Logo_UIT_updated.jpg"
                                alt="Description 3"
                                className="mt-[-70px] ml-[280px] w-[240px] h-auto md:mt-[-60px] md:ml-[270px] md:w-[230px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
