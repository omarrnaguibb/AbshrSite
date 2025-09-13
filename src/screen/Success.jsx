import React from 'react'
import NavBar from '../component/NavBar'
import Footer from '../component/Footer'

const Success = ({mode,setMode,checkMode}) => {
  return (
    <>
        <NavBar mode={mode} setMode={setMode} checkMode={checkMode}/>
            <div className='py-2 w-full flex flex-col justify-start items-center' style={{height:'60vh'}}>
                <div className=' mt-3 w-4/5 flex items-center justify-center py-4 text-green-600' style={{borderBottom:'1px solid #eee',borderRight:'1px solid #2cff2c'}}>
                    
                </div>
                <div className='shadow-xl mt-3 w-4/5 flex items-center text-sm justify-center py-2 text-green-600' >
                    {checkMode('Your request has been received successfully','تم استقبال طلبكم بنجاح'  ).word}
                </div>
            </div>
        <Footer mode={mode} setMode={setMode} checkMode={checkMode}/>
    </>
  )
}

export default Success