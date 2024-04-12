"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import Mostrar from '@/component/asesorias/mostrar/mostrarAs'
import { format } from 'date-fns';
function page({ params }) {

    const [cita, setCita] = useState([]);
    const [semanaConst, setSemanaConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [diasConst, setDiasConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [estadoModificar, setEstadoModificar] = useState(false);
    const [grupoTrue, setGrupoTrue] = useState(false);
    const [selectEstado, setSelectEstado] = useState(1);
    const [citaEstado, setCitaEstado] = useState([]);
    const [showModificar, setShowModificar] = useState(true)
    const [dia, setDia] = useState()
    const [numeroDia, setNumeroDia] = useState()
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [horaConst, setHoraConst] = useState('');
    const [minConst, setMinConst] = useState('');
    const [horaFija, setHoraFija] = useState('');
    const [minFija, setMinFija] = useState('');
    const [equipo, setEquipo] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [numeroDiaLunes, setNumeroDiaLunes] = useState(null);
    const calcularNumeroDiaLunes = (fecha) => {
        const diaSemana = fecha.getDay();
        const numeroDia = fecha.getDate();
        return numeroDia - diaSemana;
    };

    function formatDate(dateString) {
        return format(new Date(dateString), 'dd/MM/yyyy');
    }
    function formatTime(timeString) {
        return format(new Date(`2000-01-01T${timeString}`), 'HH:mm');
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3002/citas-asesoria-ppi/${params.id}`);
                const data = await response.json();
                setCita(data);
                console.log(data)
                setCitaEstado(data.estadoCita)
                setNumeroDiaLunes(calcularNumeroDiaLunes(new Date(data.fecha)) + new Date().getDay())
                setDia(new Date(data.fecha).getDay());
                setSemanaConst(semanaConst.slice(new Date().getDay() - 7))
                setSelectEstado(data.estadoCita.id)
                setNumeroDia(new Date(data.fecha).getDate())
                if (new Date().getDate() == new Date(data.fecha).getDate()) {
                    setHoraInicio(new Date().getHours() + 4)
                    setHoraFin(15 - new Date().getHours() + 4)
                } else {
                    setHoraInicio(6)
                    setHoraFin(15)
                }
                setEquipo(data.equipo)
                setHoraConst(data.hora.split(':')[0])
                setHoraFija(data.hora.split(':')[0])
                setMinConst(data.hora.split(':')[1])
                setMinFija(data.hora.split(':')[1])
                setHora(formatTime(data.hora))
                setFecha(formatDate(data.fecha)) 
                if (new Date().getDate() > new Date(data.fecha).getDate()) { 
                    setShowModificar(true)
                } else if (new Date().getDate() < new Date(data.fecha).getDate()) { 
                    setShowModificar(false)
                } else {
                    const fecha = new Date();
                    /*fecha.setHours(15)
                    fecha.setMinutes(0)*/
                    const minHoraACtual = (fecha.getHours() + 4) * 60 + (fecha.getMinutes())
                    const minCita = (parseInt(data.hora.split(':')[0])) * 60 + ((parseInt(data.hora.split(':')[1])))
                    if (minHoraACtual - minCita <= 0) {

                        setShowModificar(false)
                    } else {
                        setShowModificar(true)

                    }
                }
                if (!response.ok) {
                    setShowAlert(true);
                    throw new Error('Respuesta no exitosa');
                }
            } catch (error) {
                setShowAlert(true);
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [params.id, setCita]);
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);
    useEffect(() => {
        if (new Date().getDate() == numeroDia) {
            setHoraInicio(new Date().getHours() + 4)
            setHoraFin(15 - new Date().getHours() + 4)
        } else {
            setHoraInicio(6)
            setHoraFin(15)
        }
    }, [numeroDia]);
    console.log(diasConst)
    return (
        <><div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className=' md:h-22 lg:h-22 xl:h-16 sm:h-22  border-b-2 pl-8 pr-80 items-start w-full flex '>
                    <h1 className='text-4xl font-bold text-center text-gray-600'>Visualizar citas de asesorías</h1>
                </div>

                {citaEstado.nombre == 'Disponible' ? (

                    <div className='p-10  grid grid-cols-1 lg:grid-cols-2'>
                        <div className="xl:ml-40">
                            <div className="flex m-4 sm:m-10">
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                                {estadoModificar ? (
                                    <select
                                        name="estado"
                                        id="estado"
                                        value={selectEstado}
                                        onChange={(e) => {
                                            if (e.target.value === "2") {
                                                setGrupoTrue(true);
                                                setSelectEstado(2)
                                            } else {
                                                setSelectEstado(1)
                                                setGrupoTrue(false);
                                            }
                                        }}
                                        className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                    >
                                        <option value="1">Disponible</option>
                                        <option value="2">Reservado</option>
                                    </select>
                                ) :
                                    (
                                        <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-gray-500 text-white font-semibold rounded-full">
                                            {citaEstado.nombre}
                                        </span>
                                    )}
                            </div>
                            <div className="flex m-4 sm:m-10">
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>

                                {estadoModificar ? (

                                    <select value={numeroDia} onChange={(e) => { setNumeroDia(e.target.value) }} className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                    >
                                        {semanaConst.map((dia, index) => (
                                            <option key={index} value={numeroDiaLunes + index}>{dia} {numeroDiaLunes + index}</option>
                                        ))}
                                    </select>
                                ) :
                                    (<span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 text-lg">
                                        {fecha}
                                    </span>
                                    )}
                            </div>
                            <div className="flex m-4 sm:m-10">
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                {estadoModificar ? (

                                    <><select value={horaConst} onChange={(e) => { setHoraConst(e.target.value) }} id="hora" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                        <option value={horaFija} selected>{horaFija}</option>
                                        {Array.from({ length: horaFin }, (_, i) => i + horaInicio).map(hour => (
                                            <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                        <select value={minConst} onChange={(e) => { setMinConst(e.target.value) }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">

                                            <option value="00">00</option>
                                            <option value="20">20</option>
                                            <option value="40">40</option>
                                        </select></>
                                ) : (
                                    <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 text-lg">
                                        {hora}
                                    </span>
                                )}
                            </div>
                            {grupoTrue ? (
                                <div className="flex m-4 sm:m-10">
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Grupo:</h1>
                                    <select id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                        <option selected disabled>Grupo</option>
                                        <option value="101">101</option>
                                        <option value="102">102</option>
                                        <option value="103">103</option>
                                    </select>

                                </div>) : null}
                        </div>
                        <div className="justify-center  lg:mt-20 xl:mt-0">
                            {!showModificar ? (
                                !estadoModificar ? (
                                    <>
                                        <button onClick={() => { setEstadoModificar(true) }} className="text-white xl:mt-20 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Modificar</button>
                                        <button className="text-white xl:mt-7 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setEstadoModificar(true) }} className="text-white xl:mt-20 h-14 py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Confirmar</button>
                                        <button onClick={() => { setEstadoModificar(false) }} className="text-white xl:mt-7 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>
                                    </>
                                )
                            ) : null}

                        </div>
                    </div>
                ) : (

                    <div className='p-10  grid grid-cols-1 lg:grid-cols-2'>
                        <div className="xl:ml-40">
                            <div className="flex m-4 sm:m-10">
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                                <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-green-500 text-white font-semibold rounded-full">
                                    {citaEstado.nombre}
                                </span>
                            </div>
                            <div className="flex m-4 sm:m-10">
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                                <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 text-lg">
                                    {fecha}
                                </span>
                            </div>
                            <div className="flex m-4 sm:m-10">
                                <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                <span className="inline-block mt-1 sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 text-lg">
                                    {hora}
                                </span>
                            </div>
                        </div>
                        <div className="justify-center  lg:mt-20 xl:mt-0">
                            <button class="text-white xl:mt-20 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Modificar</button>
                            <button class="text-white mt-7 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>

                        </div>
                    </div>)}


            </div>
        </div > {showAlert && (
            <div className="fixed bottom-0 right-0 mb-8 mr-8">
                <div className="flex w-96 shadow-lg rounded-lg">
                    <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                            <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                        </svg>
                    </div>
                    <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                        <div>Error al cargar</div>
                        <button onClick={() => { setShowAlert(!showAlert) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )
            }</>
    )
}

export default page