import React from 'react'
import Crear from '@/component/asesorias/crear/crear'

function page() {
    const monthIndex = new Date().getMonth();
    const options = { month: 'long' };
    const monthName = new Date(2000, monthIndex).toLocaleString('es-ES', options);

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-16 sm:h-22 border-b-2 pl-8 pr-52 flex justify-between  '>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Crear citas de asesorías</h1>
                    </div>
                    <div className='text-4xl    text-gray-600'>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</div>
                </div>
                <div className='p-10'>
                    <Crear />
                </div>
            </div>
        </div>
    )
}

export default page