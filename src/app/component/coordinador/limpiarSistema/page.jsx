"use client"
import React, { useState } from 'react'

function page() {

    const [showAlertDelete, setShowAlertDelete] = useState(false);

    const Limpiar = async () => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        };
        const response = await fetch('http://localhost:3002/usuario/limpiarSistema/', requestOptions);
        if(response.ok)
            alert()
    }

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='  h-22 pb-2 flex-col  border-b-2 flex justify-between items-center'>
                    <div>
                        <h1 className='ml-5 text-4xl font-bold text-gray-600'>Limpiar sistema</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className='text-xl text-gray-500'>
                        <span>Para poder eliminar información del sistema, se debe tener en cuenta que, cuando se realice esta acción, se eliminará la siguiente información:</span>
                        <ul class="list-disc ml-10">
                            <li class="py-2">Citas de asesorías</li>
                            <li class="py-2">Bitácoras</li>
                            <li class="py-2">Semanas</li>
                            <li class="py-2">Notificaciones</li>
                        </ul>
                        <button onClick={() => { setShowAlertDelete(true); }} className="mt-6 text-white py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Limpar sistema
                        </button>
                    </div>
                </div>
            </div>
            {showAlertDelete && (<>
                <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
                    <div class="flex flex-col justify-center content-center items-center rounded-lg bg-white p-4 shadow-2xl min-w-[50vw] max-w-[50vw] border border-solid border-gray-300">
                        <h2 class="text-lg font-bold">¿Deseas limpiar el sistema?</h2>
                        <p class="mt-2 text-sm text-gray-800">
                            Está seguro de que desea limpiar el sistema.
                        </p>

                        <div class="mt-4 flex flex-row flex-wrap min-w-full items-center content-center justify-center gap-2">
                            <button type="button" class="min-w-[25%] rounded-lg bg-green-400 px-4 py-2 text-sm font-medium text-white hover:bg-green-500" onClick={() => Limpiar()}>
                                Confirmar
                            </button>
                            <button type="button" class="min-w-[25%] rounded-lg bg-red-400 px-4 py-2 text-sm font-medium text-white hover:bg-red-500" onClick={() => setShowAlertDelete(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </>
            )}
        </div >
    )
}

export default page