import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const routeNames: { [key: string]: string } = {
  speak: 'تحدث',
  listen: 'استمع',
  write: 'الكتابة',
  review: 'المراجعة',
  login: 'تسجيل',
}

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x !== 'ar')

  return (
    <div className="bg-white px-4 py-2 shadow-md">
      <div className="breadcrumbs text-sm">
        <ul className="flex gap-1 text-gray-600 px-14 pt-6">
          <li className="hover:text-blue-500 text-md">
            <Link to="/" className="flex items-center gap-1">
              الرئيسة
            </Link>
          </li>
          <li className="hover:text-blue-500 text-[#219F8A] text-md">
            <Link to="/" className="flex items-center gap-1">
              الجدارية الصوتية
            </Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`
            const isLast = index === pathnames.length - 1
            const routeName = routeNames[value]

            return (
              routeName && (
                <li key={to} className="flex items-center gap-1">
                  {isLast ? (
                    <span className="text-[#219F8A] font-medium">
                      {routeName || value}
                    </span>
                  ) : (
                    <Link to={to} className="text-gray-800 hover:text-blue-500">
                      {routeName || value}
                    </Link>
                  )}
                </li>
              )
            )
          })}
        </ul>
      </div>
    </div>
  )
}
