import React from 'react'
// import micBanner from './images/mic-banner.png'
import classes from './home.module.css'
import { LinkButton } from '../../ui/ui'
import URLS from '../../../urls'
import { LocaleLink } from '../../locale-helpers'

export default function HomePageSection() {
  return (
    <div className=" flex flex-col items-center mt-10 pt-10">
      {/* mic-banner */}
      <div
        className="rounded-[24px]  bg-no-repeat bg-center w-[100%] max-w-[1160px] bg-cover md:bg-contain min-h-[300px] h-full flex justify-start items-center "
        style={{
          backgroundImage: `url('/img/mic-banner.png')`,
        }}>
        <div className="flex flex-col justify-between gap-5 items-start p-8 m-10 text-white text-right">
          <h1 className=" text-[30px] md:text-[30px] lg:text-[50px] text-center font-bold">
            الجداريــة الصوتيـة
          </h1>
          <p className="text-[16px] md:text-[20px] text-right">
            مشروع يمكن الجميع من المساهمة الصوتية في{' '}
            <div className="hidden md:block mt-1" />
            المعالجة الآلية للغة العربية
          </p>
          <div className="self-center">
            <img
              src="/img/link-forward-rounded.svg"
              alt="link-forward"
              height={20}
              width={15}
            />
            <span className="mt-4">
              <a href="#faq-list"> المزيد</a>
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-8 mx-auto py-10 flex-wrap">
        {/* ساهم بصوتك */}
        <div
          className={`max-w-[572px] w-[372px] md:w-[472px] lg:w-[572px] h-[986px] ${classes.card}`}
          style={{
            background:
              'transparent linear-gradient(180deg, #EFF3F6 0%, #FFFFFF00 100%) 0% 0% no-repeat padding-box',
            border: '1px solid #B1B1B157',
            borderRadius: '50px',
            padding: '30px',
          }}>
          <h1 className="text-[30px] lg:text-[50px] text-center font-bold">
            ساهم بصوتك
          </h1>
          <p className="text-right py-4 text-[14px] md:text-[16px]w-[240px] md:w-[440px] mx-auto leading-6 text-wrap">
            اقرأ وعبر بمناسبة اليوم العالمي للغة العربية سجل صوتك واستمع إليه،
            جرب صوتك بالفصحى، دربه على النطق بلغة سليمة، عبر وشارك معنا بما يخدم
            العربية
          </p>

          <div className="flex justify-center md:justify-start items-center pt-16 md:pr-8 gap-8 flex-wrap">
            <div className="flex flex-col justify-center text-[12px] w-[110px]">
              <p className="text-[#219F8A]">مستوى التقدم اليوم</p>
              <p> +9</p>
              <p>مقاطع مسجلة</p>
            </div>

            <div className="flex flex-col justify-center items-center	w-[210px]">
              <LocaleLink to={URLS.SPEAK}>
                <div>
                  <img
                    src="/img/mic-icon.svg"
                    alt="mic-icon"
                    className={` ${classes['clickable-icon']} w-[110px] h-[110px] cursor-pointer mx-auto`}
                  />
                  <h1 className="text-center my-2">أسمعنا صوتك</h1>
                </div>
              </LocaleLink>
            </div>
          </div>
          <img
            src="/img/phone-speak.svg"
            alt="phone-speak"
            className="w-[100%] mt-[100px]"
          />
        </div>

        {/*  الجدارية الصوتية */}
        <div
          className={`max-w-[572px] w-[372px] md:w-[472px] lg:w-[572px] h-[986px] ${classes.card}`}
          style={{
            background: '#219F8A 0% 0% no-repeat padding-box',
            border: '1px solid #B1B1B157',
            borderRadius: '50px',
            padding: '30px',
            color: 'white',
          }}>
          <h1 className="text-[30px] lg:text-[50px]  text-center font-bold">
            {' '}
            الجدارية الصوتية
          </h1>
          <p className="text-right py-4 text-[14px] md:text-[16px] w-[240px] md:w-[440px] mx-auto leading-6 text-wrap">
            شنف سمعك بمشاركات الآخرين يُعتبر التحقق من المقاطع المسجّلة أمرًا
            مهمًا يوازي إرسالها بالنسبة إلى مهمّة مشروع «الصوت للعموم» جرّب
            العملية وساعِدنا بإنشاء بيانات صوتية مفتوحة المصدر وعالية الجودة
          </p>

          <div className="flex justify-center md:justify-start items-center pt-16 md:pr-8 gap-8 flex-wrap">
            <div className="flex flex-col justify-center text-[12px] w-[110px]">
              <p>مستوى التقدم اليوم</p>
              <p> +9</p>
              <p> مقاطع مدقّقة</p>
            </div>

            <div className="flex flex-col justify-center items-center w-[210px]">
              <LocaleLink to={URLS.LISTEN}>
                <div>
                  <img
                    src="/img/play-icon.svg"
                    alt="mic-icon"
                    className={` ${classes['clickable-icon']} w-[110px] h-[110px] cursor-pointer mx-auto`}
                  />
                  <h1 className="text-center my-2">أسمعنا صوتك</h1>
                </div>
              </LocaleLink>
            </div>
          </div>
          <img
            src="/img/phone-listen.svg"
            alt="phone-speak"
            className="w-[100%] mt-[115px]"
          />
        </div>
      </div>
    </div>
  )
}
