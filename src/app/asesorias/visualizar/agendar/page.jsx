/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'
import './css/style.css';
import { format } from 'date-fns';

export default function page() {

    const [asesores, setAsesores] = useState([])
    const [showCorrecto, setShowCorrecto] = useState(false)
    const [horas, setHoras] = useState([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState('')
    const [segundaAsesoria, setSegundaAsesoria] = useState(false);
    const [tipoCita, setTipoCita] = useState(1)
    const [estadoAgendar, setEstadoAgendar] = useState(false)
    const [horasM, setHorasM] = useState([])
    useEffect(() => {
        const buscarAsesores = async () => {
            const response = await fetch(`http://localhost:3002/usuario/asesor`);
            const data = await response.json();
            if (response.ok) {
                setAsesores(data);
            }
        }
        const cantidadAsesorias = async () => {
            const response = await fetch(`http://localhost:3002/equipo-ppi/1`);
            const data = await response.json();
            if (response.ok) {
                if (data[0].cantidad == null) {
                    setSegundaAsesoria(false)
                } else {
                    setSegundaAsesoria(true)
                }
            }
        }
        buscarAsesores();
        cantidadAsesorias();
    }, []);
    function formatTime(timeString) {
        const formattedTime = format(new Date(`2000-01-01T${timeString}`), 'h:mm');
        return formattedTime.replace(/^0(\d)/, '$1');
    }
    const buscarCitas = async (asesor) => {
        setHoras([])
        setEstadoAgendar(false)
        const Lunes = document.getElementById("Lunes");
        const Martes = document.getElementById("Martes");
        const Miercoles = document.getElementById("Miercoles");
        const Jueves = document.getElementById("Jueves");
        const Viernes = document.getElementById("Viernes");
        const Sabado = document.getElementById("Sabado");
        if (!segundaAsesoria) {
            Lunes.checked = false;
            Martes.checked = false;
            Miercoles.checked = false;
        } else {
            Jueves.checked = false;
            Viernes.checked = false;
            Sabado.checked = false;
        }
        const fechaActual = new Date();
        const fechaLunes = new Date(fechaActual);
        const fechaSabado = new Date(fechaActual); // Clona la fecha actual
        fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
        fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 6)); // Establece la fecha al próximo lunes
        const fechaInicio = fechaLunes.toISOString().split('T')[0];
        const fechaFin = fechaSabado.toISOString().split('T')[0];

        const response = await fetch(`http://localhost:3002/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/${asesor}`);
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
                if (!segundaAsesoria) {
                    Lunes.disabled = true;
                    lLunes.classList.add('labeldsabilitado')
                    Martes.disabled = true;
                    lMartes.classList.add('labeldsabilitado')
                    Miercoles.disabled = true;
                    lMiercoles.classList.add('labeldsabilitado')
                } else {
                    Jueves.disabled = true;
                    lJueves.classList.add('labeldsabilitado')
                    Viernes.disabled = true;
                    lViernes.classList.add('labeldsabilitado')
                    Sabado.disabled = true;
                    lSabado.classList.add('labeldsabilitado')
                }
            } else {
                const LunesV = [];
                const MartesV = [];
                const MiercolesV = [];
                const JuevesV = [];
                const ViernesV = [];
                const SabadoV = [];
                data.map((item) => {
                    const estado = item.estadoCita;
                    const fecha = new Date(item.fecha);
                    if (!segundaAsesoria) {
                        if (fecha.getDay() == 1) {
                            Lunes.disabled = false;
                            lLunes.classList.remove('labeldsabilitado')
                            LunesV.push([formatTime(item.hora), item.id, estado.nombre])
                        } else if (fecha.getDay() == 2) {
                            Martes.disabled = false;
                            lMartes.classList.remove('labeldsabilitado')
                            MartesV.push([formatTime(item.hora), item.id, estado.nombre])
                        } else if (fecha.getDay() == 3) {
                            Miercoles.disabled = false;
                            lMiercoles.classList.remove('labeldsabilitado')
                            MiercolesV.push([formatTime(item.hora), item.id, estado.nombre])
                        }
                    } else {
                        if (fecha.getDay() == 4) {
                            Jueves.disabled = false;
                            lJueves.classList.remove('labeldsabilitado')
                            JuevesV.push([formatTime(item.hora), item.id, estado.nombre])
                        } else if (fecha.getDay() == 5) {
                            Viernes.disabled = false;
                            lViernes.classList.remove('labeldsabilitado')
                            ViernesV.push([formatTime(item.hora), item.id, estado.nombre])
                        } else if (fecha.getDay() == 6) {
                            Sabado.disabled = false;
                            lSabado.classList.remove('labeldsabilitado')
                            SabadoV.push([formatTime(item.hora), item.id, estado.nombre])
                        }
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

        setEstadoAgendar(false)
        setHoras(horasM[dia])
        console.log(horasM[dia])
    }

    const agendarCita = async () => {
        const respons = await fetch('http://localhost:3002/equipo-ppi/1');
        const da = respons.json()
        if (respons.ok) {
            const fechaMuestra = new Date();
            const fechaInicio = new Date();
            const fechaFin = new Date();
            fechaInicio.setDate(fechaMuestra.getDate() - fechaMuestra.getDay()+1);
            fechaFin.setDate(fechaMuestra.getDate() - (fechaMuestra.getDay() - 6));
            alert(fechaInicio);
            alert(fechaFin);
           //aqui voy 
           if (da.cantidad == null) {
            const datos = {
                "link": "123",
                "estadoCita": "2",
                "equipocita": "1",
                "tipoCita": tipoCita
            }
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            };
            const response = await fetch('http://localhost:3002/citas-asesoria-ppi/' + horaSeleccionada, requestOptions);
            if (response.ok) {
                setEstadoAgendar(false)
                setShowCorrecto(true);
                setTimeout(() => {
                    window.location.reload(); // Recarga la página
                }, 2000);
            } else {
                alert('adsadsfdafs')
            }
        }
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
                                <div className=' justify-center  pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:flex gap-4" '>
                                    {segundaAsesoria ? (
                                        <>
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
                                        </>
                                    ) : (<><div className='px-2 py-4'>
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
                                        </div></>)}

                                </div>
                            </div>
                            <div className='mt-5'>
                                <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona la hora:</h1>
                                <div class="justify-center flex pt-8">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 gap-4">
                                        {horas.map((item, index1) => (

                                            <div key={item[1]} className='px-2 py-4'>
                                                {item[2] == "Disponible" ? (
                                                    <><input onChange={() => { setHoraSeleccionada(item[1]); setEstadoAgendar(true) }} type="radio" id={item[1]} name="Hora" className=" peer hidden" /><label htmlFor={item[1]} id={`lb${item[1]}`} className="labelCheck select-none cursor-pointer rounded-lg border-2 border-emerald-500 py-3 px-6 font-bold text-emerald-500 transition-colors duration-200 ease-in-out peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-200">{item[0]}</label></>
                                                ) :
                                                    (
                                                        <><input disabled type="radio" id={item[1]} name="Hora" className=" peer hidden" /><label htmlFor={item[1]} id={`lb${item[1]}`} className="cursor-not-allowed labelCheck select-none cursor-pointer rounded-lg border-2 border-red-500 py-3 px-6 font-bold text-red-500 transition-colors duration-200 ease-in-out peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-200" disabled>{item[0]}</label></>
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {estadoAgendar ? (
                                    <div className='mt-5'>
                                        <h1 className='text-3xl font-bold text-center text-gray-600'>Selecciona Ubicación:</h1>

                                        <div className='py-10 justify-center items-center text-center grid grid-cols-2'>
                                            <div className='-mr-10  '>
                                                <input onChange={() => { setTipoCita(1) }} defaultChecked type="radio" id='Virtual' name="Ubicacion" className=" peer hidden" />
                                                <label htmlFor='Virtual' className="labelCheck select-none cursor-pointer rounded-lg border-2 border-amber-500 py-3 px-6 font-bold text-amber-500 transition-colors duration-200 ease-in-out peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-200">Virtual</label>
                                            </div>

                                            <div className='-lr-10'>
                                                <input onChange={() => { setTipoCita(2) }} type="radio" id='Presencial' name="Ubicacion" className=" peer hidden" />
                                                <label htmlFor='Presencial' className="labelCheck select-none cursor-pointer rounded-lg border-2 border-amber-500 py-3 px-6 font-bold text-amber-500 transition-colors duration-200 ease-in-out peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-200">Presencial</label>
                                            </div>
                                        </div>

                                        <button onClick={() => { agendarCita() }} class="text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Agendar</button>
                                    </div>) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
        </>
    )
}
