import React, { useState } from 'react'
// import micBanner from './images/mic-banner.png'
import classes from './home.module.css'
import URLS from '../../../urls'
import { LocaleLink } from '../../locale-helpers'
import { InfoDarkIcon, InfoIcon, MicIcon } from '../../ui/icons'
import Modal from '../../modal/modal'
import { useHistory } from 'react-router-dom';


export default function HomePageSection() {
  const history = useHistory();

  const [showInfoContributeModal, setShowInfoContributeModal] = useState(false);
  const [showInfoRatingModal, setShowInfoRatingModal] = useState(false);

  return (
    <div className=" flex flex-col items-center mt-10">
      {/* mic-banner */}
      <div className='p-2 container hero-banner'>
      <div
        className="rounded-[24px] bg-banner bg-no-repeat bg-center w-[100%] max-w-[1460px] bg-cover md:bg-contain min-h-[300px] h-full flex justify-start items-center ">
        <div className="flex flex-col justify-between gap-5 items-start p-8 m-10 text-white text-right">
          <h1 className=" text-[30px] md:text-[30px] lg:text-[50px] text-center font-bold">
            الجداريــة الصوتيـة
          </h1>
          <p className="text-[16px] md:text-[20px] text-right">
          أداة لإثراء البيانات الصوتية العربية {' '}
          </p>
          <div className="self-center">
            <img
              src="/voicewall/img/link-forward-rounded.svg"
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
      </div>


      <div className="flex justify-center gap-8 mx-auto py-10 flex-wrap ">
        {/* ساهم بصوتك */}
        <div
          className={`hero-card max-w-[572px] w-[372px] md:w-[472px] lg:w-[572px] h-[986px] ${classes.card}`}
          style={{
            background:
              'transparent linear-gradient(180deg, #EFF3F6 0%, #FFFFFF00 100%) 0% 0% no-repeat padding-box',
            border: '1px solid #B1B1B157',
            borderRadius: '50px',
            padding: '30px',
          }}>
            <div className="flex justify-center gap-1">

          <h1 className="text-[30px] lg:text-[50px] text-center font-bold">
          أسهِمْ بصوتك
          </h1>
          <button type='button' className='text-[#219F8A] text-[14px] md:text-[16px]'
          onClick={() => setShowInfoContributeModal(true)}
          >
          <InfoDarkIcon/>
          </button>
          {showInfoContributeModal && (
          <Modal           
          buttons={{
            "ابدأ": () => {
              history.push(URLS.SPEAK)
            },
          }}
          onRequestClose={() => setShowInfoContributeModal(false)}
          >
            <div className="text-right">

              <p className="text-center font-bold">
              ستظهر لك مجموعة من الجمل والأسئلة 
              </p>

              <p className='flex gap-1 justify-center mt-5'>
              انقر
              <MicIcon />
              ثم:
              </p>
              <p>إذا ظهرت لك جملة اقرأها بصوت عالٍ
</p>
<p>إذا ظهر لك سؤال أجِب عنه بلغتك التي تتحدث بها في حياتك اليومية
</p>
<ul className="list-disc pr-5 text-right text-[14px] md:text-[16px] leading-7 mt-5">
      <li>لا تتجاوز قراءة الجملة أو إجابة السؤال 10 ثوانٍ.</li>
      <li>ستظهر الجمل أو الأسئلة على دفعات، كل دفعة مكونة من خمس جمل أو أسئلة، سيُطلب منك تعبئة بياناتك عند الانتهاء من تسجيل أول خمسة مقاطع لأول مرة فقط.</li>
      <li>يمكنك تخطي الجملة أو السؤال إلى غيرهما.</li>
      <li>يمكنك الإبلاغ عن الجملة إذا كانت صعبة النطق، أو تحتوي على إساءة، أو خطأ كتابيّ، أو لغة مختلفة، أو أي مشكلة أخرى.</li>
    </ul>
            </div>
          </Modal>
        )}
            </div>
          <p className="text-right py-4 text-[14px] md:text-[16px]w-[240px] md:w-[440px] mx-auto leading-6 text-wrap">
          تحدث، سجّل صوتك واستمع إليه! </p>

          <div className="flex justify-center md:justify-center items-center pt-16 md:pr-8 gap-8 flex-wrap">
            <div className="flex flex-col justify-center text-[12px] w-[110px] hidden">
              <p className="text-[#219F8A]">مستوى التقدم اليوم</p>
              <p> +9</p>
              <p>مقاطع مسجلة</p>
            </div>

            <div className="flex flex-col justify-center items-center	w-[210px]">
              <LocaleLink to={URLS.SPEAK}>
                <div>
                  <img
                    src="/voicewall/img/mic-icon.svg"
                    alt="mic-icon"
                    className={` ${classes['clickable-icon']} w-[110px] h-[110px] cursor-pointer mx-auto`}
                  />
                  <h1 className="text-center my-2">أسمعنا صوتك</h1>
                </div>
              </LocaleLink>
            </div>
          </div>
          <img
            src="/voicewall/img/phone-speak.svg"
            alt="phone-speak"
            className="w-[100%] mt-[100px] infograph-img"
          />
        </div>

        {/*  الجدارية الصوتية */}
        <div
          className={`hero-card max-w-[572px] w-[372px] md:w-[472px] lg:w-[572px] h-[986px] ${classes.card}`}
          style={{
            background: '#219F8A 0% 0% no-repeat padding-box',
            border: '1px solid #B1B1B157',
            borderRadius: '50px',
            padding: '30px',
            color: 'white',
          }}>
            <div className="flex justify-center gap-1">
                  <h1 className="text-[30px] lg:text-[50px]  text-center font-bold">
            {' '}استمع وقيّم
          </h1>
                  <button type='button' className='text-[#219F8A] text-[14px] md:text-[16px]'
          onClick={() => setShowInfoRatingModal(true)}
          >
          <InfoIcon />
          </button>
          {showInfoRatingModal && (
          <Modal           
          buttons={{
            "أبدأ": () => {
              history.push(URLS.LISTEN)
            },
          }}
          onRequestClose={() => setShowInfoRatingModal(false)}
          >
            <div className="text-right">

              <p className="text-center font-bold text-[20px]">
              ستظهر لك مشاركات الآخرين لتقيّمها 
              </p>

              <p className='flex gap-1 font-bold  text-[18px] mt-5'>
              إذا كانت المشاركة قراءة جملة:  
              </p>
              <p>

              انقر (نعم) إذا كان المنطوق مطابقًا للمكتوب وكان النطق صحيحًا 
              <br/>
              انقر (لا) إذا لم يكن كذلك 
              </p>

              <p className='flex gap-1 font-bold text-[18px] mt-5'>
              إذا كانت المشاركة إجابة عن سؤال:  
              </p>
<p>
انقر (نعم) إذا كانت الإجابة واضحة ومتعلقة بالسؤال  
<br/>
انقر (لا) إذا لم تكن كذلك 
</p>

<ul className="list-disc mt-5 pr-5 text-right text-[14px] md:text-[16px] leading-7">
      <li>ستظهر المشاركات على دفعات، تتضمن كل دفعة خمس مشاركات.</li>
      <li>تشوش الصوت لا يمنع من قبول المقطع الصوتي؛ لأننا نحتاج هذا التنوع الطبيعي في المقاطع. 
</li>
<li>يمكنك تخطي المشاركة إلى مشاركة أخرى. </li>
<li>يمكنك الإبلاغ عن المشاركة إذا كانت تحتوي على إساءة، أو خطأ كتابيّ، أو أي مشكلة أخرى.  </li>
 </ul>
            </div>
          </Modal>
        )}
                  </div>
          <p className="text-right py-4 text-[14px] md:text-[16px] w-[240px] md:w-[440px] mx-auto leading-6 text-wrap">
          شنّف سمعَك بمشاركات الآخرين وقيّمها، ساعِدنا على تطوير بيانات صوتية دقيقة وعالية الجودة
</p>

          <div className="flex justify-center md:justify-center items-center pt-16 md:pr-8 gap-8 flex-wrap">
            <div className="flex flex-col justify-center text-[12px] w-[110px] hidden">
              <p>مستوى التقدم اليوم</p>
              <p> +9</p>
              <p> مقاطع مدقّقة</p>
            </div>

            <div className="flex flex-col justify-center items-center w-[210px]">
              <LocaleLink to={URLS.LISTEN}>
                <div>
                  <img
                    src="/voicewall/img/play-icon.svg"
                    alt="mic-icon"
                    className={` ${classes['clickable-icon']} w-[110px] h-[110px] cursor-pointer mx-auto`}
                  />
                  <h1 className="text-center my-2">استمع وقيم </h1>
                </div>
              </LocaleLink>
            </div>
          </div>
          <img
            src="/voicewall/img/phone-listen.svg"
            alt="phone-speak"
            className="w-[100%] mt-[115px] infograph-img"
          />
        </div>
      </div>
    </div>
  )
}
