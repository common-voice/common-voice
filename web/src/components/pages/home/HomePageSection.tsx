import React from 'react'
// import micBanner from './images/mic-banner.png'
import classes from './home.module.css'
import { LinkButton } from '../../ui/ui'
import URLS from '../../../urls'
import { LocaleLink } from '../../locale-helpers';

export default function HomePageSection() {
  return (
    <div className="px-20 mt-10 pt-10">
      {/* mic-banner */}
      <div
        className="mx-auto bg-no-repeat bg-center w-[100%] max-w-[1160px] h-[300px] flex justify-start items-center "
        style={{
          backgroundImage: `url('/img/mic-banner.png')`,
          backgroundSize: 'contain',
        }}>
        <div className="flex flex-col justify-between gap-5 items-start p-4 text-white text-right">
          <h1 className="text-[50px] text-center font-bold">
            الجداريــة الصوتيـة
          </h1>
          <p className="text-[18px]">
            مشروع يمكن الجميع من المساهمة الصوتية في المعالجة الآلية للغة
            العربية
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-8 mx-auto py-10">
        {/* ساهم بصوتك */}
        <div
          className={classes.card}
          style={{
            maxWidth: '572px',
            height: '986px',
            background:
              'transparent linear-gradient(180deg, #EFF3F6 0%, #FFFFFF00 100%) 0% 0% no-repeat padding-box',
            border: '1px solid #B1B1B157',
            borderRadius: '50px',
            padding: '30px',
          }}>
          <h1 className="text-[50px] text-center font-bold">ساهم بصوتك</h1>
          <p className="text-right text-[14px] w-[440px] mx-auto leading-6">
            اقرأ وعبر بمناسبة اليوم العالمي للغة العربية سجل صوتك واستمع إليه،
            جرب صوتك بالفصحى، دربه على النطق بلغة سليمة، عبر وشارك معنا بما يخدم
            العربية
          </p>

          <div className="flex justify-start items-center pt-16 pr-14 gap-8">
            <div className="flex flex-col justify-center text-[12px]">
              <p className="text-[#219F8A]">مستوى التقدم اليوم</p>
              <p> +9</p>
              <p>مقاطع مسجلة</p>
            </div>

            <div className="flex flex-col justify-center items-center	 ">
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
          className={classes.card}
          style={{
            maxWidth: '572px',
            height: '986px',
            background: '#219F8A 0% 0% no-repeat padding-box',
            border: '1px solid #B1B1B157',
            borderRadius: '50px',
            padding: '30px',
            color: 'white',
          }}>
          <h1 className="text-[50px] text-center font-bold">
            {' '}
            الجدارية الصوتية
          </h1>
          <p className="text-right text-[14px] w-[440px] mx-auto leading-6">
            شنف سمعك بمشاركات الآخرين يُعتبر التحقق من المقاطع المسجّلة أمرًا
            مهمًا يوازي إرسالها بالنسبة إلى مهمّة مشروع «الصوت للعموم» جرّب
            العملية وساعِدنا بإنشاء بيانات صوتية مفتوحة المصدر وعالية الجودة
          </p>

          <div className="flex justify-start items-center pt-16 pr-14 gap-8">
            <div className="flex flex-col justify-center text-[12px]">
              <p>مستوى التقدم اليوم</p>
              <p> +9</p>
              <p> مقاطع مدقّقة</p>
            </div>

            <div className="flex flex-col justify-center items-center	 ">
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
            className="w-[100%] mt-[100px]"
          />
        </div>
      </div>
    </div>
  )
}
