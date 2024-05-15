"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./page.css"

function Page() {
    const [entregas, setEntregas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [teamMembers, setTeamMembers] = useState({});
    const [calificaciones, setCalificaciones] = useState({});
    const [notasDefinitivas, setNotasDefinitivas] = useState({});

    useEffect(() => {
        const fetchEntregas = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/tipo-entrega/GetAllEntregas');
                setEntregas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchEquipos = async () => {
            try {
                const response = await axios.get('https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups');
                // Agrupar los equipos por Codigo_Equipo
                const equiposAgrupados = response.data.reduce((acc, equipo) => {
                    if (!acc[equipo.Codigo_Equipo]) {
                        acc[equipo.Codigo_Equipo] = [];
                    }
                    acc[equipo.Codigo_Equipo].push(equipo.Usuario_Nombre);
                    return acc;
                }, {});
                setEquipos(equiposAgrupados);
                // Crear un objeto con los nombres de los miembros del equipo
                setTeamMembers(equiposAgrupados);

                // Obtener calificaciones de entrega para cada equipo
                const calificaciones = {};
                for (const codigoEquipo of Object.keys(equiposAgrupados)) {
                    const response = await axios.get(`https://td-g-production.up.railway.app/entrega-equipo-ppi/GetPPIEntregaByID/${codigoEquipo}`);
                    calificaciones[codigoEquipo] = response.data;
                }

                const notasDefinitivas = {};
                for (const codigoEquipo of Object.keys(calificaciones)) {
                    const entregasEquipo = calificaciones[codigoEquipo];
                    let notaDefinitivaTotal = 0; // Inicializar la nota definitiva total

                    entregasEquipo.forEach(entrega => {
                        const calificacion = entrega.Calificacion_Entrega !== null ? parseFloat(entrega.Calificacion_Entrega) : 0.0; // Verificar si la calificación es null
                        const porcentaje = entrega.Porcentaje_Entrega / 100;
                        const notaParcial = calificacion * porcentaje;
                        notaDefinitivaTotal += notaParcial;
                    });

                    notasDefinitivas[codigoEquipo] = notaDefinitivaTotal.toFixed(2); // Asignar la nota definitiva total
                }
                setCalificaciones(calificaciones);
                setNotasDefinitivas(notasDefinitivas);

                if (window.innerWidth <= 768) {
                    alert("Para visualizar esta tabla de notas en móvil, tendrás que desplazarte de manera horizontal dentro de la tabla. Te recomendamos visitar esta sección desde un computador para mayor comodidad");
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEntregas();
        fetchEquipos();
    }, []);

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Ver Notas</h1>
                    </div>
                </div>
                <div className='p-4'>
                    <div className="table-wrapper overflow-x-auto table-responsive">
                        <div className="table-scroll">
                            <table className="min-w-full min-h-full bg-white shadow-md rounded">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-2 py-1">Equipo</th>
                                        {entregas.map(entrega => (
                                            <th key={entrega.id} className="border border-gray-300 px-2 py-1.5 w-38">{entrega.nombre}</th>
                                        ))}
                                        <th className="border border-gray-300 px-2 py-1 w-38">Nota Definitiva PPI</th> {/* Nueva columna */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(teamMembers).map(([codigoEquipo, members], index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {codigoEquipo}
                                                <br /><br />
                                                {members.map((member, idx) => (
                                                    <div key={idx} className="ml-2 text-xs text-left">
                                                        • {member}
                                                    </div>
                                                ))}
                                            </td>
                                            {entregas.map(entrega => (
                                                <td key={entrega.id} className="border border-gray-300 px-4 py-2 w-38">
                                                    {/* Buscar la calificación de la entrega en el objeto de calificaciones */}
                                                    {calificaciones[codigoEquipo] && calificaciones[codigoEquipo].find(item => item.Tipo_Entrega_Descripcion === entrega.nombre) ? (
                                                        <>
                                                            {calificaciones[codigoEquipo].find(item => item.Tipo_Entrega_Descripcion === entrega.nombre).Calificacion_Entrega !== null ? (
                                                                <>
                                                                    {calificaciones[codigoEquipo].find(item => item.Tipo_Entrega_Descripcion === entrega.nombre).Calificacion_Entrega}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Sin nota por ahora
                                                                </>
                                                            )}
                                                            {calificaciones[codigoEquipo].find(item => item.Tipo_Entrega_Descripcion === entrega.nombre).Ubicacion_Entrega ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    width="24"
                                                                    height="24"
                                                                    color="#000000"
                                                                    fill="none"
                                                                    style={{ cursor: 'pointer', marginTop: '5px', marginLeft: '20px' }}
                                                                    onClick={() => {
                                                                        const ubicacion = calificaciones[codigoEquipo].find(item => item.Tipo_Entrega_Descripcion === entrega.nombre).Ubicacion_Entrega;
                                                                        window.location.href = ubicacion;
                                                                    }}
                                                                >
                                                                    <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M12 21L12 13M12 21C11.2998 21 9.99153 19.0057 9.5 18.5M12 21C12.7002 21 14.0085 19.0057 14.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            ) : null}
                                                        </>
                                                    ) : (
                                                        <>
                                                            0.0
                                                        </>
                                                    )}

                                                </td>
                                            ))}
                                            <td className="border border-gray-300 px-4 py-2 w-38">
                                                {notasDefinitivas[codigoEquipo]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
