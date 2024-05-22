"use client";
import React, { useState, useEffect } from 'react';

function Page() {

    return (
        <div className="ml-2 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Generación de reportes</h1>
                    </div>
                </div>
                <br />
                <div className="p-4">
                    <p style={{ textAlign: 'justify' }}>Selecciona el informe que deseas generar: </p>
                </div>
                <div className='p-4 space-x-4'>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Equipos con Mora
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Docentes con Mora
                    </button>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Estudiantes sin Asesoría
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;
