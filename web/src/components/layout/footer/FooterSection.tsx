import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#0f2837] text-white pt-20  h-auto">
      <div className="max-w-7xl mx-auto px-4 flex gap-8 mt-10 justify-items-center justify-between flex-wrap">
        <div>
          <h4 className="text-lg  py-4 mb-4 border-b border-white w-[120px] ">نظرة عامة</h4>{' '}
          <ul className="space-y-[20px] my-8">
            <li>
              <a href="#" className="hover:underline">
                الرئيسة
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                من نحن؟
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                شروط الاستخدام
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                المزايا
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                اتصل بنا
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg py-4 mb-4 border-b border-white w-[120px]">الأدوات</h4>
          <ul className="space-y-[20px] my-8">
            <li>
              <a href="#" className="hover:underline">
                المدونات
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                قوائم الشيوع
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
              الجدارية الصوتية 
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                أضف مدونة
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg py-4  mb-4 border-b border-white w-[120px]">روابط مهمة</h4>
          <ul className="space-y-[20px] my-8">
            <li>
            <a href="#" className="hover:underline">
                مجمع الملك سلمان العالمي للغة العربية
              </a>
              <img src="/img/social-media/link-square-rounded.svg" alt="link-squar" className='inline mx-3' />

            </li>
            <li>
              <a href="#" className="hover:underline">
                منصة سواد للمعاجم اللغوية
              </a>
              <img src="/img/social-media/link-square-rounded.svg" alt="link-squar" className='inline mx-3' />

            </li>
            <li>
              <a href="#" className="hover:underline">
                مجمع الرياض للغة العربية المعاصرة
              </a>
              <img src="/img/social-media/link-square-rounded.svg" alt="link-squar" className='inline mx-3' />

            </li>
            <li>
              <a href="#" className="hover:underline">
                معجم الرياض
              </a>
              <img src="/img/social-media/link-square-rounded.svg" alt="link-squar" className='inline mx-3' />

            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start">
          <h4 className="text-lg py-4  mb-4 border-b border-white w-[120px]">تواصل معنا</h4>
          <ul className="list-none flex justify-between gap-3 pl-4 my-8">
            <li>
            <a href="https://www.facebook.com/KSGAFAL/" target="_blank">
            <img src="/img/social-media/facebook.svg" alt="facebook" />
              </a>
            </li>
            <li>
            <a href="https://www.youtube.com/@ksgafal" target="_blank">
            <img src="/img/social-media/youtube.svg" alt="youtube" />
              </a>
            </li>
            <li>
            <a href="https://www.linkedin.com/company/ksgafal" target="_blank">
            <img src="/img/social-media/linkedin.svg" alt="linkedin" />
              </a>
            </li>
            <li>
            <a href="https://twitter.com/KSGAFAL" target="_blank">
            <img src="/img/social-media/new-twitter.svg" alt="twitter" />
              </a>
            </li>
          </ul>
          <p className="text-lg">info@ksaa.gov.sa</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-10 border-t  border-white pt-6 flex justify-center md:justify-between items-center flex-wrap gap-8 ">
       <div className='flex justify-center md:justify-between gap-8 flex-wrap'>
       <div className="w-[260px] h-16">
          <img
            src="/img/falak-logo-light.svg"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-[260px] h-16">
              <a href="https://raqmi.dga.gov.sa/platforms/platforms/8713ef38-bc90-47a2-a34d-69f56873eccc/platform-license">
                <img src="/img/falak-seal.png" alt="falak-seal" className='w-full h-[73px]' />
              </a>
            </div>
       </div>
        
        <div className='flex justify-between gap-8'>
            <img
              src="/img/logo-ksaa-light.png"
              alt="logo-ksaa"
              className="w-full h-[53px] object-contain"
            />
            <img
              src="/img/logo-hcdp.png"
              className="w-full h-[53px] object-contain"
              alt="hcdp-logo"
            />  
        </div>
      </div>
      {/* حقوق النشر © 2024 */}
      <div className="px-4 mt-8 py-2 bg-[#027589] flex flex-col md:flex-row justify-center items-center text-sm ">
        <p className='mx-auto dir-right'>© 2024 مجمع الملك سلمان العالمي للغة العربية. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  )
}
