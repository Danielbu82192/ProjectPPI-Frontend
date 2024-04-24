import React from 'react'
import  { SlideBanner, SlideNewsCard } from '@/component/banner/banner'  
function page() {
  return (
    <div className='bg-white justify-center  flex flex-col px-5 py-20 '><SlideBanner/><SlideNewsCard/></div>
  )
}

export default page