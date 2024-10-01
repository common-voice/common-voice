import React from 'react'

export default function FalakFooter() {
  return (
    <div className="layout-footer px-4 md:px-6 lg:px-8 mt-5">
    <div className="footer-bg p-3 rounded-3xl mx-auto">
      <div className="flex justify-center items-center flex-wrap">
        <div className="flex justify-center items-center mt-2">
          <a href="https://ksaa.gov.sa">
            <img src="/img/logo-ksaa-light.png" className="w-[9rem] mt-3" alt="KSAA Logo" />
          </a>
          <img src="/img/logo-hcdp.png" className="mx-3 w-[7rem] -mb-1" alt="HCDP Logo" />
        </div>
        
        <div className="w-full lg:w-6/12 mt-0 ml-0 order-2 md:order-none">
          <div className="mt-4">
            <div className="text-center text-xs lg:pr-2 text-white font-bold">
              جميع الحقوق محفوظة لمجمع الملك سلمان العالمي للغة العربية © 2024.
              <a href="javascript:;" className="text-white underline">سياسة الاستخدام</a> .
              <a href="javascript:;" className="text-white underline">الأسئلة الشائعة</a>
            </div>
            
            <div className="flex flex-col items-center justify-center mt-3">
              <ul className="social-links list-none flex justify-center mb-0 space-x-4">
                <li>
                  <a href="https://www.youtube.com/@ksgafal" target="_blank">
                    <img src="/img/social-media/youtube.png" alt="YouTube" className="hover:hidden" />
                    <img src="/img/social-media/youtube-green.png" alt="YouTube Green" className="hidden hover:block" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/ksgafal" target="_blank">
                    <img src="/img/social-media/linkedin.png" alt="LinkedIn" className="hover:hidden" />
                    <img src="/img/social-media/linkedin-green.png" alt="LinkedIn Green" className="hidden hover:block" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/KSGAFAL" target="_blank">
                    <img src="/img/social-media/x.png" alt="Twitter/X" className="hover:hidden" />
                    <img src="/img/social-media/x-green.png" alt="Twitter/X Green" className="hidden hover:block" />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/KSGAFAL/" target="_blank">
                    <img src="/img/social-media/facebook.png" alt="Facebook" className="hover:hidden" />
                    <img src="/img/social-media/facebook-green.png" alt="Facebook Green" className="hidden hover:block" />
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <a href="https://raqmi.dga.gov.sa/platforms/platforms/e1247e45-7b89-4990-2089-08dcb93d4ab0/platform-license">
                  <img src="/img/falak-seal.png" className="w-[220px] h-[80px]" alt="Falak Seal" />
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <div className="w-full max-w-[9rem] mt-4 lg:pr-0">
          <img src="/img/falak-logo-light.svg" className="w-[9rem] mt-3" alt="Falak Logo" />
        </div>
      </div>
    </div>
  </div>
  
  )
}
