"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import './css/style.css'
import CryptoJS from 'crypto-js';

function miBitacora() {

    const [bitacora, setBitacora] = useState([])
    const [estudiantes, setEstudiantes] = useState([])
    const [asistencia, setAsistencia] = useState([])
    const [seguimiento, setSeguimiento] = useState([])
    const [usuario, setUsuario] = useState([])

    useEffect(() => {
        const traerBitacora = async () => {
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            setUsuario(usuarioN)
            const response = await fetch(`http://localhost:3002/equipo-usuarios/EstudiantesBitacora/${usuarioN.correo}/${usuarioN.clave}`);
            if (response.ok) {
                const data = await response.json()
                setBitacora(data)

            }
        }
        traerBitacora();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const response2 = await fetch('http://localhost:3002/equipo-usuarios/Estudiantes');
            const data2 = await response2.json();
            if (response2.ok) {
                setEstudiantes(data2);
                const response = await fetch('http://localhost:3002/seguimiento-ppi/' + bitacora.codigoEquipo);
                const data = await response.json();
                if (response.ok) {
                    setSeguimiento(data);
                    const asistenciaPromises = [];
                    data.forEach(element => {
                        for (let index = 1; index <= 3; index++) {
                            const name1 = "estudiante" + index;
                            const name2 = "asistenciaEstudiante" + index;
                            if (element[name1] != null) {
                                asistenciaPromises.push(
                                    fetch('http://localhost:3002/usuario/' + element[name1])
                                        .then(response => response.json())
                                        .then(data2 => [data2, element[name2]])
                                );
                            }
                        }
                    });
                    const asistenciaData = await Promise.all(asistenciaPromises);
                    setAsistencia(asistenciaData);
                }
            }
        };



        fetchData();
    }, [bitacora]);

    return (
        <div>


            <details class="w-full bg-white   border-t-2 border-b-2 mt-5 font-semibold text-xl text-gray-600 border-gray-600  mb-3">
                <summary class="w-full bg-white text-dark flex justify-between px-4 py-3  cursor-pointer">Encabezado</summary><div className="p-10">
                    <div className="pb-5">
                        <span className="text-2xl font-bold text-gray-600">Estudiantes:</span>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <div>
                                <span className="text-2xl font-bold text-gray-600">Descripción:</span>
                                <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                    {bitacora.descripcion}
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gray-600">Alcance:</span>
                                <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                    {bitacora.alcance}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pb-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <div className="pr-5">
                                <span className="text-2xl font-bold text-gray-600">Alcance Socialización 1:</span>
                                <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                    {bitacora.socializacionuno}
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-gray-600">Alcance Socialización 2:</span>
                                <div className="ml-5 sm:ml-10 mt-2 text-xl text-gray-400">
                                    {bitacora.socializaciondos}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
            <details class="w-full bg-white  border-t-2 border-b-2 mt-5 font-semibold text-xl text-gray-600 border-gray-600  mb-3">
                <summary class="w-full bg-white text-dark flex justify-between px-4 py-3 cursor-pointer">Asesorías</summary>
                <div className="w-full border-t border-gray-400">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Número    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Fecha</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Compromisos</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Observaciones</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600">Asistencias</th>
                                    <th className="whitespace-nowrap px-4 py-2 font-blod text-gray-600"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {seguimiento.map((item, index) => {
                                    const estados = item.estados
                                    console.log(item.estados)
                                    estados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                                    return (
                                        <tr key={item.id}>
                                            <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-400">{item.id}</td>
                                            <td className="whitespace-nowrap px-4 py-2 font-semibold text-center text-gray-400">{format(item.citas.fecha, 'MMMM dd', { locale: es })}</td>
                                            <td className="whitespace-normal text-center font-semibold px-4 py-2 text-gray-400">{item.compromiso} </td>
                                            <td className="whitespace-normal px-4 py-2 font-semibold text-center text-gray-400">{item.observacion} </td>
                                            <td className="whitespace-nowrap px-4 py-2 font-semibold text-gray-400 text-center">{
                                                asistencia.map((item) => {
                                                    if (item[1] == 1) {
                                                        return (
                                                            <>{item[0].nombre}<br /></>
                                                        )
                                                    }
                                                })
                                            }
                                            </td><td className="whitespace-normal px-4 py-2 text-center flex text-gray-700">
                                                <a href={'/component/seguimientos/visualizar/' + item.id} className=' flex items-center justify-center'>
                                                    <div className='p-3 rounded-full bg-gray-600'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                                                            <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
                                                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                                                        </svg>

                                                    </div>
                                                </a>

                                            </td>

                                        </tr>
                                    )
                                })}


                            </tbody>
                        </table>
                    </div>
                </div>
            </details>



        </div>
    )
}

export default miBitacora