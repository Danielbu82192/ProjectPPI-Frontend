"use client"
import React, { useState } from 'react';
import ExcelUploader from './ExcelUploader';

function Page() {

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Estudiantes</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className="mt-2">
                        <p>Antes de continuar, te recomendamos tener a la mano todos los archivos Excel de cada asignatura previamente descargados del Portal Académico, posteriormente puedes cargar tus archivos de manera simultánea haciendo clic en el botón a continuación:</p><br></br>
                        <ExcelUploader onUpload={() => setMostrarBoton(true)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;
