import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../Breadcrumb'
import classes from './falak-header.module.css'
export default function FalakHeader() {

  return (
    <>
      <div className="inner-pages py-4 px-4 mx-0 gap-8 md:mx-6 lg:mx-8 xl:mx-8 lg:px-8 flex items-center justify-between">
        <a className="flex items-center" href="https://falak.ksaa.gov.sa/">
          <img
            src="/img/falak-logo-light.svg"
            alt="مِنَصّةُ فلك"
            height="38"
            className="mr-0 lg:mr-2 mb-1 h-[38px] "
          />
        </a>
        <button className="cursor-pointer block lg:hidden text-700">
          <i className="pi pi-bars text-4xl"></i>
        </button>
        <div
          className="items-center flex-grow-1 justify-between hidden lg:flex lg:static w-full left-0 px-6 lg:px-0 z-2"
          style={{ top: '55px' }}>
          <ul className="list-none gpa-8 p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer">
            <li>
              <Link
                to="/"
                className="flex m-0 md:mr-5 px-0 py-3 text-900 text-md line-height-3">
                <span>الرئيسة</span>
              </Link>
            </li>
            <li>
              <a
                href="https://falak.ksaa.gov.sa/aboutus"
                className="flex m-0 md:mr-5 px-0 py-3 text-900 text-md line-height-3">
                <span>عن فلك</span>
              </a>
            </li>
            <li>
              <a
                href="https://falak.ksaa.gov.sa/corpora"
                className="flex m-0 md:mr-5 px-0 py-3 text-900 text-md line-height-3">
                <span> المدونات</span>
              </a>
            </li>
            <li>
              <a
                href="https://falak.ksaa.gov.sa/frequency-lists"
                className="flex m-0 md:mr-5 px-0 py-3 text-900 text-md line-height-3">
                <span> قوائم الشيوع</span>
              </a>
            </li>

            <li>
              <a
                href="https://falak.ksaa.gov.sa/contact-us"
                className="flex m-0 md:mr-5 px-0 py-3 text-900 text-md line-height-3">
                <span>اتصل بنا</span>
              </a>
            </li>
          </ul>
          {/* {!isLoggedIn ? ( */}
          <div className="flex justify-between lg:block border-t lg:border-t-0 py-3 lg:py-0 mt-3 lg:mt-0">
            <a
              href="https://falak.ksaa.gov.sa/auth/login"
              className={`flex items-center space-x-2 ${classes['login-button']}`}>
              <img
                src="/img/icon-login.svg"
                alt="مِنَصّةُ فلك"
                height="15"
               className={classes['button-image']}
              />
           <span className={classes['button-text']}>دخول</span>

            </a>
            {/* )} */}
            {/* {showRegister && (
            <Link
              to="/auth/register"
              className="p-button-success border-none ml-5 font-light line-height-2 text-white bg-second-theme"
            >
              <img src="assets/icon-signup.svg" alt="مِنَصّةُ فلك" height="15" className="mx-1" />
              تسجيل
            </Link>
          )} */}
          </div>
          {/* ) : ( */}
          {/* <div className="flex justify-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
          <Link
            to="/d"
            className="p-button-primary border-none ml-5 font-light line-height-2 bg-second-theme text-white"
          >
            لوحة التحكم
          </Link>
        </div> */}
          {/* )} */}
        </div>
      </div>
      <Breadcrumb />
    </>
  )
}
