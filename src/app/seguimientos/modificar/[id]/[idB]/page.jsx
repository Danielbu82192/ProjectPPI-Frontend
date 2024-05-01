"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import SeguimientoMod from '@/component/seguimientos/modificar/seguimientoMod'

function page({ params }) {

    const [estado,setEstado]=useState([])
    const [estadoSeguimiento,setEstadoSeguimiento]=useState([])

    useEffect(() => {
        const fechData = async () => {
            const response = await fetch('http://localhost:3002/estado-seguimiento-cambio/id/' + params.idB);
            const data = await response.json();
            if (response.ok) {
                setEstado(data.estadoSeguimiento); 
                setEstadoSeguimiento(data); 
            }
        }
        fechData()
    }, [params]);
    
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Seguimiento</h1>
                    </div>
                </div>
                <div className='p-10'>
                    {estado.id==1 && parseInt(new Date(estadoSeguimiento.fecha).getDate()) == parseInt(new Date('04/26/2024').getDate()) ? (<SeguimientoMod idSeguimiento={params.id} idEstado={params.idB} />) : (<h1>No puedes editar esta asesoria, comunicate con el coordinador para volver a activarlo</h1>)}

                </div>
            </div>
        </div>
    )
}

export default page