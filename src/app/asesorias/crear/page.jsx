import React from 'react'
import Crear from '@/component/asesorias/crear/crear'

function page() {
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className=' md:h-22 lg:h-22 xl:h-16 sm:h-22  border-b-2 pl-8 pr-80 items-start w-full flex '>
                    <h1 className='text-4xl font-bold text-center text-gray-600'>Crear citas de asesorías</h1>
                </div>
                <div className='p-10'>
                    <Crear />
                </div>
            </div>
        </div>
    )
}

export default page