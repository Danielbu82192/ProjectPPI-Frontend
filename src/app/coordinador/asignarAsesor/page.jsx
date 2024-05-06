"use client"
import React, { useState, useEffect } from 'react';
import './Page.css'; // Archivo CSS para estilos personalizados

function Page() {
    const [grupos, setGrupos] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [selectedAsesores, setSelectedAsesores] = useState({});

    useEffect(() => {
        const obtenerGrupos = async () => {
            try {
                const responseGrupos = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups');
                if (!responseGrupos.ok) {
                    throw new Error('Error al obtener los grupos');
                }
                const dataGrupos = await responseGrupos.json();
                setGrupos(dataGrupos);
            } catch (error) {
                console.error(error);
            }
        };

        const obtenerAsesores = async () => {
            try {
                const responseAsesores = await fetch('https://td-g-production.up.railway.app/usuario/GetAsesor');
                if (!responseAsesores.ok) {
                    throw new Error('Error al obtener los asesores');
                }
                const dataAsesores = await responseAsesores.json();
                setAsesores(dataAsesores);
            } catch (error) {
                console.error(error);
            }
        };

        obtenerGrupos();
        obtenerAsesores();
    }, []);

    // Función para agrupar los usuarios por código de equipo
    const agruparUsuariosPorEquipo = (grupos) => {
        const gruposAgrupados = {};
        grupos.forEach(grupo => {
            if (!gruposAgrupados[grupo.Codigo_Equipo]) {
                gruposAgrupados[grupo.Codigo_Equipo] = {
                    usuarios: [],
                    asesor: selectedAsesores[grupo.Codigo_Equipo] || ''
                };
            }
            gruposAgrupados[grupo.Codigo_Equipo].usuarios.push(grupo.Usuario_Nombre);
        });
        return gruposAgrupados;
    };

    const gruposAgrupados = agruparUsuariosPorEquipo(grupos);

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Asignar Asesor</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className="mt-5">
                        <p>AQUI DEBE IR EL TEXTO DONDE DIGA QUE PONGA LOS USUARIOS A CADA GRUPO</p><br></br>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {Object.keys(gruposAgrupados).map((codigoEquipo, index) => (
                            <div key={index} className="m-4">
                                <div className="bg-white shadow-lg rounded-lg p-6 h-[300px]"> {/* Ajustamos la altura de la tarjeta */}
                                    <h2 className="text-xl font-bold mb-4 text-gray-600">Equipo {codigoEquipo}</h2>
                                    <select
                                        value={gruposAgrupados[codigoEquipo].asesor}
                                        onChange={(e) => {
                                            setSelectedAsesores(prevState => ({
                                                ...prevState,
                                                [codigoEquipo]: e.target.value
                                            }));
                                        }}
                                        className="bg-white border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500 w-full"
                                    >
                                        <option value="" disabled hidden>Seleccionar Asesor</option>
                                        {asesores.map((asesor, index) => (
                                            <option key={index} value={asesor.Usuario_Nombre}>{asesor.Usuario_Nombre}</option>
                                        ))}
                                    </select>
                                    <ul className="text-gray-700 mt-4">
                                        {gruposAgrupados[codigoEquipo].usuarios.map((usuario, index) => (
                                            <li key={index}>
                                                <span className="rounded-full h-2 w-2 bg-green-500 inline-block mr-2"></span>
                                                {usuario}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
