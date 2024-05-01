/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { format } from 'date-fns';

function page({ params }) {
    const [cita, seCita] = useState([])
    const [estadoCita, setEstadoCita] = useState([])
    const [tipoCita, setTipoCita] = useState([])
    const [salon, setSalon] = useState([])
    const [equipo, setEquipo] = useState([])
    const [estudiantesEquipo, setEstudiantesEquipo] = useState([]);
    const [asesor, setAsesor] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const buscarCita = async () => {
            try {
                const response = await fetch(`http://localhost:3002/citas-asesoria-ppi/` + params.id);
                const data = await response.json();
                if (response.ok) {
                    seCita(data)
                    setEstadoCita(data.estadoCita)
                    setTipoCita(data.tipoCita)
                    setEquipo(data.equipocita)
                    setAsesor(data.usuariocitaequipo)
                    const response2 = await fetch(`http://localhost:3002/hora-semanal/profesor/${data.usuariocitaequipo.id}`);
                    const data2 = await response2.json();
                    setSalon(data2[0].salon)
                    const response3 = await fetch(`http://localhost:3002/equipo-usuarios/Estudiantes`);
                    const data3 = await response3.json();
                    if (response3.ok) {
                        setEstudiantesEquipo(data3[data.equipocita.codigoEquipo])
                        console.log(data3[data.equipocita.codigoEquipo])
                    }
                }
            } catch (error) {
                setShowAlert(true);
            }
        }
        buscarCita()
    }, []);

    function formatDate(dateString) {
        if (!dateString) {
            return ''; // Maneja valores nulos o indefinidos
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Fecha inválida'; // Maneja fechas inválidas
        }
        return format(date, 'dd/MM/yyyy');
    }
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Cita de asesoría</h1>
                    </div>
                </div>
                <div className='p-10'>

                    <div className={`p-10  grid grid-cols-1 lg:grid-cols-2  `}>
                        <div className={`xl:ml-0 `}>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                                </div>
                                <div className='-mt-2'>
                                    <span className={`inline-block mt-1 text-2xl sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 ${estadoCita.id == 2 ? (`bg-emerald-500`) : estadoCita.id == 1 ? (`bg-gray-500`) : estadoCita.id == 4 ? (`bg-red-500`) : estadoCita.id == 5 ? (`bg-red-500`) : estadoCita.id == 3 ? (`bg-indigo-500`) : (`bg-amber-500`)} bg-emerald-500 text-white font-semibold rounded-full`}>
                                        {estadoCita.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Asesor:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {asesor.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {formatDate(cita.fecha)}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                </div>
                                <div>
                                    {cita.hora && cita.hora.includes(':') && (
                                        <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                            {cita.hora.split(':')[0]}:{cita.hora.split(':')[1]}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Tipo:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {tipoCita.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    {tipoCita.id == 1 ? (
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Enlace:</h1>
                                    ) : (
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Ubicación:</h1>
                                    )}
                                </div><div>
                                    {tipoCita.id == 1 ? (
                                        <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                            {cita.link}       </span>
                                    ) : (
                                        <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                            {salon}       </span>
                                    )}

                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Equipo:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {equipo.codigoEquipo}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estudiantes:</h1>
                                </div>
                                <div className='block'>
                                    {estudiantesEquipo && estudiantesEquipo.map((item) => (
                                        <span key={item.id} className=" text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3">
                                            {item.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                        {estadoCita.id == 5 ? (
                            <div className="  sm:m-10">
                                <button onClick={() => { router.push('/asesorias/visualizar/asesor/' + cita.modificaciones); }} class="text-white xl:mt-4 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Nueva cita</button>
                            </div>
                        ) : estadoCita.id == 3 ? (
                            <div className="sm:m-10 ">
                                <button onClick={() => { router.push('/bitacora/visualizar/asesor/' + equipo.id); }} class="text-white xl:mt-4 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Ver Bitácora</button>
                            </div>
                        ) : (null)
                        }


                    </div>
                </div>
            </div>
        </div>
    )
}

export default page