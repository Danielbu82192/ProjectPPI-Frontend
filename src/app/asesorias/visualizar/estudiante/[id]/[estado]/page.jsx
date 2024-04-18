"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import MostrarEstudiante from '@/component/asesorias/mostrar/estudiante/mostrarEstudiante'
import { format } from 'date-fns';
import { useRouter } from "next/navigation";

function page({ params }) {
    const [showAlert, setShowAlert] = useState(false);
    const [cita, setCita] = useState([]);
    const [profesor, setProfesor] = useState([]);
    const [equipo, setEquipo] = useState([]);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [estadoCita, setEstadoCita] = useState([]);
    const [tipoCita, setTipoCita] = useState([]);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [salon, setSalon] = useState('');
    const router = useRouter();

    function formatDate(dateString) {
        return format(new Date(dateString), 'dd/MM/yyyy');
    }
    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        const formattedTime = format(new Date(`2000-01-01T${hora}`), 'HH:mm');
        return formattedTime;
    }
    useEffect(() => {
        const traerCita = async () => {
            if (params.estado == '2'||params.estado == '5') {
                const response = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/${params.id}`);
                const data = await response.json();
                if (response.ok) {
                    setCita(data)
                    setEquipo(data.equipocita)
                    setEstadoCita(data.estadoCita)
                    setHora(formatTime(data.hora))
                    setFecha(formatDate(data.fecha))
                    setTipoCita(data.tipoCita)
                    setProfesor(data.usuariocitaequipo) 
                    const response2 = await fetch(`https://projectppi-backend-production.up.railway.app/hora-semanal/profesor/${data.usuariocitaequipo.id}`);
                    const data2 = await response2.json(); 
                    setSalon(data2[0].salon)
                }
            } else if (params.estado == '4'){
                const response = await fetch(`https://projectppi-backend-production.up.railway.app/equipo-ppi/1`);
                const data = await response.json();
                if (response.ok) {
                    const canceladas = data[0].canceladas;
                    console.log(canceladas)
                    for (const item in canceladas) {
                        if (canceladas[item].id == params.id) {
                            setCita(canceladas[item])
                            setEquipo(canceladas[item].equipocita)
                            setEstadoCita(canceladas[item].estadoCita)
                            setHora(formatTime(canceladas[item].hora))
                            setFecha(formatDate(canceladas[item].fecha))
                            setTipoCita(canceladas[item].tipoCita)
                            setProfesor(canceladas[item].usuariocitaequipo)
                        }
                    }
                }
            }
        }
        traerCita();
    }, []);
    const cancelarCita = async (id) => {
        const dataCita = {
            "link": " ",
            "equipocita": null,
            "estadoCita": 1
        };
        const requestOptionsCita = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataCita)
        };
        let dataEquipo = {}
        cita.estadoCita.id = 4;
        cita.estadoCita.nombre = "Cancelada";
        const ids = cita.id
        if (equipo.canceladas == null) {
            dataEquipo = {
                "canceladas": { ids: cita }
            };
        } else {
            const citaCanceladas = equipo.canceladas
            const nuevaCita = {
                ...citaCanceladas,
                [ids]: cita

            }
            dataEquipo = {
                "canceladas": nuevaCita
            };
        }

        const requestOptionsEquipo = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataEquipo)
        };

        try {
            const [responseCita, responseEquipo] = await Promise.allSettled([
                fetch('https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/' + id, requestOptionsCita),
                fetch('https://projectppi-backend-production.up.railway.app/equipo-ppi/1', requestOptionsEquipo)
            ]);

            if (responseCita.status === 'fulfilled' && responseEquipo.status === 'fulfilled') {
                setShowCorrecto(true);
                setTimeout(() => {
                    router.push('/asesorias/visualizar/estudiante');
                }, 2000);
            } else {
                setShowAlert(true);
            }
        } catch (error) {
            setShowAlert(true);
        }
    };

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);
    return (
        <>
            <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
                <div className='pt-8  pb-8 w-full'>
                    <div className=' md:h-22 lg:h-22 xl:h-16 sm:h-22  border-b-2 pl-8 pr-80 items-start w-full flex '>
                        <h1 className='text-4xl font-bold text-center text-gray-600'>Cita de asesorías</h1>
                    </div>
                    <div className='p-5'>
                        <div className='grid grid-cols-1 lg:grid-cols-2'>
                            <div className="xl:ml-0">
                                <div className="m-4 sm:m-10 grid grid-cols-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                                    </div>
                                    <div>
                                        <span className={`inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 ${estadoCita.id == 4||estadoCita.id == 5 ? 'bg-red-500' : 'bg-green-500'} text-white font-semibold rounded-full`}>
                                            {estadoCita.nombre}
                                        </span>
                                    </div>
                                </div>
                                <div className="m-4 sm:m-10 grid grid-cols-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Profesor:</h1>  </div>
                                    <div className='-mt-2'>
                                        <span className="inline-block sm:mt-2 ml-2  sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500  ">
                                            {profesor.nombre}   </span>
                                    </div>
                                </div>
                                <div className="m-4 sm:m-10 grid grid-cols-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                                    </div>
                                    <div>
                                        <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                            {fecha}     </span>
                                    </div>
                                </div>
                                <div className="m-4 sm:m-10 grid grid-cols-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                    </div>
                                    <div>
                                        <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                            {hora}     </span>
                                    </div>
                                </div>
                                <div className="m-4 sm:m-10 grid grid-cols-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Tipo:</h1>
                                    </div>
                                    <div>
                                        <span className="inline-block font-semibold text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 ">
                                            {tipoCita.nombre}       </span>
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
                            </div>
                            <div className="justify-center  lg:mt-20 xl:mt-0">
                                {estadoCita.id != 2 ? (null) : (
                                    <button onClick={() => { cancelarCita(cita.id) }} class="text-white xl:mt-36 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAlert && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Error al cancelar</div>
                            <button onClick={() => { setShowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCorrecto && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Cancelado correctamente.</div>
                            <button onClick={() => { setShowCorrecto(!showCorrecto) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default page