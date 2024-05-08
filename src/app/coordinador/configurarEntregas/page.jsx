"use client"
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import { addHours } from 'date-fns';
import './Page.css';

registerLocale('es', es);

function Page() {
    const [entregas, setEntregas] = useState([]);
    const [fechaEntrega, setFechaEntrega] = useState({});
    const [fechaCalificacion, setFechaCalificacion] = useState({});
    const [rolSeleccionado, setRolSeleccionado] = useState({});
    const [porcentajeIngresado, setPorcentajeIngresado] = useState({});

    useEffect(() => {
        const fetchEntregas = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/tipo-entrega/GetAllEntregas');
                if (!response.ok) {
                    throw new Error('Error al obtener las entregas');
                }
                const data = await response.json();
                setEntregas(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchEntregas();
    }, []);

    const handlePorcentajeChange = (event, entregaId) => {
        const value = parseInt(event.target.value);
        if (value < 1 || value > 100 || isNaN(value)) {
            alert('El porcentaje de entrega debe ser un número entre 1 y 100.');
        } else {
            setPorcentajeIngresado(prevState => ({
                ...prevState,
                [entregaId]: value
            }));
        }
    };

    const handleFechaEntregaChange = (date, entregaId) => {
        setFechaEntrega(prevState => ({
            ...prevState,
            [entregaId]: date
        }));
    };

    const handleFechaCalificacionChange = (date, entregaId) => {
        // Verificar si hay una fecha de entrega asociada a esta entregaId
        if (fechaEntrega[entregaId]) {
            // Comprobar si la fecha y hora de calificación es mayor que la fecha y hora de entrega
            if (date > fechaEntrega[entregaId]) {
                // Si es válida, actualizar el estado
                setFechaCalificacion(prevState => ({
                    ...prevState,
                    [entregaId]: date
                }));
            } else {
                // Si no es válida, mostrar un mensaje de error o realizar alguna acción adecuada
                alert('La fecha y hora de calificación debe ser mayor que la fecha y hora de entrega.');
            }
        } else {
            // Si no hay fecha de entrega asociada, simplemente actualizar el estado
            setFechaCalificacion(prevState => ({
                ...prevState,
                [entregaId]: date
            }));
        }
    };

    const handleGuardarEntregas = () => {
        // Crear un array para almacenar la información de cada entrega
        const entregasData = [];

        // Recorrer todas las entregas para obtener su información
        entregas.forEach(entrega => {
            // Crear un objeto para almacenar la información de esta entrega
            const entregaInfo = {
                id: entrega.id,
                nombre: entrega.nombre,
                rol: rolSeleccionado[entrega.id],
                porcentaje: porcentajeIngresado[entrega.id],
                fechaEntrega: fechaEntrega[entrega.id],
                fechaCalificacion: fechaCalificacion[entrega.id]
            };
            // Agregar la información de esta entrega al array de entregasData
            entregasData.push(entregaInfo);
        });

        // Mostrar el array de entregasData en la consola como JSON
        console.log('Entregas guardadas:', JSON.stringify(entregasData, null, 2));
    };

    const fechaActualColombia = addHours(new Date(), -5);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                alert('Para llenar la tabla por completo, tendrás que desplazarte de manera horizontal dentro de ella. Te recomendamos llenar esta información desde un computador para más facilidad.');
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Configurar Entregas</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div className="mt-5">
                        <p>En esta ventana, podrás configurar qué rol se encargará de calificar cada entrega durante este semestre y el porcentaje que tendrá cada una sobre la calificación final. Además, podrás elegir la fecha límite para que los estudiantes carguen cada una de las entregas, así como la fecha límite para que cada rol pueda calificar cada entrega. Una vez hayas configurado todo, haz click en el botón &quot;Guardar Entregas&quot;.</p><br></br>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Entrega</th>
                                        <th>Rol</th>
                                        <th>Porcentaje</th>
                                        <th>Fecha de Entrega</th>
                                        <th>Fecha de Calificación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entregas.map(entrega => (
                                        <tr key={entrega.id}>
                                            <td className="pr-4">{entrega.nombre}</td>
                                            <td className="pr-4">
                                                <select
                                                    id={`rol-${entrega.id}`}
                                                    className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500 custom-select"
                                                    value={rolSeleccionado[entrega.id] || ''}
                                                    onChange={(event) => setRolSeleccionado(prevState => ({ ...prevState, [entrega.id]: event.target.value }))}
                                                >
                                                    <option value="" disabled>Seleccionar Rol</option>
                                                    <option value="3">Asesor</option>
                                                    <option value="2">Docente</option>
                                                    <option value="4">Coordinador</option>
                                                </select>
                                            </td>
                                            <td className="pr-4">
                                                <input
                                                    type="text"
                                                    className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                                                    style={{ maxWidth: '50px' }}
                                                    pattern="[1-9][0-9]?|100"
                                                    value={porcentajeIngresado[entrega.id] || ''}
                                                    onChange={(event) => handlePorcentajeChange(event, entrega.id)}
                                                    inputMode="numeric"
                                                />
                                            </td>
                                            <td className="pr-4">
                                                {entrega.id !== 8 && (
                                                    <DatePicker
                                                        selected={fechaEntrega[entrega.id]}
                                                        onChange={date => handleFechaEntregaChange(date, entrega.id)}
                                                        showTimeSelect
                                                        timeIntervals={15}
                                                        timeFormat="HH:mm"
                                                        dateFormat="MMMM d, yyyy h:mm aa"
                                                        timeCaption="Hora"
                                                        placeholderText="Asignar Fecha y Hora"
                                                        locale="es"
                                                        minDate={fechaActualColombia}
                                                        className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                                                    />
                                                )}
                                            </td>
                                            <td className="pr-4">
                                                <DatePicker
                                                    selected={fechaCalificacion[entrega.id]}
                                                    onChange={date => handleFechaCalificacionChange(date, entrega.id)}
                                                    showTimeSelect
                                                    timeIntervals={15}
                                                    timeFormat="HH:mm"
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    timeCaption="Hora"
                                                    placeholderText="Asignar Fecha y Hora"
                                                    locale="es"
                                                    minDate={fechaActualColombia}
                                                    className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:border-blue-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center mt-4">
                            <button onClick={handleGuardarEntregas} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Guardar Entregas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;
