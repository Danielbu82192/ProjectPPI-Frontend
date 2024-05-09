"use client"
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import './Page.css';

function Page() {
    const [equipoUsuarios, setEquipoUsuarios] = useState([]);
    const [bitacora, setBitacora] = useState([]);
    const [entregaSettings, setEntregaSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState({});

    useEffect(() => {
        // Establece el idioma español como idioma por defecto para moment
        moment.locale('es');
    }, []);

    useEffect(() => {
        const fetchEquipoUsuarios = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetGroupById/7095');
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


    // Filtrar las entregas excluyendo la última con ID 8 que se llama "Asesorías"
    const filteredEntregaSettings = entregaSettings.filter(setting => setting.id !== 8);

    // Función para formatear la fecha con zona horaria UTC-5 (Colombia) y AM/PM
    const formatDate = (dateString) => {
        const formattedDate = moment.utc(dateString).utcOffset(-5).format('DD-MM-YYYY HH:mm A');
        return formattedDate;
    };

    // Función para determinar el estado de la entrega
    const determineStatus = (fechaEntrega) => {
        const fechaEntregaUTC5 = moment.utc(fechaEntrega).utcOffset(-5);
        const fechaActualUTC5 = moment().utcOffset(-5);

        if (fechaActualUTC5.isBefore(fechaEntregaUTC5)) {
            return "A Tiempo";
        } else {
            return "Plazo Vencido";
        }
    };

    // Función para obtener la clase de estilo basada en el estado
    const getStatusStyle = (status) => {
        return status === 'A Tiempo' ? 'green' : 'red';
    };

    // Función para manejar la selección de archivos
    const handleFileChange = (event, entregaId) => {
        setSelectedFiles(prevState => ({
            ...prevState,
            [entregaId]: event.target.files[0] // Guardar el archivo seleccionado en el estado
        }));
    };

    const handleFileUpload = async (entregaId, configuracionEntregaId, bitacoraPpiId) => {
        try {
            const formData = new FormData();
            formData.append('file', selectedFiles[entregaId]); // Adjunta el archivo al FormData
            formData.append('entregaId', entregaId); // Adjunta el ID de entrega
            formData.append('configuracionEntregaId', configuracionEntregaId); // Adjunta el ID de configuración de entrega
            formData.append('bitacoraPpiId', bitacoraPpiId); // Adjunta el ID de la bitácora PPI
            
            // Enviar la solicitud al backend
            const response = await fetch('https://td-g-production.up.railway.app/entrega-equipo-ppi/UploadPPIEntregaFile', {
                method: 'POST',
                body: formData,
                // Si necesitas configurar encabezados adicionales, como autorización, puedes hacerlo aquí
            });
    
            if (response.ok) {
                console.log('Archivo cargado exitosamente');
                // Puedes agregar lógica adicional aquí después de cargar el archivo, si es necesario
            } else {
                console.error('Error al cargar el archivo:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la carga de archivos:', error);
        }
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
                                {filteredEntregaSettings.length === 0 ? (
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
                                                    <th>Plazo</th>
                                                    <th>Adjuntos</th> {/* Nueva columna */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEntregaSettings.map(setting => (
                                                    <tr key={setting.id}>
                                                        <td>{setting.nombre}</td>
                                                        <td>{setting.porcentaje}</td>
                                                        <td>{formatDate(setting.fechaentrega)}</td>
                                                        <td className={`status-${getStatusStyle(determineStatus(setting.fechaentrega))}`}>{determineStatus(setting.fechaentrega)}</td>
                                                        <td>
                                                            {selectedFiles[setting.id] ? (
                                                                <p>{selectedFiles[setting.id].name}</p>
                                                            ) : (
                                                                <div>
                                                                    {determineStatus(setting.fechaentrega) === 'A Tiempo' && ( // Renderizar solo si el estado es "A Tiempo"
                                                                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" onChange={(event) => handleFileChange(event, setting.id)} acceptLanguage="es" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {determineStatus(setting.fechaentrega) === 'A Tiempo' && (
                                                                <button className="upload-button" onClick={() => { handleFileUpload(setting.id, setting.configuracionEntregaId, bitacora[0].Bitacora_PPI_ID); }}>Cargar</button>
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