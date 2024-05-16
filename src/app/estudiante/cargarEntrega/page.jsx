"use client";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import 'moment/locale/es';
import './Page.css';
import { uploadFileToS3, createFolderInS3 } from '@/app/utils/awsS3';

function Page() {
    const [equipoUsuarios, setEquipoUsuarios] = useState([]);
    const [bitacora, setBitacora] = useState([]);
    const [entregaSettings, setEntregaSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [entregaByID, setEntregaByID] = useState([]);

    useEffect(() => {
        moment.locale('es');
    }, []);

    useEffect(() => {
        const fetchEquipoUsuarios = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetGroupById/57661');
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
                    // Excluir el tipo de entrega con ID 8
                    const filteredData = newData.filter(item => item.id !== 8);
                    setEntregaSettings(filteredData);
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

    const handleFileChange = (event, entregaId, nombreEntrega) => {
        if (!isEntregado(nombreEntrega)) {
            setSelectedFiles(prevState => ({
                ...prevState,
                [entregaId]: event.target.files[0]
            }));
        }
    };

    const handleFileUpload = async (entregaId, nombreEntrega, configuracionEntregaId, bitacoraPpiId) => {
        try {
            const codigoEquipo = bitacora[0].Codigo_Equipo;
            const primerNumeroCodigoEquipo = parseInt(codigoEquipo.toString()[0]);
            let rutaDestinoS3 = '';
            switch (primerNumeroCodigoEquipo) {
                case 1:
                case 2:
                case 3:
                case 4:
                    rutaDestinoS3 = `PPI/Tecnica/S${primerNumeroCodigoEquipo}/`;
                    break;
                case 5:
                case 6:
                    rutaDestinoS3 = `PPI/Tecnologia/S${primerNumeroCodigoEquipo}/`;
                    break;
                default:
                    throw new Error('El código de equipo no es válido.');
            }
            await createFolderInS3(`${rutaDestinoS3}${codigoEquipo}`);
            const fileName = selectedFiles[entregaId].name;
            const fileExtension = fileName.split('.').pop();
            const uploadedFileData = await uploadFileToS3(selectedFiles[entregaId], rutaDestinoS3 + codigoEquipo, `${nombreEntrega} - Equipo ${codigoEquipo}.${fileExtension}`);
            await axios.post('https://td-g-production.up.railway.app/entrega-equipo-ppi/UploadPPIEntregaFile', {
                ubicacion: uploadedFileData.Location,
                bitacoraPpiId,
                configuracionEntregaId,
            });
            alert(
                "¡Archivo subido exitosamente para su calificación!"
            );
            location.reload();
        } catch (error) {
            console.error('Error en la carga de archivos:', error);
        }
    };

    const formatDate = (dateString) => {
        const formattedDate = moment.utc(dateString).utcOffset(-5).format('DD-MM-YYYY HH:mm A');
        return formattedDate;
    };

    const determineStatus = (fechaEntrega) => {
        const fechaEntregaUTC5 = moment.utc(fechaEntrega).utcOffset(-5);
        const fechaActualUTC5 = moment().utcOffset(-5);
        if (fechaActualUTC5.isBefore(fechaEntregaUTC5)) {
            return "A Tiempo";
        } else {
            return "Plazo Vencido";
        }
    };

    const getStatusStyle = (status) => {
        return status === 'A Tiempo' ? 'green' : 'red';
    };

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Cargar Entregas</h1>
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
                                                    <th>Fecha de Entrega</th>
                                                    <th>Estado</th>
                                                    <th>Adjuntos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entregaSettings.map(setting => (
                                                    <tr key={setting.id}>
                                                        <td>{setting.nombre}</td>
                                                        <td>{setting.porcentaje}</td>
                                                        <td>{formatDate(setting.fechaentrega)}</td>
                                                        <td className={`status-${getStatusStyle(determineStatus(setting.fechaentrega))}`}>
                                                            {entregaByID.some(entrega => entrega.Tipo_Entrega_Descripcion === setting.nombre) ? <span className="status-blue">Entregado</span> : determineStatus(setting.fechaentrega)}
                                                        </td>

                                                        <td className="text-center">
                                                            {isEntregado(setting.nombre) ? (
                                                                <button onClick={() => {
                                                                    const ubicacion = entregaByID.find(entrega => entrega.Tipo_Entrega_Descripcion === setting.nombre)?.Ubicacion_Entrega;
                                                                    if (ubicacion) {
                                                                        window.location.href = ubicacion;
                                                                    } else {
                                                                        alert("Esta entrega no tiene un archivo adjunto.");
                                                                    }
                                                                }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                                        <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M12 21L12 13M12 21C11.2998 21 9.99153 19.0057 9.5 18.5M12 21C12.7002 21 14.0085 19.0057 14.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </button>
                                                            ) : (
                                                                determineStatus(setting.fechaentrega) !== 'Plazo Vencido' && (
                                                                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={(event) => handleFileChange(event, setting.id, setting.nombre)} acceptLanguage="es" />
                                                                )
                                                            )}
                                                        </td>


                                                        <td>
                                                            {determineStatus(setting.fechaentrega) === 'A Tiempo' && !entregaByID.some(entrega => entrega.Tipo_Entrega_Descripcion === setting.nombre) && (
                                                                <button className="upload-button" onClick={() => { handleFileUpload(setting.id, setting.nombre, setting.configuracionEntregaId, bitacora[0].Bitacora_PPI_ID); }}>Cargar</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
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
