"use client";
import React, { useState, useEffect } from 'react';
import './page.css';
import CountdownTimer from '@/app/utils/timer';

function Page() {
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturasUnicas, setAsignaturasUnicas] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [equipos, setEquipos] = useState(new Set());
    const [ppiEntregaSOL, setPpiEntregaSOL] = useState([]);
    const [entregasMap, setEntregasMap] = useState(new Map());
    const [calificaciones, setCalificaciones] = useState(new Map());
    const [equiposConNotas, setEquiposConNotas] = useState([]); // Estado para almacenar los equipos y sus notas
    const [usuarios, setUsuarios] = useState({}); // Estado para almacenar los usuarios

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
                const response = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/GetPPIEntregaCoordinador');
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
        async function fetchAsignaturas() {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/usuario-asignatura/GroupsDocente/57642');
                if (response.ok) {
                    const data = await response.json();
                    setAsignaturas(data);
                    const nombresUnicos = [...new Set(data.map(asignatura => asignatura.Asignatura_Nombre))];
                    setAsignaturasUnicas(nombresUnicos);
                } else {
                    console.error('Error al obtener las asignaturas');
                }
            } catch (error) {
                console.error('Error al obtener las asignaturas:', error);
            }
        }

        fetchAsignaturas();

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

        fetchUsuarios();
    }, []);


    useEffect(() => {
        async function buscarEquipos() {
            try {
                const response = await fetch(`https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups`);
                if (response.ok) {
                    const data = await response.json();
                    setGrupos(data);
                    setEquipos(new Set(data.map(equipo => equipo.Codigo_Equipo)));
                    const equiposAgrupados = data.reduce((acc, equipo) => {
                        if (!acc[equipo.Codigo_Equipo]) {
                            acc[equipo.Codigo_Equipo] = [];
                        }
                        acc[equipo.Codigo_Equipo].push(equipo);
                        return acc;
                    } , {});
                    console.log('equiposAgrupados', equiposAgrupados);
                    const equiposConNotas = Object.entries(equiposAgrupados).map(([equipo, integrantes]) => {
                        const notas = integrantes.map(integrante => integrante.Nota);
                        return [equipo, notas];
                    });
                    setEquiposConNotas(equiposConNotas);
                } else {
                    console.error('Error al obtener los equipos');
                }
            } catch (error) {
                console.error('Error al obtener los equipos:', error);
            }
        }

        buscarEquipos();
    }, []);

    /* console.log('equipos', ...equipos);
    console.log('ppiEntregaSOL', ppiEntregaSOL);
    console.log('calificaciones', calificaciones);
    
    console.log('entregasMap', entregasMap); */

    /* Agrupar por equipo con integrantes y entregas:
        const equiposAgrupados: {
        100: [
            {
                "Codigo_Equipo": 100,
                "Usuario_Nombre": "DANIEL BUSTAMANTE CASTRO",
                "Grupo_Codigo": 63,
                "Asignatura_Nombre": "Desarrollo del Pensamiento Analítico y Sistémico 1",
                "Asignatura_Semestre": 1,
                "Nota_Asesoria_Definitiva_Individual": null,
                "Usuario_ID": 61601
            },
            {
                "Codigo_Equipo": 100,
                "Usuario_Nombre": "AGUDELO MARIN JULIAN DAVID",
                "Grupo_Codigo": 62,
                "Asignatura_Nombre": "Desarrollo del Pensamiento Analítico y Sistémico 1",
                "Asignatura_Semestre": 1,
                "Nota_Asesoria_Definitiva_Individual": null,
                "Usuario_ID": 61566
            },
            {
                "Codigo_Equipo": 100,
                "Usuario_Nombre": "MESA JARAMILLO JOSEPH JOSEPH",
                "Grupo_Codigo": 62,
                "Asignatura_Nombre": "Desarrollo del Pensamiento Analítico y Sistémico 1",
                "Asignatura_Semestre": 1,
                "Nota_Asesoria_Definitiva_Individual": null,
                "Usuario_ID": 61574
            }
        ],
        101: [
            {
                "Codigo_Equipo": 101,
                "Usuario_Nombre": "HINCAPIE VILLADA SANTIAGO",
                "Grupo_Codigo": 62,
                "Asignatura_Nombre": "Desarrollo del Pensamiento Analítico y Sistémico 1",
                "Asignatura_Semestre": 1,
                "Nota_Asesoria_Definitiva_Individual": null,
                "Usuario_ID": 61561
            }
        ]
    }
    */

    const equiposAgrupados = grupos.reduce((acc, equipo) => {
        if (!acc[equipo.Codigo_Equipo]) {
            acc[equipo.Codigo_Equipo] = [];
        }
        acc[equipo.Codigo_Equipo].push(equipo);
        return acc;
    } , {});
    // console.log('equiposAgrupados', equiposAgrupados);

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Calificar Entregas</h1>
                    </div>
                </div>
                <div className='p-5'>
                    <div>
                        {/*<p>Esta es la ventana de Calificar Entregas. Aquí podrás revisar y evaluar el trabajo que han entregado los equipos de tus grupos en todas las asignaturas que enseñas. Si ves una tabla vacía para algún grupo, significa que ninguno de los equipos ha entregado nada todavía. Recuerda calificar grupo por grupo para evitar inconsistencias.</p>
                        <p>Una vez hagas click en el botón de Guardar Notas, deberás esperar a que salga la alerta de confirmación de guardado.</p>*/}
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
                                            Nombre
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(equiposAgrupados).forEach(([codigoEquipo, integrantes]) => {
                                        <React.Fragment key={codigoEquipo}>
                                            {integrantes.map((integrante, idx) => {
                                                const usuario = usuarios[integrante.Usuario_ID];
                                                console.log('usuario', usuario);
                                                console.log(`integrandte ${idx}`, integrante.Usuario_Nombre);
                                                return (
                                                    <tr key={idx}>
                                                        {idx === 0 && (
                                                            <td
                                                                className="border border-gray-300 text-sm px-4 py-2 font-bold cursor-pointer"
                                                                rowSpan={integrantes.length}
                                                            >
                                                                {codigoEquipo}
                                                            </td>
                                                        )}
                                                        <td className="border border-gray-300 text-sm px-4 py-2">{integrante.Usuario_Nombre}</td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    })}
                                </tbody>
                            </table>
                            <br />
                            {equipos.size !== 0 && (
                                <div>
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            const dataToSend = [];

                                            let valid = true; // Variable para controlar si las calificaciones son válidas

                                            [...equipos].forEach(equipo => {
                                                ppiEntregaSOL.forEach(entrega => {
                                                    const entregaEquipo = entregasMap.get(equipo);
                                                    if (entregaEquipo) {
                                                        const entregaEnEquipo = entregaEquipo.find(entregaEquipo => entregaEquipo.Tipo_Entrega_Descripcion === entrega.Tipo_Entrega_Descripcion && entregaEquipo.Entrega_Equipo_PPI_ID !== null);
                                                        if (entregaEnEquipo) {
                                                            const calificacion = calificaciones.get(`${equipo}-${entrega.Tipo_Entrega_ID}`);

                                                            // Validación de la calificación
                                                            if (calificacion !== '') {
                                                                const parsedCalificacion = parseFloat(calificacion);
                                                                if (parsedCalificacion >= 0 && parsedCalificacion <= 5) {
                                                                    dataToSend.push({
                                                                        Entrega_Equipo_PPI_ID: entregaEnEquipo.Entrega_Equipo_PPI_ID,
                                                                        Calificacion: parsedCalificacion
                                                                    });
                                                                } else {
                                                                    // Si la calificación está fuera del rango, marcamos como inválido y mostramos un mensaje
                                                                    valid = false;
                                                                    alert('Por favor, asegúrate de que todas las calificaciones estén entre 0 y 5.');
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            });

                                            if (valid) {
                                                // Si todas las calificaciones son válidas, realizamos la solicitud fetch
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
