/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import CryptoJS from 'crypto-js';


function page({ params }) {
    const [bitacora, setBitacora] = useState([]);
    const [estudiantes, setEstudiantes] = useState([])
    const [seguimiento, setSeguimiento] = useState([])
    const claveSecreta = parseInt(new Date().getDay()) * 98765;

    useEffect(() => {
        const fechData = async () => {
            const response = await fetch('http://localhost:3002/equipo-ppi/' + params.id);
            const data = await response.json();
            if (response.ok) {
                setBitacora(data[0]);
            }
        }
        fechData()
    }, [params]);
    useEffect(() => {
        const fetchData = async () => {
            const response2 = await fetch('http://localhost:3002/equipo-usuarios/Estudiantes');
            const data2 = await response2.json();
            if (response2.ok)
                setEstudiantes(data2);
            const response = await fetch('http://localhost:3002/seguimiento-ppi/' + bitacora.codigoEquipo);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                setSeguimiento(data);
            }
        };

        fetchData();
    }, [bitacora]);

    const cifrado = (numero) => {
        const converscrip = numero.toString();
        const encriptacion = CryptoJS.AES.encrypt(converscrip, claveSecreta).toString();
        return encriptacion;
    }

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className="pt-8 pb-8 w-full">
                <div className="md:h-auto lg:h-auto xl:h-auto sm:h-auto border-b-2 pl-8 pb-5 pr-5 sm:pr-52 flex flex-col sm:flex-row justify-between items-center">
                    <div className="mb-5 sm:mb-0">
                        <h1 className="text-4xl font-bold text-gray-600">{bitacora.nombre}</h1>
                    </div>
                    <div>
                        <span className="text-3xl text-gray-600 font-bold">Equipo:</span>
                        <span className="text-3xl text-gray-500 font-semibold ml-2">{bitacora.codigoEquipo}</span>
                    </div>
                </div><div className="p-10">
                    <div className="pb-5">
                        <span className="text-4xl font-bold text-gray-600">Estudiantes:</span>
                        <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                            {
                                Object.entries(estudiantes).map(([codigo, estudiantesArray]) => {
                                    if (bitacora.codigoEquipo == codigo) {
                                        return estudiantesArray.map(estudiante => {
                                            return (
                                                <React.Fragment key={estudiante.id}>
                                                    {estudiante.nombre} <br />
                                                </React.Fragment>
                                            );
                                        });
                                    } else {
                                        return null; // Retorna null si no se cumple la condición
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className="pb-5">
                        <span className="text-4xl font-bold text-gray-600">Descripción:</span>
                        <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                            {bitacora.descripcion}
                        </div>
                    </div>
                    <div className="pb-5">
                        <span className="text-4xl font-bold text-gray-600">Alcance:</span>
                        <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                            {bitacora.alcance}
                        </div>
                    </div>
                    <div className="pb-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <div className="pr-5">
                                <span className="text-4xl font-bold text-gray-600">Alcance Socialización 1:</span>
                                <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                    {bitacora.socializacionuno}
                                </div>
                            </div>
                            <div>
                                <span className="text-4xl font-bold text-gray-600">Alcance Socialización 2:</span>
                                <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                    {bitacora.socializaciondos}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full border-t border-gray-400">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Numero</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Fecha</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Compromisos</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Observaciones</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Asistencias</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {seguimiento.map((item, index) => {
                                    const asistencias = item.asistencia; 
                                    return (
                                        <tr key={item.id}>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">{item.id}</td>
                                            <td className="whitespace-nowrap px-4 py-2 text-center text-gray-700">{format(item.fecha, 'dd/MM/yyyy')}</td>
                                            <td className="whitespace-normal text-center px-4 py-2 text-gray-700">{item.compromiso} </td>
                                            <td className="whitespace-normal px-4 py-2 text-center text-gray-700">{item.observacion} </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700 text-center">{asistencias.map((item) => {
                                                if (item.asistencia == 1) return (<>
                                                    {item.nombre}<br />
                                                </>)
                                            })}</td>
                                            {item.compromiso == "" && new Date(item.fecha).getDate() == new Date("04/25/2024").getDate() ?
                                                (<td className="whitespace-normal px-4 py-2 text-center text-gray-700">
                                                    <a href={'/seguimientos/modificar/' + item.id + '/' + new Date(item.fecha).getDate()} className=' flex items-center justify-center'>
                                                        <div className='p-3 rounded-full bg-slate-600'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" className="w-6 h-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                            </svg>
                                                        </div>
                                                    </a>

                                                </td>) : (null)
                                            }


                                        </tr>
                                    )
                                })}


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default page