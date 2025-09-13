import React from 'react'
import NavBar from '../component/NavBar'
import Footer from '../component/Footer'

const NotFound = ({checkMode,setMode, mode}) => {
  return (
    <div>
        <NavBar checkMode={checkMode}setMode = {setMode}  mode={mode}/>
        <div className='flex w-full  text-2xl  items-center justify-center' style={{height:'50vh'}}>{checkMode('Page Not Found  | Error 4044','الصفحه غير موجوده | خطأ 404').word}</div>
        <Footer checkMode={checkMode}/>
    </div>
  )
}

export default NotFound