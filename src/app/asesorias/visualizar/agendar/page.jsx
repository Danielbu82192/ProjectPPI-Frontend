/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import './css/style.css';
import { format } from 'date-fns';

export default function page() {

    const [asesores, setAsesores] = useState([])
    const [citasEquipo, setCitasEquipo] = useState([])
    const [showCorrecto, setShowCorrecto] = useState(false)
    const [showM2citas, setShowM2citas] = useState(false)
    const [fechaSeleccionada, setFechaSeleccionada] = useState()
    const [showAlert, setShowAlert] = useState(false)
    const [showError, setShowError] = useState(false)
    const [estadoPedirCita, setEstadoPedirCita] = useState(false)
    const [horas, setHoras] = useState([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState('')
    const [segundaAsesoria, setSegundaAsesoria] = useState(false);
    const [estadoAgendar, setEstadoAgendar] = useState(false)
    const [horasM, setHorasM] = useState([])
    const [horaActual, setHorasActual] = useState([])
    useEffect(() => {
        const buscarAsesores = async () => {
            const response = await fetch(`https://projectppi-backend-production.up.railway.app/usuario/asesor`);
            const data = await response.json();
            if (response.ok) {
                setAsesores(data);
            }
        }
        setHorasActual(new Date().getHours())
        buscarAsesores();
    }, []);
    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        const formattedTime = format(new Date(`2000-01-01T${hora}`), 'HH:mm');
        return formattedTime.replace(/^0(\d)/, '$1');
    }
    const buscarCitas = async (asesor) => {
        setHoras([])
        const Lunes = document.getElementById("Lunes");
        const Martes = document.getElementById("Martes");
        const Miercoles = document.getElementById("Miercoles");
        const Jueves = document.getElementById("Jueves");
        const Viernes = document.getElementById("Viernes");
        const Sabado = document.getElementById("Sabado");
        Lunes.checked = false;
        Martes.checked = false;
        Miercoles.checked = false;
        Jueves.checked = false;
        Viernes.checked = false;
        Sabado.checked = false;
        const fechaActual = new Date();
        const fechaLunes = new Date(fechaActual);
        const fechaSabado = new Date(fechaActual); // Clona la fecha actual
        fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
        fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7)); // Establece la fecha al próximo lunes
        const fechaInicio = fechaLunes.toISOString().split('T')[0];
        const fechaFin = fechaSabado.toISOString().split('T')[0];
        const response = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/${asesor}`);
        const data = await response.json();
        if (response.ok) {
            const Lunes = document.getElementById("Lunes");
            const lLunes = document.getElementById("LbLunes");
            const Martes = document.getElementById("Martes");
            const lMartes = document.getElementById("LbMartes");
            const Miercoles = document.getElementById("Miercoles");
            const lMiercoles = document.getElementById("LbMiercoles");
            const Jueves = document.getElementById("Jueves");
            const lJueves = document.getElementById("LbJueves");
            const Viernes = document.getElementById("Viernes");
            const lViernes = document.getElementById("LbViernes");
            const Sabado = document.getElementById("Sabado");
            const lSabado = document.getElementById("LbSabado");
            if (data.length == 0) {
                Lunes.disabled = true;
                lLunes.classList.add('labeldsabilitado')
                Martes.disabled = true;
                lMartes.classList.add('labeldsabilitado')
                Miercoles.disabled = true;
                lMiercoles.classList.add('labeldsabilitado')
                Jueves.disabled = true;
                lJueves.classList.add('labeldsabilitado')
                Viernes.disabled = true;
                lViernes.classList.add('labeldsabilitado')
                Sabado.disabled = true;
                lSabado.classList.add('labeldsabilitado')

            } else {
                const LunesV = [];
                const MartesV = [];
                const MiercolesV = [];
                const JuevesV = [];
                const ViernesV = [];
                const SabadoV = [];
                data.map((item) => {
                    const estado = item.estadoCita;
                    const tipo = item.tipoCita;
                    const fecha = new Date(item.fecha);
                    const horaActual = new Date();
                    const hActual = parseInt(horaActual.getHours()) * 60 + (horaActual.getMinutes())
                    const minTotal = parseInt(item.hora.split(":")[0]) * 60 + parseInt(item.hora.split(":")[1])
                    if (fecha.getDay() == 1) {
                        /*if (fecha.getDay() == new Date().getDay() && hActual - minTotal > 0) {
                            return null;
                        }*/
                        Lunes.disabled = false;
                        lLunes.classList.remove('labeldsabilitado')
                        LunesV.push([formatTime(item.hora), item.id, estado.id, tipo.nombre])
                    } else if (fecha.getDay() == 2) {
                        /*if (fecha.getDay() == new Date().getDay() && hActual - minTotal > 0) {
                            return null;
                        }*/
                        Martes.disabled = false;
                        lMartes.classList.remove('labeldsabilitado')
                        MartesV.push([formatTime(item.hora), item.id, estado.id, tipo.nombre])

                    } else if (fecha.getDay() == 3) {
                        /*if (fecha.getDay() == new Date().getDay() && hActual - minTotal > 0) {
                            return null;
                        }*/
                        Miercoles.disabled = false;
                        lMiercoles.classList.remove('labeldsabilitado')
                        MiercolesV.push([formatTime(item.hora), item.id, estado.id, tipo.nombre])

                    } else if (fecha.getDay() == 4) {
                        /*if (fecha.getDay() == new Date().getDay() && hActual - minTotal > 0) {
                            return null;
                        }*/
                        Jueves.disabled = false;
                        lJueves.classList.remove('labeldsabilitado')
                        JuevesV.push([formatTime(item.hora), item.id, estado.id, tipo.nombre])

                    } else if (fecha.getDay() == 5) {
                        /*if (fecha.getDay() == new Date().getDay() && hActual - minTotal > 0) {
                            return null;
                        }*/
                        Viernes.disabled = false;
                        lViernes.classList.remove('labeldsabilitado')
                        ViernesV.push([formatTime(item.hora), item.id, estado.id, tipo.nombre])

                    } else if (fecha.getDay() == 6) {
                        /*if (fecha.getDay() == new Date().getDay() && hActual - minTotal > 0) {
                            return null;
                        }*/
                        Sabado.disabled = false;
                        lSabado.classList.remove('labeldsabilitado')
                        SabadoV.push([formatTime(item.hora), item.id, estado.id, tipo.nombre])

                    }
                })
                const Matriz = []
                Matriz.push(LunesV)
                Matriz.push(MartesV)
                Matriz.push(MiercolesV)
                Matriz.push(JuevesV)
                Matriz.push(ViernesV)
                Matriz.push(SabadoV)
                setHorasM(Matriz)

            }

        } else {
            setShowNoAseaorias(true);
        }

    }




    const cargarHoras = (dia) => {
        setFechaSeleccionada(dia)
        setEstadoAgendar(false)
        setHoras(horasM[dia])
    }

    const agendarCita = async () => {
        if (estadoPedirCita) {
            if (segundaAsesoria) {
                const fecha = new Date();
                if (parseInt(fechaSeleccionada) < 3) {
                    setShowAlert(true);
                    return;
                }
                if (fecha.getDay() < 4) {
                    setShowAlert(true);
                    return;
                }
            }
            const datos = {
                "estadoCita": "2",
                "equipocita": "1",
            }
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            };
            const response = await fetch('https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/' + horaSeleccionada, requestOptions);
            if (response.ok) {
                setEstadoAgendar(false)
                setShowCorrecto(true);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setShowError(true);
            }
        } else {
            setShowM2citas(true)
        }
    }
    useEffect(() => {
        if (showCorrecto) {
            const timer = setTimeout(() => {
                setShowCorrecto(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showCorrecto]);
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showError]);
    useEffect(() => {
        const traerCitasEquipo = async () => {
            setEstadoAgendar(false)
            const fechaActual = new Date();
            const fechaLunes = new Date(fechaActual);
            const fechaSabado = new Date(fechaActual); // Clona la fecha actual
            fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
            fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 6)); // Establece la fecha al próximo lunes
            const fechaInicio = fechaLunes.toISOString().split('T')[0];
            const fechaFin = fechaSabado.toISOString().split('T')[0];
            const response = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/Equipo/${fechaInicio}/${fechaFin}/1`);
            const data = await response.json();
            if (response.ok) {
                if (data.length == 0) {
                    setSegundaAsesoria(false);
                    setEstadoPedirCita(true);
                } else {
                    if (data.length == 2) {
                        setSegundaAsesoria(false);
                        setEstadoPedirCita(false);
                    } else if (data.length == 1) {
                        setSegundaAsesoria(true);
                        setEstadoPedirCita(true);
                        setCitasEquipo(data);
                    } else {
                        setSegundaAsesoria(false);
                        setCitasEquipo(data);
                        setEstadoPedirCita(false);
                    }
                }
            }
        }
        traerCitasEquipo();
    }, []);



    const mostrarBotton = (estado) => {
        if (fechaSeleccionada + 1 < new Date().getDay()) {
            setEstadoAgendar(true)
        }
        else {
            setEstadoAgendar(true)
        }
    }
    return (
        <>
            <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
                <div className='pt-8  pb-8 w-full'>
                    <div className=' md:h-22 lg:h-22 xl:h-16 sm:h-22  border-b-2 pl-8 pr-80 items-start w-full flex '>
                        <h1 className='text-4xl font-bold text-center text-gray-600'>Visualizar  citas de asesorías</h1>
                    </div>
                    <div className='p-10'>
                        <div>
                            <div>
                                <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona el asesor:</h1>

                                <select
                                    name="estado"
                                    id="estado"
                                    onChange={(e) => {
                                        buscarCitas(e.target.value)
                                    }}
                                    className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                >
                                    <option disabled selected>Selecciona un asesor</option>
                                    {asesores.map((dato) => (
                                        <option key={dato.id} value={dato.id}>{dato.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='mt-5'>
                                <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona el dia:</h1>
                                <div class="justify-center flex pt-8">
                                    <div className='grid grid-cols-1 pl-14 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3   xl:flex gap-4'>
                                        <div className='px-2 py-4'>
                                            <input onChange={(e) => { cargarHoras(0) }} type="radio" id='Lunes' name="dia-semana" className="peer hidden" disabled />
                                            <label htmlFor='Lunes' id='LbLunes' className="labeldsabilitado select-none cursor-pointer rounded-lg border-2 border-blue-500
        py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-200"> Lunes</label>
                                        </div>
                                        <div className='px-2 py-4'>
                                            <input onChange={(e) => { cargarHoras(1) }} type="radio" id='Martes' name="dia-semana" className="peer hidden" disabled />
                                            <label htmlFor='Martes' id='LbMartes' className="labeldsabilitado select-none cursor-pointer rounded-lg border-2 border-blue-500
        py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-200"> Martes</label>
                                        </div>
                                        <div className='px-2 py-4'>
                                            <input onChange={(e) => { cargarHoras(2) }} type="radio" id='Miercoles' name="dia-semana" className="peer hidden" disabled />
                                            <label htmlFor='Miercoles' id='LbMiercoles' className="labeldsabilitado select-none cursor-pointer rounded-lg border-2 border-blue-500
        py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-200"> Miercoles</label>
                                        </div>
                                        <div className='px-2 py-4'>
                                            <input onChange={(e) => { cargarHoras(3) }} type="radio" id='Jueves' name="dia-semana" className="peer hidden" disabled />
                                            <label htmlFor='Jueves' id='LbJueves' className="labeldsabilitado select-none cursor-pointer rounded-lg border-2 border-blue-500
            py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-200"> Jueves</label>
                                        </div>
                                        <div className='px-2 py-4'>
                                            <input onChange={(e) => { cargarHoras(4) }} type="radio" id='Viernes' name="dia-semana" className="peer hidden" disabled />
                                            <label htmlFor='Viernes' id='LbViernes' className="labeldsabilitado select-none cursor-pointer rounded-lg border-2 border-blue-500
            py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-200"> Viernes</label>
                                        </div>
                                        <div className='px-2 py-4'>
                                            <input onChange={(e) => { cargarHoras(5) }} type="radio" id='Sabado' name="dia-semana" className="peer hidden" disabled />
                                            <label htmlFor='Sabado' id='LbSabado' className="labeldsabilitado select-none cursor-pointer rounded-lg border-2 border-blue-500
            py-3 px-6 font-bold text-blue-500 transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-200"> Sabado</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona la hora:</h1>
                                <div class="justify-center flex pt-8">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 gap-4">
                                        {horas.map((item, index1) => (
                                            <div key={item[1]} className='px-2 py-4'>
                                                {item[2] === 1 ? (
                                                    item[3] === "Presencial" ? (
                                                        <>
                                                            <input onChange={() => { setHoraSeleccionada(item[1]); mostrarBotton(true); }} type="radio" id={item[1]} name="Hora" className="peer hidden" />
                                                            <label htmlFor={item[1]} id={`lb${item[1]}`} className="labelCheck select-none cursor-pointer rounded-lg border-2 border-indigo-500 py-3 px-6 font-bold text-indigo-500 transition-colors duration-200 ease-in-out peer-checked:bg-indigo-500 peer-checked:text-white peer-checked:border-indigo-200">
                                                                {item[0]}
                                                            </label>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <input onChange={() => { setHoraSeleccionada(item[1]); mostrarBotton(true); }} type="radio" id={item[1]} name="Hora" className="peer hidden" />
                                                            <label htmlFor={item[1]} id={`lb${item[1]}`} className="labelCheck select-none cursor-pointer rounded-lg border-2 border-green-500 py-3 px-6 font-bold text-green-500 transition-colors duration-200 ease-in-out peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-200">
                                                                {item[0]}
                                                            </label>
                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        <input disabled type="radio" id={item[1]} name="Hora" className="peer hidden" />
                                                        <label htmlFor={item[1]} id={`lb${item[1]}`} className="cursor-not-allowed labelCheck select-none   rounded-lg border-2 border-red-500 py-3 px-6 font-bold text-red-500 transition-colors duration-200 ease-in-out peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-200" disabled>
                                                            {item[0]}
                                                        </label>
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                            <div>
                                {estadoAgendar ? (
                                    <div className='mt-5'>


                                        <button onClick={() => { agendarCita() }} class="text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Agendar</button>
                                    </div>) : null}
                            </div>
                        </div>
                    </div>
                </div >
            </div >
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
            )
            }

            {
                showAlert && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div class="bg-yellow-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-current text-white" width="20" height="20"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Las segundas asesorías se deben realizar a partir del jueves.</div>
                                <button onClick={() => { setShowAlert(!showAlert) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                showM2citas && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div class="bg-yellow-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-current text-white" width="20" height="20"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Solo se pueden agendar 2 citas por semana.</div>
                                <button onClick={() => { setShowM2citas(!showM2citas) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                showError && (
                    <div className="fixed bottom-0 right-0 mb-8 mr-8">
                        <div className="flex w-96 shadow-lg rounded-lg">
                            <div class="bg-yellow-600 py-4 px-6 rounded-l-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-current text-white" width="20" height="20"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                            </div>
                            <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                                <div>Ha ocurrido un error.</div>
                                <button onClick={() => { setShowError(!showError) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
