"use client"
import { split } from 'postcss/lib/list';
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import './css/style.css'

function crear() {
    const [labelCheck, setLabelCheck] = useState([])
    const [tipoCita, setTipoCita] = useState('1')
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [estadoCrear, setEstadoCrear] = useState(false)
    const [diaCreacion, setDiaCreacion] = useState('')
    const [diaSemana, setDiaSemana] = useState('');
    const [horas, setHoras] = useState([]);
    const [horaSeleccionadas, setHoraSeleccionadas] = useState([]);
    const [diaLunes, setDiaLunes] = useState('');
    const [diasNumero, setDiaNumero] = useState([]);
    const [diasConst, setDiasConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const diasSemana = {
        'Lunes': 1,
        'Martes': 2,
        'Miércoles': 3,
        'Jueves': 4,
        'Viernes': 5,
        'Sábado': 6,
        'Domingo': 7
    };

    const calcularNumeroDiaLunes = () => {
        const fecha = new Date("04/08/2024");
        //fecha.setHours(3);
        let diaSemanas = fecha.getDay();
        const numeroDia = fecha.getDate();
        if (fecha.getHours() >= 18) diaSemanas = diaSemanas + 1
        setDiaSemana(diaSemanas)
        setDiaLunes(numeroDia - diaSemanas + 1);
    };

    const obtenerHoraActual = (dia, index) => {
        setHoras([]);
        setDiaCreacion(dia[1]);
        const numeroDia = diasSemana[dia[0]];
        const fechaActual = new Date();
        let hora = 0;
        fechaActual.setHours(3);
        fechaActual.setMinutes(0);
        fechaActual.setSeconds(0);
        fechaActual.setMilliseconds(0);
        if (numeroDia == fechaActual.getDay()) {
            hora = fechaActual.getHours()
            if (hora >= 1 && hora <= 2) {
                hora = 6
            }
            else {
                hora = hora + 4;
            }
        } else {
            hora = 6;
        }
        for (let i = hora; i <= 20; i++) {
            const dato = [`${i}:00`, `${i}:20`, `${i}:40`]
            setHoras(prevState => [...prevState, dato])
        }
        buscarCitas(dia);

    };

    useEffect(() => {
        calcularNumeroDiaLunes();

    }, []);

    useEffect(() => {
        setDiaNumero([])
        diasConst.map((item, index) => {
            if ((diaSemana - 1) <= index) {
                setDiaNumero(prevState => [...prevState, item + ' ' + (diaLunes + index)])
            }
        });
    }, [diaLunes, diasConst, diaSemana]);

    useEffect(() => {
        if (horaSeleccionadas.length !== 0) {
            setEstadoCrear(true);
        } else {
            setEstadoCrear(false);
        }
    }, [horaSeleccionadas]);

    const cambiaDia = (item, index) => {
        horaSeleccionadas.map((item) => {
            const checkbox = document.getElementById(item);
            checkbox.checked = false
        })
        setHoraSeleccionadas([])
        setHoras([])
        labelCheck.map((item) => {
            const checkbox = document.getElementById(item);
            const lbCheckbox = document.getElementById(`lb${item}`);
            lbCheckbox.classList.remove("labeldsabilitado");
            checkbox.disabled = false;
        })
        const dia = split(item, ' ')
        obtenerHoraActual(dia, index);
    };
    const seleccionarHora = (hora) => {
        if (horaSeleccionadas.length !== 0) {
            if (horaSeleccionadas.some(array => array.includes(hora))) {
                const datosActualizados = horaSeleccionadas.map(array => array.filter(dato => dato !== hora));
                setHoraSeleccionadas(datosActualizados.filter(array => array.length > 0));
            } else {
                setHoraSeleccionadas(prevState => [...prevState, [hora]])
            }
        } else {
            setHoraSeleccionadas(prevState => [...prevState, [hora]])
        }
    }

    const crearCitas = async () => {
        const fecha = new Date()
        let estado = false;
        fecha.setDate(diaCreacion)
        const fechaFormateada = format(fecha, 'MM/dd/yyyy')
        for (const elemento of horaSeleccionadas) {
            try {
                const datos = {
                    "fecha": fechaFormateada,
                    "hora": elemento[0],
                    "estadoCita": 1,
                    "link": "",
                    "modificaciones": "",
                    "usuariocitaequipo": 1,
                    "tipoCita":tipoCita
                } 
                console.log(datos)
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                };
                const response = await fetch('http://localhost:3002/citas-asesoria-ppi', requestOptions);
                if (response.ok) {
                    estado = true;
                } else {
                    estado = false;
                }

            } catch (error) {
                console.error('Error al realizar la solicitud:', error);
                estado = false;
            }
        }
        if (estado) {
            setShowCorrecto(true);
            setHoraSeleccionadas([]);
            setTimeout(() => {
                window.location.reload(); // Recarga la página
            }, 2000);

        } else {
            setShowAlert(true);
        }

    }

    function formatTime(timeString) {
        const formattedTime = format(new Date(`2000-01-01T${timeString}`), 'HH:mm');
    return formattedTime.replace(/^0(\d)/, '$1');
    }
    const buscarCitas = async (dia) => {
        const fechaActual = new Date();
        const fechaLunes = new Date(fechaActual);
        const fechaSabado = new Date(fechaActual); // Clona la fecha actual
        fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
        fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7)); // Establece la fecha al próximo lunes
        const fechaInicio = fechaLunes.toISOString().split('T')[0];
        const fechaFin = fechaSabado.toISOString().split('T')[0];

        const response = await fetch(`http://localhost:3002/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/1`);
        const data = await response.json();
        if (response.ok) {
            setLabelCheck([])
            data.map((item) => {
                const fecha = new Date(item.fecha)
                if (fecha.getDate() == dia[1]) {
                    console.log(data)
                    const fecha = new Date();
                    fecha.setHours(3);
                    fecha.setMinutes(0);
                    fecha.setSeconds(0);
                    fecha.setMilliseconds(0);
                    const fechaHoyForma= format(new Date, 'dd/MM/yyyy'); 
                    const fechaCitaForma= format(item.fecha,'dd/MM/yyyy'); 
                    if (parseInt(item.hora.split(":")[0]) >= fecha.getHours() + 4 || fechaHoyForma!=fechaCitaForma) { 
                        const horas = formatTime(item.hora);
                        const checkbox = document.getElementById(horas); 
                        const lbCheckbox = document.getElementById(`lb${horas}`);
                        setLabelCheck(prevState => [...prevState, [horas]])
                        lbCheckbox.classList.add("labeldsabilitado");
                        checkbox.disabled = true;
                    }
                }
            })

        } else {
            setShowNoAseaorias(true);
        }

    }
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);
    return (
        <div>
            <div>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona el día de la cita:</h1>

                <div className=' justify-center  pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:flex gap-4" '>
                    <div className='px-2 py-4'>
                        <input onChange={() => { setTipoCita('1') }} defaultChecked type="radio" id='Virtual' name="Ubicacion" className=" peer hidden" />
                        <label htmlFor='Virtual' className="labelCheck select-none cursor-pointer rounded-lg border-2 border-green-500 py-3 px-6 font-bold text-green-500 transition-colors duration-200 ease-in-out peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-200">Virtual</label>
                    </div>

                    <div className='px-2 py-4'>
                        <input onChange={() => {  setTipoCita('2') }} type="radio" id='Presencial' name="Ubicacion" className=" peer hidden" />
                        <label htmlFor='Presencial' className="labelCheck select-none cursor-pointer rounded-lg border-2 border-indigo-500 py-3 px-6 font-bold text-indigo-500 transition-colors duration-200 ease-in-out peer-checked:bg-indigo-500 peer-checked:text-white peer-checked:border-indigo-200">Presencial</label>
                    </div>
                </div>

            </div>
            <div className='pt-8'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona el día de la cita:</h1>

                <div className=' justify-center  pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:flex gap-4" '>
                    {
                        diasNumero.map((item, index) => (
                            <div key={item} className='px-2 py-4'>
                                <input onChange={(e) => cambiaDia(item, index)} type="radio" id={item} name="dia-semana" className="peer hidden" />
                                <label htmlFor={item} className="select-none cursor-pointer rounded-lg border-2 border-blue-500
            py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-200"> {item} </label>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='pt-8'>
                <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona la hora de la cita:</h1>

                <div class="justify-center flex pt-8">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 gap-4">
                        {horas.map((items, index1) => (
                            <div key={index1} className="pt-8 pl-5">
                                {items.map((item, index) => (
                                    <div key={item} className='px-2 py-4'>
                                        <input onClick={(e) => seleccionarHora(item)} type="checkbox" id={item} name="dia-semana" className=" peer hidden" />
                                        <label htmlFor={item} id={`lb${item}`} className="labelCheck select-none cursor-pointer rounded-lg border-2 border-emerald-500 py-3 px-6 font-bold text-emerald-500 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-blue-200">{item}</label>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {estadoCrear ? (<div className='mt-5'>
                <button onClick={() => { crearCitas() }} class="text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Crear</button>
            </div>) : null}

            {showAlert && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Error al crear</div>
                            <button onClick={() => { setShowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showCorrecto && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Creados correctamente.</div>
                            <button onClick={() => { setShowCorrecto(!showCorrecto) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default crear