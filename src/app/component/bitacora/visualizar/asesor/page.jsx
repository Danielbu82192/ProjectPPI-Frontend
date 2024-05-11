import React from 'react'
import Asesor from '@/component/bitacora/visualizar/asesor/asesor'

function page() {
    return (
    <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
        <div className='pt-8  pb-8 w-full'>
            <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-600'>Bitácoras</h1>
                </div>
            </div>
            <div className='p-10'>
                <Asesor />
            </div>
        </div>
    </div>
    )
}

export default page