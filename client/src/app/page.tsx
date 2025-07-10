'use client';
import { motion } from 'framer-motion';
import { FaYoutube, FaGithub } from 'react-icons/fa';
import LoginButton from '@/components/button/LoginButton';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    console.log('NEXT_PUBLIC_BackendURL hihi = ', process.env.NEXT_PUBLIC_BackendURL);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-pink-100 via-40% to-fuchsia-100 text-blue-900">
            {/* Header */}
            <header
                className="w-full px-8 py-4 flex justify-between items-center 
                   bg-gradient-to-r from-blue-100 via-pink-100 to-fuchsia-100 
                   shadow-lg backdrop-blur-lg border-b border-pink-100 fixed top-0 left-0 z-50"
            >
                <div className="flex items-center">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 64 }}>
                        <Image src="/LogoUIT.svg" alt="Logo UIT" width={200} height={32} priority />
                    </div>
                </div>
                <LoginButton />
            </header>

            {/* Hero Section */}
            <main className="flex flex-col items-center text-center px-6 mt-40">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl font-montserrat font-bold leading-tight text-blue-900"
                >
                    Giải pháp quản lý điểm thông minh <br /> với <span className="text-fuchsia-500">NC Score</span>
                </motion.h2>
                <p className="mt-4 text-lg opacity-90 max-w-2xl text-pink-700">
                    NC Score giúp bạn quản lý học phần nhanh chóng, chính xác và dễ dàng. Tích hợp AI giúp hỗ trợ quá
                    trình định hướng nghề nghiệp!
                </p>
                <motion.a
                    whileHover={{ scale: 1.1 }}
                    className="mt-6 px-6 py-3 bg-fuchsia-500 text-white font-semibold rounded-full shadow-md transition-transform duration-300 hover:bg-fuchsia-600"
                    href="#"
                >
                    Dùng thử miễn phí
                </motion.a>
            </main>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* Feature Card 1 */}
                <div className="relative flex flex-col items-center group p-6 bg-white bg-opacity-20 rounded-lg shadow-md hover:scale-105 transition-transform">
                    {/* Bubble particles */}
                    <span className="absolute top-4 left-12 w-3 h-3 bg-pink-200 rounded-full animate-bubble1 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                    <span className="absolute bottom-6 right-10 w-2 h-2 bg-pink-300 rounded-full animate-bubble2 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                    <h3 className="text-xl font-semibold">⚡ Nhanh chóng</h3>
                    <p className="mt-2 text-gray-700">Xử lý dữ liệu và chấm điểm chỉ trong vài giây.</p>
                </div>
                {/* Feature Card 2 */}
                <div className="relative flex flex-col items-center group p-6 bg-white bg-opacity-20 rounded-lg shadow-md hover:scale-105 transition-transform">
                    <span className="absolute top-6 right-14 w-2.5 h-2.5 bg-yellow-200 rounded-full animate-bubble2 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                    <span className="absolute bottom-8 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-bubble1 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                    <h3 className="text-xl font-semibold">🧠 AI Thông minh</h3>
                    <p className="mt-2 text-gray-700">Hỗ trợ định hướng nghề nghiệp với công nghệ AI tiên tiến.</p>
                </div>
                {/* Feature Card 3 */}
                <div className="relative flex flex-col items-center group p-6 bg-white bg-opacity-20 rounded-lg shadow-md hover:scale-105 transition-transform">
                    <span className="absolute top-8 left-16 w-2 h-2 bg-blue-200 rounded-full animate-bubble1 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                    <span className="absolute bottom-4 right-12 w-3 h-3 bg-blue-300 rounded-full animate-bubble2 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
                    <h3 className="text-xl font-semibold">🔒 Bảo mật cao</h3>
                    <p className="mt-2 text-gray-700">Dữ liệu của bạn được mã hóa và bảo vệ an toàn.</p>
                </div>
            </section>
            {/* Testimonials Section */}
            <section className="bg-gradient-to-r from-pink-100 via-blue-50 to-fuchsia-100 py-20 px-6 text-center">
                <h2 className="text-3xl font-bold text-fuchsia-700">Chúng tôi muốn gì khi tạo ra NC Score?</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <p className="italic text-gray-700">
                            "NC Score sẽ giúp các sinh viên biết sắp xếp học phần cho bản thân!"
                        </p>
                        <span className="block mt-4 font-semibold text-fuchsia-700">- Lê Hoàng Vũ</span>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <p className="italic text-gray-700">"NC Score sẽ giúp bản thân quản lý điểm dễ hơn!"</p>
                        <span className="block mt-4 font-semibold text-fuchsia-700">- Le Trang</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-blue-300 via-fuchsia-500 to-blue-400 text-white py-12 mt-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 text-center">
                    <div>
                        <h3 className="text-lg font-semibold text-fuchsia-600">Về NC Score</h3>
                        <p className="mt-2 text-sm">
                            NC Score là nền tảng chấm điểm thông minh, giúp bạn tối ưu hóa quy trình đánh giá.
                        </p>
                    </div>
                    <div className="items-center justify-items-center text-center">
                        <h3 className="text-lg font-semibold text-fuchsia-200">Liên kết nhanh</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-fuchsia-600">
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-fuchsia-600">
                                    Tính năng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-fuchsia-600">
                                    Hỗ trợ
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-fuchsia-400">Theo dõi chúng tôi</h3>
                        <div className="mt-2 flex space-x-4 justify-center">
                            <FaYoutube
                                className="hover:text-red-400 cursor-pointer"
                                size={20}
                                onClick={() => window.open('https://www.youtube.com/watch?v=teapGYxT0jk/', '_blank')}
                            />
                            <FaGithub
                                className="hover:text-fuchsia-400 cursor-pointer"
                                size={20}
                                onClick={() => window.open('https://github.com/kOpHAIvU', '_blank')}
                                title="https://github.com/kOpHAIvU"
                            />
                            <FaGithub
                                className="hover:text-fuchsia-400 cursor-pointer"
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
