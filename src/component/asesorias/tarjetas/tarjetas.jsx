/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
function tarjetas() {

    const [citas, setCitas] = useState([]);
    const [citasDisponibles, setCitasDisponibles] = useState(true);

    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        const formattedTime = format(new Date(`2000-01-01T${hora}`), 'h:mm');
        return formattedTime.replace(/^0(\d)/, '$1');
    }

    useEffect(() => {
        const traerCitasEquipo = async () => {
            const fechaActual = new Date();
            const fechaLunes = new Date(fechaActual);
            const fechaSabado = new Date(fechaActual); // Clona la fecha actual
            fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
            fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7)); // Establece la fecha al próximo lunes
            const fechaInicio = fechaLunes.toISOString().split('T')[0];
            const fechaFin = fechaSabado.toISOString().split('T')[0];
            const response = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/Equipo/${fechaInicio}/${fechaFin}/1`);
            const data = await response.json();
            if (response.ok) {
                if (data.length == 0) {
                    const response2 = await fetch(`https://projectppi-backend-production.up.railway.app/equipo-ppi/1`);
                    if (response2.ok) {
                        const data2 = await response2.json();
                        if (data.length != 0) {
                            if (data2[0].canceladas != null) {
                                setCitasDisponibles(true)
                                const citasArray = Object.values(data2[0].canceladas).flatMap(cita => Array.isArray(cita) ? cita : [cita]);
                                setCitas(citasArray)
                                return
                            }
                        }
                    }
                    setCitasDisponibles(false)
                } else {
                    setCitasDisponibles(true)
                    let citasCanceladas = data[0].equipocita.canceladas;
                    let citasActivas = data;
                    if (citasCanceladas != null) {
                        citasActivas = {
                            ...citasActivas,
                            ...citasCanceladas
                        };
                    }
                    delete citasActivas.citasCanceladas;

                    const citasArray = Object.values(citasActivas).flatMap(cita => Array.isArray(cita) ? cita : [cita]);

                    setCitas(citasArray);
                }

            }
        }
        traerCitasEquipo();
    }, []);
    console.log(citas)
    return (
        <>
            {
                citasDisponibles ? (
                    <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 ' >
                        {citas.map((item, index) => (
                            <div key={index} className=' my-4 mx-4'>
                                <a
                                    href={`/asesorias/visualizar/estudiante/${item.id}/${item.estadoCita.id}`}
                                    className="relative block overflow-hidden rounded-lg border-2 border-gray-200 p-4 sm:p-6 lg:p-8"
                                ><span
                                    className={`absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r ${item.estadoCita.id === 2
                                        ? 'from-emerald-500 via-emerald-400 to-emerald-500'
                                        : item.estadoCita.id === 3
                                            ? 'from-indigo-500 via-indigo-400 to-indigo-500'
                                            : item.estadoCita.id === 4
                                                ? 'from-red-500 via-red-400 to-red-500'
                                                : item.estadoCita.id === 5
                                                    ? 'from-red-600 via-red-500 to-red-600'
                                                    : item.estadoCita.id === 6
                                                    ? 'from-amber-600 via-amber-500 to-amber-600'
                                                    : 'from-stone-500 via-stone-400 to-stone-500'
                                        }`}
                                ></span>
                                    <div>
                                        <div className='border-b-2 w-full border-gray-200'>
                                            <h1 className='text-2xl -mt-4 mb-1 font-bold text-center text-gray-600'>{format(item.fecha, 'dd/MM/yyyy')}</h1>
                                        </div>
                                        <div className='flex justify-center pt-4'>
                                            <span className='text-xl font-semibold text-center text-gray-600'>Hora: </span>
                                            <span className='text-xl   text-center text-gray-500'>{formatTime(item.hora)}</span>
                                        </div>
                                        <div className='text-center justify-center'>
                                            <span className='text-xl font-semibold text-center text-gray-600'>Profesor:</span>
                                            <span className='text-xl   text-center text-gray-500'> {item.usuariocitaequipo.nombre}</span><br />
                                            <span className='text-xl font-semibold text-center text-gray-600'>Modalidad:</span>
                                            <span className='text-xl   text-center text-gray-500'> {item.tipoCita.nombre}</span>

                                        </div>
                                    </div>

                                </a>
                            </div>
                        ))}


                    </div >

                ) : (
                    <div>No hay citas disponibles</div>
                )
            }
        </>

    )
}

export default tarjetas