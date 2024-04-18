/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import Crear from '@/component/asesorias/crear/crear'

function page() {
    const monthIndex = new Date().getMonth();
    const options = { month: 'long' };
    const monthName = new Date(2000, monthIndex).toLocaleString('es-ES', options);
    const [horasPendientes, setHorasPendientes] = useState('');

    useEffect(() => {
        const validarHoras = async () => {
            const fecha = new Date();
            //fecha.setHours(3);
            let diaSemanas = fecha.getDay();
            const numeroDia = fecha.getDate();
            if (fecha.getHours() >= 18) diaSemanas = diaSemanas + 1
            const diaLunes = (numeroDia - fecha.getDay() + 1);
            const response = await fetch('https://projectppi-backend-production.up.railway.app/hora-semanal/profesor/1');
            const data = await response.json();
            if (response.ok) {
                const horasAsignadas = data[0].horasAsignadas;
                const CantidadAsesorias = horasAsignadas * 4;
                const fechaActual = new Date();
                const fechaLunes = new Date(fechaActual);
                fechaLunes.setDate(diaLunes)
                const fechaSabado = new Date(fechaActual);
                fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
                fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7)); // Establece la fecha al próximo lunes
                const fechaInicio = fechaLunes.toISOString().split('T')[0];
                const fechaFin = fechaSabado.toISOString().split('T')[0];
                const response2 = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/1`);
                const data2 = await response2.json();
                if (response2.ok) {
                    const asesoriasActual = data2.length;
                    if (asesoriasActual < CantidadAsesorias) {
                        return (CantidadAsesorias - asesoriasActual);
                    }
                }
            }
            return (false);
        }
        setHorasPendientes(validarHoras())
    }, []);
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:flex h-22    sm:flex-col sm:h-auto border-b-2      flex justify-between items-center'>
                    <div>
                        <h1 className='ml-5 text-4xl font-bold text-gray-600'>Crear citas de asesorías</h1>
                    </div>
                    <div className='text-gray-600 h-10'>
                        {!horasPendientes ? (
                            <div className="text-xl sm:mt-2"> {/* Añadida clase sm:mt-2 para separación en pantallas pequeñas */}
                                <span className='font-semibold'>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>, Citas pendientes <span className='bg-green-500 rounded-xl text-white py-2 px-2'>0</span>
                            </div>
                        ) : (
                            <div className="text-xl sm:mt-2"> {/* Añadida clase sm:mt-2 para separación en pantallas pequeñas */}
                                <span className='font-semibold'>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</span>, Citas pendientes <span className='bg-indigo-500 rounded-xl text-white py-2 px-2'>{horasPendientes}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className='p-10'>
                    <Crear />
                </div>
            </div>
        </div >
    )
}

export default page