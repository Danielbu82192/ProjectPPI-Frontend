"use client"
import React, { useState } from 'react';
import ExcelUploader from './ExcelUploader';
import CargaExcel from './CargaExcel';

function Page() {
    const [cargaExitosa, setCargaExitosa] = useState(false);
    const [mostrarBoton, setMostrarBoton] = useState(false);
    const [mostrarBotonDos, setMostrarBotonDos] = useState(false);

    const handleCargarUsuarios = () => {
        setCargaExitosa(true);
        setTimeout(() => {
            setCargaExitosa(false);
            window.location.reload();
        }, 1300);
    };

    const handleCargarDocentes = () => {
        setCargaExitosa(true);
        setTimeout(() => {
            setCargaExitosa(false);
            window.location.reload();
        }, 1500);
    };

    const handleCargaExcel = () => {
        setMostrarBotonDos(true);
    };

    const handleExcelUploader = () => {
        setMostrarBoton(true);
    };

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Docentes y Asesores</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className="mt-2">
                        <p>Por favor, asegúrate de descargar el formato <a className="text-green-500 hover:text-green-700" href='./Archivo_Docentes_Asesores.xlsx' download>Archivo_Docentes_Asesores</a>, ya que es el que cumple las condiciones para un correcto funcionamiento. Aquí puedes encontrar la <a className="text-green-500 hover:text-green-700" target='_blank' href='RUTA/GUIA/CUANDO/ESTE/LISTA' download> Guía para importar profesores y asesores al sistema gestion documental PPI.</a> Una vez que estés seguro, puedes proceder a subir tu archivo haciendo clic en el botón a continuación:</p>
                        <br></br>
                        <CargaExcel onClick={handleCargaExcel} />
                    </div>
                    {mostrarBotonDos && (
                        <div className="mt-5">
                            <button onClick={handleCargarDocentes} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Cargar Docentes y Asesores
                            </button>
                        </div>
                    )}
                </div>
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
                    {mostrarBoton && (
                        <div className="mt-5">
                            <button onClick={handleCargarUsuarios} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Cargar Estudiantes
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {cargaExitosa && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            ¡Carga Exitosa!
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Los usuarios se han cargado correctamente.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page;
