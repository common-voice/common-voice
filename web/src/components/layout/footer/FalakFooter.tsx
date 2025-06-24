import React from 'react'

export default function FalakFooter() {
  return (
    <div className="layout-footer px-4 md:px-6 lg:px-8 mt-5">
      <div className="footer-bg p-3 rounded-3xl mx-auto">
        <div className="flex justify-center items-center flex-wrap">
          <div className="flex justify-center items-center mt-2">
            <a href="https://ksaa.gov.sa">
              <img
                src={require('./img/logo-ksaa-light.png')}
                loading="lazy"
                role="presentation"
                className="w-[9rem] mt-3"
                alt="KSAA Logo"
              />
            </a>
            <img
              src={require('./img/logo-hcdp.png')}
              loading="lazy"
              role="presentation"
              className="mx-3 w-[7rem] -mb-1"
              alt="HCDP Logo"
            />
          </div>

          <div className="w-full lg:w-6/12 mt-0 ml-0 order-2 md:order-none">
            <div className="mt-4">
              <div className="text-center text-xs lg:pr-2 text-white font-bold">
                جميع الحقوق محفوظة لمجمع الملك سلمان العالمي للغة العربية ©
                2024.
                <a
                  href="https://falak.ksaa.gov.sa/privacy"
                  target="_blank"
                  className="text-white underline">
                  سياسة الاستخدام
                </a>
              </div>

              <div className="flex flex-col items-center justify-center mt-3">
                <ul className="social-links list-none flex justify-center mb-0 space-x-4">
                  <li>
                    <a href="https://www.youtube.com/@ksgafal" target="_blank">
                      <img
                        src={require('./img/youtube.png')}
                        loading="lazy"
                        role="presentation"
                        alt="YouTube"
                        className="hover:hidden"
                      />
                      <img
                        src={require('./img/youtube-green.png')}
                        loading="lazy"
                        role="presentation"
                        alt="YouTube Green"
                        className="hidden hover:block"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/ksgafal"
                      target="_blank">
                      <img
                        src={require('./img/linkedin.png')}
                        loading="lazy"
                        role="presentation"
                        alt="LinkedIn"
                        className="hover:hidden"
                      />
                      <img
                        src={require('./img/linkedin-green.png')}
                        loading="lazy"
                        role="presentation"
                        alt="LinkedIn Green"
                        className="hidden hover:block"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/KSGAFAL" target="_blank">
                      <img
                        src={require('./img/x.png')}
                        loading="lazy"
                        role="presentation"
                        alt="Twitter/X"
                        className="hover:hidden"
                      />
                      <img
                        src={require('./img/x-green.png')}
                        loading="lazy"
                        role="presentation"
                        alt="Twitter/X Green"
                        className="hidden hover:block"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/KSGAFAL/" target="_blank">
                      <img
                        src={require('./img/facebook.png')}
                        loading="lazy"
                        role="presentation"
                        alt="Facebook"
                        className="hover:hidden"
                      />
                      <img
                        src={require('./img/facebook-green.png')}
                        loading="lazy"
                        role="presentation"
                        alt="Facebook Green"
                        className="hidden hover:block"
                      />
                    </a>
                  </li>
                </ul>
                <div className="mt-6">
                  <a href="https://raqmi.dga.gov.sa/platforms/platforms/e1247e45-7b89-4990-2089-08dcb93d4ab0/platform-license">
                    <img
                      src={require('./img/falak-seal.png')}
                      loading="lazy"
                      role="presentation"
                      className="w-[220px] h-[80px]"
                      alt="Falak Seal"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[9rem] mt-4 lg:pr-0">
            <img
              src={require('./img/falak-logo-light.svg')}
              loading="lazy"
              role="presentation"
              className="w-[9rem] mt-3"
              alt="Falak Logo"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
