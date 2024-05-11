import React from 'react'
import BannerTable from '@/component/banner/bannerTable'

function Page() {
    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-2 w-full'>
                <div className=' md:h-22 lg:h-16 xl:h-22 sm:h-22  border-b-2 pl-8 items-start'>
                    <h2 className='text-4xl font-bold text-left text-gray-600'>Administrar: Contenidos informativos</h2>
                </div>
                <div className='m-2'>
                    <BannerTable />
                </div>
            </div>
        </div >
    );
}

export default Page;