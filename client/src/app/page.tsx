'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaYoutube, FaGithub } from 'react-icons/fa';
import LoginButton from '@/components/button/LoginButton';
import { useTransition } from 'react';

export default function Home() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const toLogin = () => {
        startTransition(() => {
            router.push('/auth/login');
        });
    };

    // return (
    //     <div className="bg-gray-100 min-h-screen">
    //         {/* Header */}
    //         <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
    //             <div className="flex hover:cursor-pointer transform-gpu transition-transform duration-500 ease-in-out hover:scale-105">
    //                 <img
    //                     className="flex items-center object-contain h-[32px] w-[32px] mr-[5px] transition-transform duration-500 ease-in-out"
    //                     alt="VertexOps"
    //                     src="https://upload.wikimedia.org/wikipedia/commons/3/38/Logo_UIT_updated.jpg"
    //                 />
    //                 <h1 className="text-2xl font-bold text-indigo-600 transition-transform duration-500 ease-in-out">
    //                     NCScore
    //                 </h1>
    //             </div>

    //             <nav className="hidden md:flex space-x-6">
    //                 <a href="#features" className="text-gray-700 hover:text-indigo-600">
    //                     Features
    //                 </a>
    //                 <a href="#pricing" className="text-gray-700 hover:text-indigo-600">
    //                     Pricing
    //                 </a>
    //                 <a href="#contact" className="text-gray-700 hover:text-indigo-600">
    //                     Contact
    //                 </a>
    //             </nav>
    //             <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">Get Started</button>
    //         </header>

    //         {/* Hero Section */}
    //         <section className="text-center py-20 bg-indigo-50">
    //             <h2 className="text-4xl font-bold text-gray-800">Build Your Next Project with Us</h2>
    //             <p className="text-gray-600 mt-4 text-lg">Simple, powerful and fast solutions for your business.</p>
    //             <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md">Start Now</button>
    //         </section>

    //         {/* Features Section */}
    //         <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
    //             <h3 className="text-3xl font-bold text-center text-gray-800">Our Features</h3>
    //             <div className="grid md:grid-cols-3 gap-8 mt-10">
    //                 <div className="p-6 bg-white shadow-md rounded-lg text-center">
    //                     <h4 className="text-xl font-semibold text-indigo-600">Feature 1</h4>
    //                     <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet.</p>
    //                 </div>
    //                 <div className="p-6 bg-white shadow-md rounded-lg text-center">
    //                     <h4 className="text-xl font-semibold text-indigo-600">Feature 2</h4>
    //                     <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet.</p>
    //                 </div>
    //                 <div className="p-6 bg-white shadow-md rounded-lg text-center">
    //                     <h4 className="text-xl font-semibold text-indigo-600">Feature 3</h4>
    //                     <p className="text-gray-600 mt-2">Lorem ipsum dolor sit amet.</p>
    //                 </div>
    //             </div>
    //         </section>

    //         {/* Footer */}
    //         <footer className="bg-gray-900 text-white text-center py-6 mt-10">
    //             <p>&copy; 2025 MyBrand. All rights reserved.</p>
    //         </footer>
    //     </div>
    // );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#5c70b3] via-[#244DDA] to-white text-white">
            {/* Header */}
            <header
                className="w-full px-8 py-4 flex justify-between items-center 
                   bg-gradient-to-r from-[#657ada] to-[#a7c4e9] 
                   shadow-lg backdrop-blur-lg border-b border-white/10 fixed top-0 left-0 z-50"
            >
                <div className="flex items-center">
                    <img
                        className="h-12 w-12 mr-3 transition-transform duration-300 hover:scale-110"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Logo_UIT_updated.svg/330px-Logo_UIT_updated.svg.png"
                        alt="NC Score"
                    />
                    <h1 className="text-3xl font-bold text-white font-montserrat tracking-wide drop-shadow-lg">
                        NC Score
                    </h1>
                </div>
                <LoginButton toLogin={toLogin} />
            </header>

            <img className="absolute h-[250px] w-[200px] top-[150px] left-12" src="/9c486b17fa4b4a15135a.jpg" />

            <img
                className="absolute h-[250px] w-[200px] top-[150px] right-12 scale-x-[-1]"
                src="/9c486b17fa4b4a15135a.jpg"
            />

            {/* Hero Section */}
            <main className="flex flex-col items-center text-center px-6 mt-40">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl font-montserrat font-bold leading-tight"
                >
                    Giải pháp quản lý điểm thông minh <br /> với <span className="text-indigo-300">NC Score</span>
                </motion.h2>
                <p className="mt-4 text-lg opacity-90 max-w-2xl">
                    NC Score giúp bạn quản lý học phần nhanh chóng, chính xác và dễ dàng. Tích hợp AI giúp hỗ trợ quá
                    trình định hướng nghề nghiệp!
                </p>
                <motion.a
                    whileHover={{ scale: 1.1 }}
                    className="mt-6 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md transition-transform duration-300"
                    href="#"
                >
                    Dùng thử miễn phí
                </motion.a>
            </main>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md hover:scale-105 transition-transform">
                    <h3 className="text-xl font-semibold">⚡ Nhanh chóng</h3>
                    <p className="mt-2 text-gray-200">Xử lý dữ liệu và chấm điểm chỉ trong vài giây.</p>
                </div>
                <div className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md hover:scale-105 transition-transform">
                    <h3 className="text-xl font-semibold">🧠 AI Thông minh</h3>
                    <p className="mt-2 text-gray-200">Hỗ trợ định hướng nghề nghiệp với công nghệ AI tiên tiến.</p>
                </div>
                <div className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md hover:scale-105 transition-transform">
                    <h3 className="text-xl font-semibold">🔒 Bảo mật cao</h3>
                    <p className="mt-2 text-gray-200">Dữ liệu của bạn được mã hóa và bảo vệ an toàn.</p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-white bg-opacity-10 py-20 px-6 text-center">
                <h2 className="text-3xl font-bold">Chúng tôi muốn gì khi tạo ra NC Score?</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md">
                        <p className="italic">"NC Score sẽ giúp các sinh viên biết sắp xếp học phần cho bản thân!"</p>
                        <span className="block mt-4 font-semibold">- Lê Hoàng Vũ</span>
                    </div>
                    <div className="p-6 bg-white bg-opacity-20 rounded-lg shadow-md">
                        <p className="italic">"NC Score sẽ giúp bản thân quản lý điểm dễ hơn!"</p>
                        <span className="block mt-4 font-semibold">- Le Trang</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 text-center">
                    <div>
                        <h3 className="text-lg font-semibold">Về NC Score</h3>
                        <p className="mt-2 text-sm">
                            NC Score là nền tảng chấm điểm thông minh, giúp bạn tối ưu hóa quy trình đánh giá.
                        </p>
                    </div>
                    <div className="items-center justify-items-center text-center">
                        <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white">
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Tính năng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">
                                    Hỗ trợ
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Theo dõi chúng tôi</h3>
                        <div className="mt-2 flex space-x-4 justify-center">
                            <FaYoutube
                                className="hover:text-white cursor-pointer"
                                size={20}
                                onClick={() => window.open('https://www.youtube.com/watch?v=teapGYxT0jk/', '_blank')}
                            />
                            <FaGithub
                                className="hover:text-white cursor-pointer"
                                size={20}
                                onClick={() => window.open('https://github.com/kOpHAIvU', '_blank')}
                                title="https://github.com/kOpHAIvU"
                            />
                            <FaGithub
                                className="hover:text-white cursor-pointer"
                                size={20}
                                onClick={() => window.open('https://github.com/GnartSk', '_blank')}
                                title="https://github.com/GnartSk"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-center mt-8 text-sm opacity-75">© 2025 NC Score. All rights reserved.</p>
            </footer>
        </div>
    );
}
