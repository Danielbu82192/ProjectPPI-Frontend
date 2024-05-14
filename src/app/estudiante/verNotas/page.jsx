"use client";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import './Page.css';

function Page() {
    const [equipoUsuarios, setEquipoUsuarios] = useState([]);
    const [bitacora, setBitacora] = useState([]);
    const [entregaSettings, setEntregaSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [entregaByID, setEntregaByID] = useState([]);

    useEffect(() => {
        moment.locale('es');
    }, []);

    useEffect(() => {
        const fetchEquipoUsuarios = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetGroupById/57660');
                if (response.ok) {
                    const data = await response.json();
                    setEquipoUsuarios(data);
                } else {
                    setEquipoUsuarios([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching equipo usuarios:', error);
                setLoading(false);
            }
        };

        fetchEquipoUsuarios();
    }, []);

    useEffect(() => {
        if (equipoUsuarios.length > 0) {
            const fetchBitacora = async () => {
                try {
                    const codigoEquipo = equipoUsuarios[0].Codigo_Equipo;
                    const response = await fetch(`https://td-g-production.up.railway.app/equipo-ppi/GetBitacoraByCode/${codigoEquipo}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.length > 0) {
                            const bitacoraPpiId = data[0].Bitacora_PPI_ID;
                            setBitacora(data);
                        } else {
                            setBitacora([]);
                        }
                    } else {
                        setBitacora([]);
                    }
                } catch (error) {
                    console.error('Error fetching bitacora:', error);
                }
            };

            fetchBitacora();
        }
    }, [equipoUsuarios]);

    useEffect(() => {
        const fetchEntregaSettings = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/configuracion-entrega/AllEntregaSettings');
                if (response.ok) {
                    const data = await response.json();
                    const newData = data.map((item, index) => ({ ...item, configuracionEntregaId: item.Configuracion_Entrega_ID }));
                    setEntregaSettings(newData);
                } else {
                    setEntregaSettings([]);
                }
            } catch (error) {
                console.error('Error fetching entrega settings:', error);
            }
        };

        fetchEntregaSettings();
    }, []);

    useEffect(() => {
        const fetchEntregaByID = async () => {
            try {
                const codigoEquipo = equipoUsuarios[0].Codigo_Equipo;
                const response = await fetch(`https://td-g-production.up.railway.app/entrega-equipo-ppi/GetPPIEntregaByID/${codigoEquipo}`);
                if (response.ok) {
                    const data = await response.json();
                    setEntregaByID(data);
                } else {
                    setEntregaByID([]);
                }
            } catch (error) {
                console.error('Error fetching entrega by ID:', error);
            }
        };

        if (equipoUsuarios.length > 0) {
            fetchEntregaByID();
        }
    }, [equipoUsuarios]);

    const isEntregado = (nombreEntrega) => {
        return entregaByID.some(entrega => entrega.Tipo_Entrega_Descripcion === nombreEntrega);
    };

    const sumaMultiplicaciones = entregaSettings.reduce((accumulator, setting) => {
        const calificacion = entregaByID.find(entrega => entrega.Tipo_Entrega_Descripcion === setting.nombre)?.Calificacion_Entrega;
        if (calificacion !== undefined) {
            const porcentajeDecimal = setting.porcentaje / 100;
            accumulator += calificacion * porcentajeDecimal;
        }
        return accumulator;
    }, 0);

    const getIconoCalificacion = (calificacion) => {
        if (calificacion && calificacion !== '-') {
            return calificacion < 3 ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#d0021b" fill="none">
                    <path d="M19.0005 4.99988L5.00045 18.9999M5.00045 4.99988L19.0005 18.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#7ed321" fill="none">
                    <path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>;
        } else {
            return null;
        }
    };

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Ver Notas</h1>
                    </div>
                </div>
                <div className='p-10'>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <div>
                            {equipoUsuarios.length === 0 ? (
                                <p>Ups! No tienes un equipo asociado para este semestre, si consideras que es un error, comunícate de inmediato con el Coordinador del PPI.</p>
                            ) : (
                                <div>
                                    {bitacora.length === 0 ? (
                                        <p>No tienes bitácora todavía.</p>
                                    ) : (
                                        <div>
                                            {equipoUsuarios.map(usuario => (
                                                <h2 className="text-lg font-medium text-gray-700" key={usuario.Codigo_Equipo}>Equipo {usuario.Codigo_Equipo}</h2>
                                            ))}
                                            <br />
                                            <ul>
                                                {bitacora.map(item => (
                                                    <li key={item.Codigo_Equipo}>
                                                        <p>Alias: {item.Alias_Proyecto}</p>
                                                        <p>Descripción: {item.Descripcion_Proyecto}</p>
                                                        <p>Alcance: {item.Alcance_Proyecto}</p>
                                                        <p>Alcance Socialización 1: {item.Alcance_Socializacion_Uno}</p>
                                                        <p>Alcance Socialización 2: {item.Alcance_Socializacion_Dos}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div>
                                {entregaSettings.length === 0 ? (
                                    <p>El coordinador no ha configurado las entregas, intenta después.</p>
                                ) : (
                                    <div>
                                        <br />
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Porcentaje</th>
                                                    <th className="calificacion-header">Calificación</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entregaSettings.map(setting => (
                                                    <tr key={setting.id}>
                                                        <td>{setting.nombre}</td>
                                                        <td>{setting.porcentaje}%</td>
                                                        <td className="calificacion-container">
                                                            {getIconoCalificacion(entregaByID.find(entrega => entrega.Tipo_Entrega_Descripcion === setting.nombre)?.Calificacion_Entrega)}
                                                            {' '}
                                                            <span>
                                                                {entregaByID.find(entrega => entrega.Tipo_Entrega_Descripcion === setting.nombre)?.Calificacion_Entrega || '-'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}

                                                <tr>
                                                    <td><b>Nota Definitiva PPI</b></td>
                                                    <td><b>100%</b></td>
                                                    <td className="nota-container">
                                                        {getIconoCalificacion(sumaMultiplicaciones)}
                                                        {' '}
                                                        <span>
                                                            <b>{sumaMultiplicaciones.toFixed(2)}</b>
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;
