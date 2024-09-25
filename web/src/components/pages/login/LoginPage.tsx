import React from 'react'

export default function LoginPage() {
  return (
    <div className='w-screen h-screen flex justify-between flex-wrap'>
{/* Login Form */}
<div className='flex flex-col items-center p-4 flex-1 min-w-[480px]'>
    <div className="bg-white p-8 rounded-lg max-w-md w-full space-y-4">
    <img src="/img/falak-org-logo.svg" alt="falak-org-logo"  height={95} width={260} className='mb-[6rem]' />
        <h2 className="text-2xl  text-center text-[#0f2837] mb-4">
          مرحباً بك,<span className="text-[#00758A]"> في فلك</span>
        </h2>
        <p className="text-right text-[14px] text-gray-500 mb-8">
          سجل بياناتك لفتح حسابك في منصة فلك
        </p>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right"
            />
          </div>

          <div className="mb-4">
            <input
              type="tel"
              placeholder="رقم الهاتف"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right"
            />
          </div>

          <div className="mb-4">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right">
              <option value="">الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="الجنسية"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right"
            />
          </div>

          <div className="mb-4">
            <input
              type="number"
              placeholder="العمر"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center">
                {/* <img src="/img/remember-me-icon.svg" alt="" /> */}
            <input type="checkbox" className="checkbox mx-2 checkbox-accent rounded-full" />
            <span className="ml-2 text-sm text-gray-600">
                الموافقة على الشروط والأحكام
              </span>
            </label>
            <p className="text-center text-sm text-[#219F8A] mt-4">
            لديك حساب؟ 
          </p>
          </div>

          <button
          style={{borderRadius: '8px',}}
            type="submit"
            className="w-full  mt-8 bg-[#00758A] text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
          >
            إنشاء حساب
          </button>
        </form>
      </div>
</div>
{/* Login Image Section */}
<div className='w-full max-w-[712px] min-w-[480px] flex-1 hidden md:block'>
<img src="/img/bg-login.png" alt="bg-login" className='w-full h-full' />
</div>
    </div>
  )
}
