import React from 'react'
import Calendario from '@/component/calendario/calendario'

function page() {
    const monthIndex = new Date().getMonth(); // Obtiene el índice del mes actual (0-11)
    const options = { month: 'long' }; // Opciones para formatear el nombre del mes
    const monthName = new Date(2000, monthIndex).toLocaleString('es-ES', options); // Cambia 'es-ES' por tu localización si es diferente

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Crear citas de asesorías</h1>
                    </div>
                    <div className='text-4xl   text-gray-600'>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</div>
                </div>
                <div className='p-10'>
                    <Calendario  />
                </div>
            </div>
        </div>
    )
}

export default page