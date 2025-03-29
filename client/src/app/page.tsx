'use client';
import { motion } from 'framer-motion';
import { FaYoutube, FaGithub } from 'react-icons/fa';
import LoginButton from '@/components/button/LoginButton';

export default function Home() {
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
                <LoginButton />
            </header>

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
