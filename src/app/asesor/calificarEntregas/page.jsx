"use client";
import React, { useState, useEffect } from 'react';
import './page.css';
import CountdownTimer from '@/app/utils/timer';

function Page() {
    const [grupos, setGrupos] = useState([]);
    const [equipos, setEquipos] = useState(new Set());
    const [ppiEntregaSOL, setPpiEntregaSOL] = useState([]);
    const [entregasMap, setEntregasMap] = useState(new Map());
    const [calificaciones, setCalificaciones] = useState(new Map());

    useEffect(() => {
        async function fetchEntregas() {
            try {
                const promises = [...equipos].map(async equipo => {
                    const response = await fetch(`https://td-g-production.up.railway.app/entrega-equipo-ppi/GetPPIEntregaByID/${equipo}`);
                    if (response.ok) {
                        const data = await response.json();
                        return { equipo, entregas: data };
                    } else {
                        console.error(`Error al obtener la entrega para el equipo ${equipo}`);
                        return { equipo, entregas: [] };
                    }
                });

                const entregas = await Promise.all(promises);
                const entregasMap = new Map(entregas.map(({ equipo, entregas }) => [equipo, entregas]));
                setEntregasMap(entregasMap);

                const calificacionesMap = new Map();
                entregas.forEach(({ entregas }) => {
                    entregas.forEach(entrega => {
                        calificacionesMap.set(`${entrega.Codigo_Equipo}-${entrega.Tipo_Entrega_ID}`, entrega.Calificacion_Entrega || ''); // Si la calificación es null, se asigna una cadena vacía
                    });
                });
                setCalificaciones(calificacionesMap);
            } catch (error) {
                console.error('Error al obtener las entregas:', error);
            }
        }

        fetchEntregas();
    }, [equipos]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/GetPPIEntregaAsesor');
                if (response.ok) {
                    const data = await response.json();
                    setPpiEntregaSOL(data);
                } else {
                    console.error('Error al obtener los datos');
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function buscarEquipos() {
            try {
                const response = await fetch(`https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups`);
                if (response.ok) {
                    const data = await response.json();
                    setGrupos(data);
                    setEquipos(new Set(data.map(equipo => equipo.Codigo_Equipo)));
                } else {
                    console.error('Error al obtener los equipos');
                }
            } catch (error) {
                console.error('Error al obtener los equipos:', error);
            }
        }

        buscarEquipos();
    }, []);

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Calificar Entregas</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div>
                        <p>Esta es la ventana de Calificar Entregas. Aquí podrás revisar y evaluar el trabajo que han entregado los equipos de tus grupos en todas las asignaturas que enseñas. Si ves una tabla vacía para algún grupo, significa que ninguno de los equipos ha entregado nada todavía. Recuerda calificar grupo por grupo para evitar inconsistencias.</p>
                        <p>Una vez hagas click en el botón de Guardar Notas, deberás esperar a que salga la alerta de confirmación de guardado.</p>
                    </div>
                    <br />
                    {ppiEntregaSOL.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Equipo
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Entrega
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Porcentaje
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Plazo para Calificar
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Archivos
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Calificación
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...equipos].map((equipo, index) => (
                                        <React.Fragment key={index}>
                                            {ppiEntregaSOL.map((entrega, entregaIndex) => {
                                                const fechaPlazo = new Date(entrega.Plazo_Calificacion);
                                                const fechaActual = new Date(); // Fecha y hora actual
                                                const fechaFormateada = fechaPlazo.toLocaleString('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

                                                // Verificar si el plazo para calificar ha pasado
                                                const plazoPasado = fechaActual > fechaPlazo;

                                                // Verificar si hay una entrega asociada al equipo actual
                                                const entregaEquipo = entregasMap.get(equipo);
                                                const tieneEntrega = entregaEquipo && entregaEquipo.find(entregaEquipo => entregaEquipo.Tipo_Entrega_Descripcion === entrega.Tipo_Entrega_Descripcion && entregaEquipo.Entrega_Equipo_PPI_ID !== null);

                                                // Si hay entrega, obtener la ubicación del adjunto
                                                const ubicacionAdjunto = tieneEntrega ? entregaEquipo.Ubicacion_Entrega : '';

                                                // Si la entrega ha sido cargada, mostrarla en la tabla
                                                if (tieneEntrega) {
                                                    return (
                                                        <tr key={`${index}-${entregaIndex}`} className={entregaIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{equipo}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{entrega.Tipo_Entrega_Descripcion}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{entrega.Porcentaje_Entrega}%</td>
                                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center ${plazoPasado ? 'text-red-500' : ''}`}>
                                                                {fechaFormateada}
                                                                {plazoPasado ? null : <CountdownTimer deadline={fechaPlazo} />}
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center flex justify-center items-center">
                                                                {/* Mostrar botón con logo SVG si hay entrega */}
                                                                {tieneEntrega && (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        width="24"
                                                                        height="24"
                                                                        color="#000000"
                                                                        fill="none"
                                                                        className="cursor-pointer"
                                                                        onClick={async () => {
                                                                            try {
                                                                                const response = await fetch(`https://td-g-production.up.railway.app/entrega-equipo-ppi/GetPPIEntregaByID/${equipo}`);
                                                                                if (response.ok) {
                                                                                    const data = await response.json();
                                                                                    const tipoEntregaActual = entrega.Tipo_Entrega_Descripcion; // CONFIGURACION Suponiendo que esta variable esté disponible en el alcance de esta función
                                                                                    const entregaEquipo = data.find(entrega =>
                                                                                        entrega.Codigo_Equipo === equipo &&
                                                                                        entrega.Tipo_Entrega_Descripcion === tipoEntregaActual
                                                                                    );
                                                                                    if (entregaEquipo && (entregaEquipo.Ubicacion_Entrega !== null && entregaEquipo.Ubicacion_Entrega !== '')) {
                                                                                        window.open(entregaEquipo.Ubicacion_Entrega, '_blank');
                                                                                    } else {
                                                                                        alert("Esta entrega no tiene un archivo adjunto.");
                                                                                    }
                                                                                } else {
                                                                                    console.error('Error al obtener las entregas para el equipo', equipo);
                                                                                }
                                                                            } catch (error) {
                                                                                console.error('Error al obtener las entregas para el equipo', equipo, error);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M12 21L12 13M12 21C11.2998 21 9.99153 19.0057 9.5 18.5M12 21C12.7002 21 14.0085 19.0057 14.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                                <input
                                                                    type="text"
                                                                    className={`border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-indigo-500 ${plazoPasado ? 'cursor-not-allowed' : ''}`}
                                                                    size="4"
                                                                    pattern="[0-5](,[0-9])?$"
                                                                    title="Debe ser un número entre 0 y 5, opcionalmente seguido de un decimal separado por coma."
                                                                    onKeyPress={(event) => {
                                                                        // Evita que se ingresen caracteres que no sean números, comas o el punto de decimal
                                                                        const allowedCharacters = /[0-9,]/;
                                                                        const key = event.key;
                                                                        if (!allowedCharacters.test(key)) {
                                                                            event.preventDefault();
                                                                        }
                                                                    }}
                                                                    // Desactivar la casilla si el plazo ha pasado
                                                                    disabled={plazoPasado}
                                                                    // Establecer el valor predeterminado de la casilla
                                                                    value={calificaciones.has(`${equipo}-${entrega.Tipo_Entrega_ID}`) ? calificaciones.get(`${equipo}-${entrega.Tipo_Entrega_ID}`).replace('.', ',') : ''}
                                                                    onChange={(event) => {
                                                                        // Actualizar la calificación en el estado mientras se edita
                                                                        const newValue = event.target.value.replace(',', '.');
                                                                        setCalificaciones(prevCalificaciones => {
                                                                            const newCalificaciones = new Map(prevCalificaciones);
                                                                            newCalificaciones.set(`${equipo}-${entrega.Tipo_Entrega_ID}`, newValue);
                                                                            return newCalificaciones;
                                                                        });
                                                                    }}
                                                                />

                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                                return null; // No hay entrega para este equipo y este tipo de entrega
                                            })}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                            <br />
                            {equipos.size !== 0 && (
                                <div>
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            const dataToSend = [];
                                            let isValid = true; // Variable para validar las calificaciones

                                            [...equipos].forEach(equipo => {
                                                ppiEntregaSOL.forEach(entrega => {
                                                    const entregaEquipo = entregasMap.get(equipo);
                                                    if (entregaEquipo) {
                                                        const entregaEnEquipo = entregaEquipo.find(entregaEquipo => entregaEquipo.Tipo_Entrega_Descripcion === entrega.Tipo_Entrega_Descripcion && entregaEquipo.Entrega_Equipo_PPI_ID !== null);
                                                        if (entregaEnEquipo) {
                                                            const calificacion = calificaciones.get(`${equipo}-${entrega.Tipo_Entrega_ID}`);
                                                            const calificacionNumerica = parseFloat(calificacion);

                                                            // Validar que la calificación esté entre 0 y 5
                                                            if (calificacion !== '' && (isNaN(calificacionNumerica) || calificacionNumerica < 0 || calificacionNumerica > 5)) {
                                                                isValid = false; // Marcar como inválido si no está en el rango
                                                            } else {
                                                                dataToSend.push({
                                                                    Entrega_Equipo_PPI_ID: entregaEnEquipo.Entrega_Equipo_PPI_ID,
                                                                    Calificacion: calificacion !== '' ? calificacionNumerica : null
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            });

                                            if (isValid) {
                                                // Si todas las calificaciones son válidas, enviar los datos
                                                fetch('https://td-g-production.up.railway.app/entrega-equipo-ppi/updateScores', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(dataToSend)
                                                })
                                                    .then(response => {
                                                        if (response.ok) {
                                                            alert('Calificaciones actualizadas correctamente.');
                                                            window.location.reload();
                                                        } else {
                                                            console.error('Error al enviar los datos al backend:', response.statusText);
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error('Error al enviar los datos al backend:', error);
                                                    });
                                            } else {
                                                // Mostrar mensaje de error si alguna calificación no es válida
                                                alert('Las calificaciones deben estar entre 0 y 5.');
                                            }
                                        }}
                                    >
                                        Guardar Notas
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Mostrar mensaje si no hay entregas para mostrar */}
                    {equipos.size === 0 && (
                        <p className="text-center mt-4 text-gray-500">No hay equipos disponibles para mostrar.</p>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Page;