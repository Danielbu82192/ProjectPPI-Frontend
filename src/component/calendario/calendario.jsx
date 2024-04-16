/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";


function calendario() {
    const matriz = Array.from({ length: 7 }, () => Array.from({ length: 49 }));
    const [dias, setDias] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showNoAseaorias, setShowNoAseaorias] = useState(false);

    const [diasConst, setDiasConst] = useState(['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [numeroDiaLunes, setNumeroDiaLunes] = useState(null);
    let horasid = '';
    const horasIniciales = 6; // Hora inicial para empezar
    let minutosConst = 0; // Minutos iniciales
    const intervaloMinutos = 20; // Intervalo de minutos
    let variables = (horasIniciales / intervaloMinutos) * 10;
    let cuentas = 0;
    let idAsesor = 0;
    let cont = -1;
    let contador = 0 // Minutos iniciales
    const calcularNumeroDiaLunes = (fecha) => {
        const diaSemana = fecha.getDay();
        const numeroDia = fecha.getDate();
        return numeroDia - diaSemana + 1;
    };


    const router = useRouter();
    const visualizarCita = (id) => {
        router.push('/asesorias/visualizar/asesor/' + id);
    }

    const Login = async () => {
        const response = await fetch(`http://localhost:3002/usuario/Juan@gmail.com/123456789`);
        const data = await response.json();
        if (response.ok) {
            idAsesor = data[0].id;
            processAsesor();

        } else {
            showAlert(true);
        }
    }

    function processAsesor() {

        busacrCitas();
    }

    const busacrCitas = async () => {
        const fechaActual = new Date();
        const fechaLunes = new Date(fechaActual);
        fechaLunes.setDate(numeroDiaLunes)
        const fechaSabado = new Date(fechaActual);
        fechaLunes.setDate(fechaActual.getDate() - fechaActual.getDay() + 1);
        fechaSabado.setDate(fechaActual.getDate() - (fechaActual.getDay() - 7)); // Establece la fecha al próximo lunes
        const fechaInicio = fechaLunes.toISOString().split('T')[0]; 
        const fechaFin = fechaSabado.toISOString().split('T')[0];
        const response = await fetch(`http://localhost:3002/citas-asesoria-ppi/${fechaInicio}/${fechaFin}/1`);
        const data = await response.json();     
        if (response.ok) {
            console.log(data)
            data.map((item) => {
                const horaCompleta = item.hora;
                const [hora, minutos] = horaCompleta.split(':');
                const horaFormateada = hora.toString().padStart(2, '0');
                const minutosFormateados = minutos.toString().padStart(2, '0');
                const fechaCompleta = new Date(item.fecha);
                const diaSemana = fechaCompleta.getDay();
                const numeroDia = fechaCompleta.getDate();
                const id = `${horaFormateada}:${minutosFormateados}/${diasConst[diaSemana]} ${numeroDia}`;

                const div = document.getElementById(id);
                if (div) {
                    if (item.estadoCita.id == 1) {
                        if (item.tipoCita.id == 1) {
                            div.innerHTML = `<button id="button-${item.id}" class="text-white py-2 px-4 w-full rounded bg-green-300 hover:bg-green-400 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">${item.estadoCita.nombre}</button>`;
                        } else if (item.tipoCita.id == 2) {
                            div.innerHTML = `<button id="button-${item.id}" class="text-white py-2 px-4 w-full rounded bg-indigo-300 hover:bg-indigo-400 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">${item.estadoCita.nombre}</button>`;
                        }
                    } else if (item.estadoCita.id == 2) {
                        if (item.tipoCita.id == 1) {
                            div.innerHTML = `<button id="button-${item.id}" class="text-white py-2 px-4 w-full rounded bg-green-500 hover:bg-green-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">${item.equipocita.codigoEquipo}</button>`;
                        } else if (item.tipoCita.id == 2) {
                            div.innerHTML = `<button id="button-${item.id}" class="text-white py-2 px-4 w-full rounded bg-indigo-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">${item.equipocita.codigoEquipo}</button>`;
                        }
                    }
                    const button = document.getElementById(`button-${item.id}`);
                    button.addEventListener('click', () => visualizarCita(item.id));
                }

            })

        } else {
            setShowNoAseaorias(true);
        }

    }


    useEffect(() => {
        const fecha = new Date(); // O cualquier otra fecha que desees
        const numeroDia = calcularNumeroDiaLunes(fecha);
        setNumeroDiaLunes(numeroDia);
        Login();
    }, []);
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        if (showNoAseaorias) {
            const timer = setTimeout(() => {
                setShowNoAseaorias(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showNoAseaorias]);
    return (
        <div>
            <div className='grid grid-cols-7 items-center text-center'>
                <div>

                </div>
                {(() => {
                    const elementos = [];
                    for (let i = 0; i <= 5; i++) {
                        elementos.push(
                            <div key={i} className='border-l border-gray-300'>
                                <p className="font-bold text-gray-700 text-xl">{numeroDiaLunes + i}</p>
                                <p className="text-gray-400">{diasConst[i + 1]}</p>
                            </div>
                        );
                    }
                    return elementos;
                })()}
            </div>

            {matriz.map((fila, indiceFila) => (
                <div key={indiceFila} className='grid grid-cols-7 border-r  border-gray-300'>
                    {fila.map((_, indiceColumna) => {
                        if (indiceColumna % 7 === 0) {
                            const hora = horasIniciales + cuentas;
                            const minutos = minutosConst % 60;
                            const horaFormateada = hora.toString().padStart(2, '0');
                            const minutosFormateados = minutos.toString().padStart(2, '0');
                            minutosConst += intervaloMinutos;
                            contador += 1;
                            horasid = `${horaFormateada}:${minutosFormateados}`;
                            if (contador === variables) {
                                cuentas += 1;
                                contador = 0;
                            }
                            return (
                                <div key={indiceColumna} className='text-center h-10 border-t border-gray-300'>
                                    <p className="text-gray-700 flex justify-center items-center h-full text-lg">{`${horaFormateada}:${minutosFormateados}`}</p>
                                </div>
                            );
                        } else {
                            cont += 1;
                            if (cont == 6) {
                                cont = 0
                            }  // Incrementar cont para obtener el índice correcto en el array `dias`
                            return (
                                <div key={indiceColumna} id={horasid + '/' + diasConst[cont + 1] + ' ' + (numeroDiaLunes + cont)} className='border-t border-l border-gray-300'>

                                </div>
                            );
                        }
                    })}
                </div>
            ))}

            {showAlert && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-red-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Error al cargar</div>
                            <button onClick={() => { setShowAlert(!showAlert) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showNoAseaorias && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-yellow-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="fill-current text-white" width="20" height="20"><path fill-rule="evenodd" d="M8.22 1.754a.25.25 0 00-.44 0L1.698 13.132a.25.25 0 00.22.368h12.164a.25.25 0 00.22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM9 11a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z"></path></svg>
                        </div>
                        <div class="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>No hay asesorías disponibles.</div>
                            <button onClick={() => { setShowNoAseaorias(!showNoAseaorias) }}>
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

export default calendario