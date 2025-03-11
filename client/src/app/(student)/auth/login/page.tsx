import { Button } from 'antd'
import React from 'react'
import { FaRegEyeSlash } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'

const LoginPage = () => {
  return (
    <div className='flex bg-[#F0F7FF] flex-col items-center justify-center flex-1 h-screen px-20 text-center'>
      <main className='flex flex-col items-center w-screen flex-1 px-20 text-center mt-9 min-w-[764px]'>
        <div className='rounded-2xl shadow-2xl h-[520px] flex max-w-3xl '>
          <div className='md:w-4/5 p-6'>
            <div className='py-8'>
              <img className='px-24' src="/LogoUIT.svg" alt="logoUIT" />
              <h2 className='text-2xl mt-2 font-bold text-black mb-2'>Đăng nhập</h2>
            </div>
            <div>
              <form className='flex flex-col gap-2'>
                <div>
                  <input className='p-2 rounded-xl border w-full text-left' type="email" name="email" placeholder='Email' />
                </div>
                <div className='relative'>
                  <input className='p-2 mt-2 rounded-xl border w-full text-left' type="password" name="password" placeholder='Mật khẩu' />
                  <FaRegEyeSlash className='absolute fill-gray-400 top-7 right-3 -translate-y-1/2 inline-block w-5 h-5 mr-3' />
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="rememberPassword" id="rememberPassword" />
                    <span>Nhớ tài khoản của tôi</span>
                  </label>
                  <a href="#" className="text-blue-500 hover:underline">Quên mật khẩu?</a>
                </div>
                <button>
                  <a href='#' className='bg-[#0077FF] hover:scale-110 mt-4 rounded-lg text-white px-4 py-1 inline-block font-semibold hover:bg-[#2e7bd9] hover:text-white'>Đăng nhập</a>
                </button>
                <div className='mx-2 my-2 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
                or
                </div>
                <button className="flex items-center justify-center w-full max-w-xs border border-gray-300 rounded-lg shadow-md py-2 px-4 bg-white hover:bg-gray-100 transition-all duration-300 mt-1">
                  <FcGoogle className="text-2xl mr-2" />
                  <span className="text-black font-medium">Login via Google</span>
                </button>
              </form>
            </div>
          </div>

          <div className=' bg-[#71ACF2] md:block hidden justify-center items-center rounded-md max-w-3xl relative'>
            <h2 className='text-3xl absolute ml-4 mt-9 text-white font-bold mb-2'>Chào mừng bạn quay trở lại!</h2>
            <img className='object-cover' src="/BackgroundLogin.svg" alt="#" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage