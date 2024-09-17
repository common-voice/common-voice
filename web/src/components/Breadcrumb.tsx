import React from 'react'

export default function Breadcrumb() {
  return (
    <div className="bg-white px-4 py-2 shadow-md ">
    <div className="breadcrumbs text-sm">
      <ul className="flex gap-1 text-gray-600 px-14 pt-6">
        <li className="hover:text-blue-500">
          <a href="#" className="flex items-center gap-1">
            الرئيسية
          </a>
        </li>
        <li className="hover:text-blue-500 text-[#219F8A]">
          <a href="#" className="flex items-center gap-1">
             الجدارية الصوتية
          </a>
        </li>
      </ul>
    </div>
  </div>
  )
}
