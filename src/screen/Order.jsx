import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../component/NavBar'
import { BsBookHalf } from 'react-icons/bs'
import { banks } from '../App'
import Footer from '../component/Footer'
const Order = ({checkMode,mode,setMode}) => {

    const query = new URLSearchParams(window.location.search)
    const data = query.get('data')
    const navigate = useNavigate()
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        <NavBar checkMode={checkMode} mode={mode} setMode={setMode}/>
        <div className='bg-gray-200 pt-8  md:w-2/3 w-full flex flex-col' dir={`${checkMode() === 'ar'?'rtl' : 'ltr' }`}>
            <div className='bg-white flex flex-col w-full'>
                <div className={` w-full p-2 flex items-center gap-x-2 mt-10`} style={{borderBottom:'2px solid #eee',borderRight:'2px solid #36d336'}}>
                    <BsBookHalf className='text-lg text-green-500'/>
                    <span className=' text-sm  ' >{(checkMode('Online Paymnet','الدفع الالكتروني' )).word} </span>
                </div>
                <div className='flex flex-col py-2 px-10 items-center justify-center'>
                    <span className='text-xs text-green-600 my-3'>{checkMode('You have a fee transaction with the Traffic Department worth 30 SAR. Pay the amount and confirm the reservation through the banking application','لديك معاملة رسوم لدى قسم المرور بقيمة 30 ر.س قم بتسديد المبلغ وتاكيد الحجز عبر التطبيق البنكي').word}</span>
                    <div className='w-full grid grid-cols-2 py-5 gap-y-10 gap-x-3' dir='rtl'>
                        {banks.map((bank,i)=>(
                              <div className='w-full flex items-center justify-center '>
                                <img src={bank.img} alt='bankImg' className='w-48 p-2  h-16 cursor-pointer' onClick={()=>navigate(`/payment?data=${data}&type=${bank.name}`)}/> 
                              </div>
                        ))}
                      
                        
                    </div>
                </div>
            </div>
    
        </div>
        <Footer setMode={setMode} checkMode={checkMode} />
        </div>
  )
}

export default Order