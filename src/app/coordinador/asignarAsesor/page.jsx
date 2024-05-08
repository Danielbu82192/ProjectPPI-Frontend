"use client"
import React, { useState, useEffect } from 'react';
import './Page.css'; // Archivo CSS para estilos personalizados

function Page() {
    const [grupos, setGrupos] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [selectedAsesores, setSelectedAsesores] = useState({});
    const [asesoresFromEndpoint, setAsesoresFromEndpoint] = useState({});
    const [gruposAgrupados, setGruposAgrupados] = useState({});
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

        const obtenerAsesoresFromEndpoint = async () => {
            try {
                const responseAsesoresEndpoint = await fetch('https://td-g-production.up.railway.app/equipo-ppi-pjic/GetAllAsesores');
                if (!responseAsesoresEndpoint.ok) {
                    throw new Error('Error al obtener los asesores del endpoint');
                }
                const dataAsesoresEndpoint = await responseAsesoresEndpoint.json();
                setAsesoresFromEndpoint(dataAsesoresEndpoint);
            } catch (error) {
                console.error(error);
            }
        };

        obtenerGrupos();
        obtenerAsesores();
        obtenerAsesoresFromEndpoint();
    }, []);

    useEffect(() => {
        // Agrupar los usuarios por equipo cuando se actualicen los grupos
        const gruposAgrupadosTemp = agruparUsuariosPorEquipo(grupos);
        setGruposAgrupados(gruposAgrupadosTemp);
        // Establecer el valor seleccionado por defecto en el desplegable
        const defaultSelectedAsesores = {};
        Object.keys(gruposAgrupadosTemp).forEach(codigoEquipo => {
            defaultSelectedAsesores[codigoEquipo] = gruposAgrupadosTemp[codigoEquipo].asesor;
        });
        setSelectedAsesores(defaultSelectedAsesores);
    }, [grupos, asesoresFromEndpoint]);

    // Función para agrupar los usuarios por código de equipo
    const agruparUsuariosPorEquipo = (grupos) => {
        const gruposAgrupados = {};
        grupos.forEach(grupo => {
            if (!gruposAgrupados[grupo.Codigo_Equipo]) {
                gruposAgrupados[grupo.Codigo_Equipo] = {
                    usuarios: [],
                    asesor: obtenerAsesorActual(grupo.Codigo_Equipo)
                };
            }
            gruposAgrupados[grupo.Codigo_Equipo].usuarios.push(grupo.Usuario_Nombre);
        });
        return gruposAgrupados;
    };

    // Función para obtener el asesor actual o "Sin Asesor Asignado"
    const obtenerAsesorActual = (codigoEquipo) => {
        if (Array.isArray(asesoresFromEndpoint)) {
            const asesor = asesoresFromEndpoint.find(a => a.Codigo_Equipo === parseInt(codigoEquipo));
            if (asesor) {
                const asesorID = asesor.Usuario_ID;
                const asesorEncontrado = asesores.find(asesor => asesor.Usuario_ID === asesorID);
                return asesorEncontrado ? `${asesorEncontrado.Usuario_Nombre}` : 'Sin Asesor Asignado';
            }
        }
        return 'Sin Asesor Asignado';
    };

    // Define la función para enviar los datos a través de JSON al endpoint
    const guardarAsesores = async () => {
        try {
            const dataToSend = [];
            // Itera sobre los grupos agrupados para obtener los datos necesarios
            Object.keys(selectedAsesores).forEach(codigoEquipo => {
                const asesorSeleccionado = selectedAsesores[codigoEquipo];
                const usuario_id = asesores.find(asesor => asesor.Usuario_Nombre === asesorSeleccionado)?.Usuario_ID; // Obtiene el ID del asesor seleccionado
                if (usuario_id) {
                    dataToSend.push({ codigoEquipo, usuario_id });
                }
            });
            // Realiza la solicitud POST al endpoint con los datos recolectados
            const response = await fetch('https://td-g-production.up.railway.app/equipo-ppi-pjic/SaveAllAsesores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            if (!response.ok) {
                throw new Error('Error al guardar asesores');
            }
            // Si la solicitud es exitosa, muestra un mensaje de éxito o realiza alguna acción adicional si es necesario
            setShowSuccessPopup(true); // Mostrar el popup de éxito
            setTimeout(() => {
                setShowSuccessPopup(false); // Ocultar el popup después de 1300 ms
                window.location.reload(); // Recargar la página
            }, 1300);
        } catch (error) {
            console.error(error);
        }
    };

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
                        <p>A continuación, selecciona el asesor que le corresponde a cada uno de los grupos, y posteriormente oprime el botón &quot;Guardar Asesores&quot; para que se hagan efectivas las asignaciones.</p><br></br>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {Object.keys(gruposAgrupados).map((codigoEquipo, index) => (
                            <div key={index} className="m-4">
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <h2 className="text-xl font-bold mb-4 text-gray-600">Equipo {codigoEquipo} - {gruposAgrupados[codigoEquipo].asesor}</h2>
                                    <select
                                        value={selectedAsesores[codigoEquipo]}
                                        onChange={(e) => {
                                            setSelectedAsesores(prevState => ({
                                                ...prevState,
                                                [codigoEquipo]: e.target.value === 'Seleccionar Asesor' ? null : e.target.value
                                            }));
                                        }}
                                        className="bg-white border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500 w-full"
                                    >
                                        {gruposAgrupados[codigoEquipo].asesor === 'Sin Asesor Asignado' ? (
                                            <option value="Sin Asesor Asignado" disabled>Sin Asesor Asignado</option>
                                        ) : (
                                            <option value="" disabled hidden>Seleccionar Asesor</option>
                                        )}
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
                    {/* Botón Guardar Asesores */}
                    <div className="text-center mt-8">
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                            onClick={guardarAsesores}
                        >
                            Guardar Asesores
                        </button>
                    </div>
                    {/* Popup de éxito */}
                    {showSuccessPopup && (
                        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                                    ¡Carga Exitosa!
                                                </h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Los asesores se han asignado correctamente.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;
