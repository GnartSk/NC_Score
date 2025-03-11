'use client'
import React from 'react'
import { FaRegEyeSlash } from 'react-icons/fa6'

const Login = () => {
  return (
    <div className='flex bg-[#F0F7FF] flex-col items-center justify-center  flex-1 px-20 text-center'>
        <main className='flex  flex-col items-center w-full flex-1 px-20 text-center  mt-9'>
            <div className='rounded-2xl shadow-2xl h-[500px] flex max-w-3xl '>
                <div className='md:w-4/5 p-6'>
                    <div className=' py-8'>
                        <img className='px-24 ' src="/LogoUIT.svg" alt="logoUIT" />

                        <h2 className='text-3xl mt-2 font-bold text-black mb-2'>Đăng nhập</h2>

                    </div>
                    <div>
                        <form className='flex flex-col gap-2'>
                            <div>
                                <input className='p-2 rounded-xl border' type="email" name="email" placeholder='Email' />
                            </div>
                            <div className='relative'>
                                <input className='p-2 mt-2 rounded-xl border' type="password" name="password" placeholder='Mật khẩu' />
                                <FaRegEyeSlash className='absolute fill-gray-400 top-7 right-3 -translate-y-1/2 inline-block w-5 h-5 mr-8 ' />
                            </div>
                            <div className='text-sm mr-10'>
                                <p ><input type="checkbox" />Nhớ tài khoản của tôi</p>

                            </div>
                            <button> <a href='#' className='bg-[#0077FF] hover:scale-110 mt-6 rounded-lg text-white px-4 py-1 inline-block font-semibold hover:bg-[#2e7bd9] hover:text-white'>Đăng nhập</a></button>
                            <p className='text-sm mt-4'><a href='#'>Quên mật khẩu?</a></p>
                        </form>
                    </div>

                </div>

                <div className='w-4/7 bg-[#71ACF2] md:block hidden justify-center items-center rounded-md max-w-3xl relative'>
                    <h2 className='text-3xl absolute ml-6 mt-9 text-white font-bold mb-2'>Chào mừng bạn quay trở lại!</h2>
                    <img className='w-full  ' src="/BackgroundLogin.svg" alt="#" />
                    <div className='absolute bottom-0 left-0'>

                    </div>
                </div>
            </div>
            <div>

            </div>
        </main>
    </div>
    
)
}

export default Login