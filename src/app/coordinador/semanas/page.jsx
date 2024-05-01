/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { format } from 'date-fns'
import React, { useState, useEffect } from 'react'

function page() {
    const [fechaInicio, setFechaInicio] = useState()
    const [fechaFin, setFechaFin] = useState()
    const [semanas, setSemanas] = useState([])
    const [edicionHabilitada, setEdicionHabilitada] = useState([]);
    const [showAlert, setshowAlert] = useState(false);
    const [estadoCrear, setEstadoCrear] = useState(false)


    const handleCheckboxChange = (index) => {
        const newEdicionHabilitada = [...edicionHabilitada];
        newEdicionHabilitada[index] = !newEdicionHabilitada[index];
        setEdicionHabilitada(newEdicionHabilitada);
    };

    const calcularSemanas = () => {
        const fechaInicioParts = fechaInicio.split('-');
        const fechafinParts = fechaFin.split('-');
        const fechaAuxInicio = new Date(fechaInicioParts[0], fechaInicioParts[1] - 1, fechaInicioParts[2]);
        const fechaAuxFin = new Date(fechafinParts[0], fechafinParts[1] - 1, fechafinParts[2])

        if (fechaAuxInicio > fechaAuxFin) {
            setshowAlert(true);
            return;
        }
        const fechaLunesInicio = new Date(fechaInicioParts[0], fechaInicioParts[1] - 1, fechaInicioParts[2])
        const fechaLunesFin = new Date(fechafinParts[0], fechafinParts[1] - 1, fechafinParts[2])

        if (fechaAuxInicio.getDay() != 0) {
            fechaLunesInicio.setDate(fechaAuxInicio.getDate() - fechaAuxInicio.getDay() + 1)
        }
        if (fechaAuxFin.getDay() != 0) {
            fechaLunesFin.setDate(fechaAuxFin.getDate() - fechaAuxFin.getDay() + 1);
        }


        setSemanas(obtenerSemanas(fechaLunesInicio, fechaLunesFin))
        setEstadoCrear(true)
    }

    const obtenerSemanas = (fechaInicio, fechaFin) => {
        const semanasaux = [];
        let auxLunesInicio = new Date(fechaInicio);
        while (auxLunesInicio.getMonth() <= fechaFin.getMonth()) {
            const siguienteViernes = new Date(auxLunesInicio);
            siguienteViernes.setDate(auxLunesInicio.getDate() + 4);
            semanasaux.push([new Date(auxLunesInicio), siguienteViernes]);
            auxLunesInicio.setDate(auxLunesInicio.getDate() + 7);
        }
        return semanasaux;
    };

    const modificarSemana = (actual, value, index, item) => {

        const fecha = value.split('-');
        const fechaAux = new Date(fecha[0], fecha[1] - 1, fecha[2]);
        if (actual > fechaAux) {
            setshowAlert(true);
            return
        }
        if (fechaAux.getDay() != 0) {
            fechaAux.setDate(fechaAux.getDate() - fechaAux.getDay() + 1)
        }
        const fechaViernes = new Date(fecha[0], fecha[1] - 1, fecha[2])
        fechaViernes.setDate(fechaAux.getDate() + 4);
        const nuevaSemanas = semanas.map((semana, idx) => {
            if (idx === index) {
                return [fechaAux, fechaViernes];
            }
            return semana;
        });

        setSemanas(nuevaSemanas);
    };

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setshowAlert(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Semanas</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className='grid grid-cols-2'>
                        <div className='mr-5'>
                            <label class=" text-lg font-medium text-gray-700"> Semana Inicio </label>

                            <input
                                type="date"
                                onChange={(e) => { setFechaInicio(e.target.value) }}
                                class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            />
                        </div>
                        <div className='ml-5'>
                            <label class=" text-lg font-medium text-gray-700"> Semana Final </label>

                            <input
                                type="date"
                                onChange={(e) => { setFechaFin(e.target.value) }}
                                class="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="sm:m-10 ">
                        <button onClick={() => { calcularSemanas(); }} class="text-white xl:mt-4 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Calcular</button>
                    </div>
                </div>
                <div >
                    {estadoCrear ? (
                    <><div>
                            <div className='grid grid-cols-4 py-2 px-10  border-t-2 border-b-2 border-gray-500'>
                                <div className='text-xl font-semibold text-gray-600 text-center'>Modificar</div>
                                <div className='text-xl font-semibold text-gray-600 text-center'>Semana</div>
                                <div className='text-xl font-semibold text-gray-600 text-center'>Inicio</div>
                                <div className='text-xl font-semibold text-gray-600 text-center'>Fin</div>
                            </div>
                            <div className='grid grid-cols-4 items-center'>
                                {semanas.map((item, index) => (

                                    <>
                                        <div className="flex justify-center items-center" key={index}>
                                            <label
                                                htmlFor={`week-checkbox-${index}`}
                                                className="relative h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500 flex justify-center  items-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={edicionHabilitada[index]}
                                                    onChange={() => handleCheckboxChange(index)}
                                                    id={`week-checkbox-${index}`}
                                                    className="peer sr-only" />
                                                <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"></span>
                                            </label>
                                        </div>
                                        <div className='text-xl font-semibold text-gray-600 text-center'>{index + 1}</div>
                                        <div className='text-xl font-semibold text-gray-600 text-center'>
                                            <input
                                                type="date"
                                                id={index + " " + 0}
                                                onChange={(e) => { modificarSemana(item[0], e.target.value, index, 0) } }
                                                value={item[0].toLocaleDateString('en-CA')}
                                                disabled={!edicionHabilitada[index]}
                                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm" />
                                        </div><div className='text-xl font-semibold text-gray-600 text-center'>
                                            <input
                                                type="date"
                                                onChange={(e) => { item[1] = e.target.value } }
                                                value={item[1].toLocaleDateString('en-CA')}
                                                disabled={true}
                                                className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm" />
                                        </div></>

                                ))}
                            </div>
                        </div><div className="sm:m-10 ">
                                <button onClick={() => { console.log(semanas) } } class="text-white xl:mt-4 h-14 py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Crear</button>
                            </div></>
                    ) : (null)}
                </div>
            </div>
            {showAlert && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Las fechas están incorrectas.</div>
                            <button onClick={() => { setshowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page