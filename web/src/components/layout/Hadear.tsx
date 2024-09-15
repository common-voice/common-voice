import React from 'react'
import classes from './Header.module.css'

export default function Header() {
  return (
    <div className={classes.header}>
      <div className={classes.navList}>
      <img
            src="/img/falak-logo-light.svg"
            alt="falak-logo"
            className={classes.logo}
          />
      <ul className='flex justify-between gap-8'>
        <li className={classes.navLink}>الرئيسة</li>
        <li className={classes.navLink}>
          
     
          عن فلك
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4  inline h-4 mx-1 transform group-hover:rotate-180 transition">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </li>
        <li className={classes.navLink}>
          <div className="dropdown">
            <div tabIndex={0} role="button">
              
              
              المدونات
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4  inline h-4 mx-1 transform group-hover:rotate-180 transition">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </li>

        <li className={classes.navLink}>
          الوظائف

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4  inline h-4 mx-1 transform group-hover:rotate-180 transition">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <ul className={classes.dropdown}>{/* Dropdown  */}</ul>
        </li>
        <li className={classes.navLink}>
          
          المزايا
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4  inline h-4 mx-1 transform group-hover:rotate-180 transition">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          </li>
        <li className={classes.navLink}>
          قوائم الشيوع
          <ul className={classes.dropdown}>{/* Dropdown  */}</ul>
        </li>
        <li className={classes.navLink}> الجدارية الصوتية</li>
      </ul>
      <button className={classes.loginButton}>
            <img src="/img/login-icon.svg" alt="login-icon" className='inline ml-2'/>
            دخول</button>
      </div>
    </div>
  )
}
