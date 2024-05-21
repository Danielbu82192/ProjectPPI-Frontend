"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { FiArrowLeft } from "react-icons/fi";

function Page() {
    const [equiposConNotas, setEquiposConNotas] = useState([]); // Estado para almacenar los equipos y sus notas
    const [selectedEquipo, setSelectedEquipo] = useState(null); // Estado para el equipo seleccionado
    const [usuarios, setUsuarios] = useState({}); // Estado para almacenar los usuarios
    const [entregas, setEntregas] = useState([]); // Estado para almacenar los tipos de entrega
    const ReactHTMLTableToExcel = dynamic(() => import('react-html-table-to-excel'), { ssr: false }); // Cargar dinámicamente la librería para exportar a Excel

    // useEffect para cargar los datos de usuarios, equipos y entregas al montar el componente
    useEffect(() => {
        // Función para obtener los usuarios
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/usuario');
                const usuariosMap = {};
                response.data.forEach(usuario => {
                    usuariosMap[usuario.id] = usuario;
                });
                setUsuarios(usuariosMap);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // Función para obtener los equipos y sus notas
        const fetchEquipos = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups');
                const equiposAgrupados = response.data.reduce((acc, equipo) => {
                    if (!acc[equipo.Codigo_Equipo]) {
                        acc[equipo.Codigo_Equipo] = [];
                    }
                    acc[equipo.Codigo_Equipo].push(equipo);
                    return acc;
                }, {});
                setEquiposConNotas(equiposAgrupados);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Función para obtener los tipos de entrega
        const fetchEntregas = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/tipo-entrega/GetAllEntregas');
                setEntregas(response.data);
            } catch (error) {
                console.error('Error fetching entregas:', error);
            }
        };

        fetchUsuarios(); // Llamar la función para obtener usuarios
        fetchEquipos(); // Llamar la función para obtener equipos
        fetchEntregas(); // Llamar la función para obtener tipos de entrega
    }, []);

    // Obtener el nombre del archivo de Excel basado en el año y semestre actuales
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semester = currentMonth >= 1 && currentMonth <= 6 ? 1 : 2;
    const fileName = `Notas PPI ${currentYear} - ${semester}`;

    // Función para manejar el click en un equipo
    const handleEquipoClick = (codigoEquipo) => {
        const equipoSeleccionado = equiposConNotas[codigoEquipo];
        setSelectedEquipo(equipoSeleccionado);
    };

    // Función para hacer capitalize a una cadena
    const capitalize = (str) => {
        const str2 = str.toLowerCase();
        return str2.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    console.log('equiposConNotas:', equiposConNotas);

    return (
        <div className="ml-2 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Tabla de notas</h1>
                    </div>
                </div>
                <br />
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button"
                        table="tabla-notas"
                        filename={fileName}
                        sheet={fileName}
                        buttonText="Exportar a Excel"
                    />
                </button>
                <div className='p-4'>
                    <div className="table-wrapper overflow-x-auto table-responsive">
                        <div className="table-scroll">
                            <table id="tabla-notas" className="min-w-full min-h-full bg-white shadow-md rounded">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 text-sm px-2 py-1">Equipo</th>
                                        <th className="border border-gray-300 text-sm px-2 py-1">Cédula</th>
                                        {entregas.map((entrega) => (
                                            <th key={entrega.id} className="border text-sm border-gray-300 px-2 py-1">
                                                {entrega.nombre} {entrega.Porcentaje_Entrega}%
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(equiposConNotas).map(([codigoEquipo, integrantes]) => (
                                        <React.Fragment key={codigoEquipo}>
                                            {integrantes.map((integrante, idx) => {
                                                const usuario = usuarios[integrante.Usuario_ID];
                                                return (
                                                    <tr key={idx}>
                                                        {idx === 0 && (
                                                            <td
                                                                className="border border-gray-300 text-sm px-4 py-2 font-bold cursor-pointer"
                                                                rowSpan={integrantes.length}
                                                                onClick={() => handleEquipoClick(codigoEquipo)}
                                                            >
                                                                {codigoEquipo}
                                                            </td>
                                                        )}
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{usuario?.documento}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Pitch}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Cuadrante1}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Cuadrante2}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Socializacion1}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Cuadrante3}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Cuadrante4}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Socializacion2}</td>
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Asesorias}</td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {selectedEquipo && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-md w-full max-w-3xl">
                            <h2 className="text-xl font-bold mb-4">Detalles del Equipo</h2>
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Cédula</th>
                                        <th className="border px-4 py-2">Nombre</th>
                                        <th className="border px-4 py-2">Correo</th>
                                        <th className="border px-4 py-2">Grupo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedEquipo.map((integrante, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-4 py-2">{usuarios[integrante.Usuario_ID]?.documento}</td>
                                            <td className="border px-4 py-2">{capitalize(usuarios[integrante.Usuario_ID]?.nombre)}</td>
                                            <td className="border px-4 py-2">{usuarios[integrante.Usuario_ID]?.correo}</td>
                                            <td className="border px-4 py-2">{integrante.Grupo_Codigo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setSelectedEquipo(null)}
                            >
                                <FiArrowLeft className="inline-block mr-2" />
                                Volver
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Page;
