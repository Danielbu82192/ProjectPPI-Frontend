"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import CrearBitacora from '@/component/bitacora/visualizar/modSol/crearBitacora/crearBitacora'

function page({ params }) {

    const [crear, setCrear] = useState('false')

    useEffect(() => {
        const sePuedeCrear = async () => { 
            const response = await fetch('http://localhost:3002/equipo-ppi/equipo/' + params.id);
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();                    
                    setCrear(false)
                } else {    
                    setCrear(true)
                } 
            } else {
                console.log('Hubo un problema con la solicitud.');
            }
        }
        sePuedeCrear();
    }, []);

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Bitácoras del equipo {params.id}</h1>
                    </div>
                </div>
                <div className='p-10'>
                    {
                        crear ? (<CrearBitacora equipo={params.id} />) : (<h1 className='text-4xl text-gray-600 font-bold' >La bitacora ya ha sido creada</h1>)
                    }
                </div>
            </div>
        </div>
    )
}

export default page