"use client"
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import Mostrar from '@/component/asesorias/mostrar/mostrarAs'
import { format } from 'date-fns';
import { useRouter } from "next/navigation";

function page({ params }) {

    const [cita, setCita] = useState([]);
    const [semanaConst, setSemanaConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [diasConst, setDiasConst] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'])
    const [semanaCancelar, setSemanaCancelar] = useState([])
    const [estadoModificar, setEstadoModificar] = useState(false);
    const [grupoTrue, setGrupoTrue] = useState(false);
    const [selectEstado, setSelectEstado] = useState(1);
    const [citaEstado, setCitaEstado] = useState([]);
    const [tipoCita, setTipoCita] = useState([]);
    const [showModificar, setShowModificar] = useState(true)
    const [dia, setDia] = useState()
    const [numeroDia, setNumeroDia] = useState()
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [horaConst, setHoraConst] = useState('');
    const [minConst, setMinConst] = useState('');
    const [horaFija, setHoraFija] = useState('');
    const [minFija, setMinFija] = useState('');
    const [equipo, setEquipo] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showACampos, setShowACampos] = useState(false);
    const [numeroDiaLunes, setNumeroDiaLunes] = useState(null);
    const [salon, setSalon] = useState('');
    const [idEquipo, setIdEquipo] = useState('');
    const [listEquipos, setListEquipos] = useState([]);
    const [estudiantesEquipo, setEstudiantesEquipo] = useState([]);
    const [showCorrecto, setShowCorrecto] = useState(false);
    const [showOcupado, setShowOcupado] = useState(false);
    const [cancelar, setCancelar] = useState(false);
    const [fechaCancelar, setFechaCancelar] = useState('');
    const [horaCancelar, setHoraCancelar] = useState('');
    const [minCancelar, setMinCancelar] = useState('');
    const [diaCancelar, setDiaCancelar] = useState('');
    const router = useRouter();
    const calcularNumeroDiaLunes = (fecha) => {
        const diaSemana = fecha.getDay();
        const numeroDia = fecha.getDate();
        return numeroDia - diaSemana;
    };

    function formatDate(dateString) {
        return format(new Date(dateString), 'dd/MM/yyyy');
    }
    function formatTime(timeString) {
        const hora = timeString.split(':')[0] + ':' + timeString.split(':')[1];
        return format(new Date(`2000-01-01T${hora}`), 'HH:mm');
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/${params.id}`);
                const data = await response.json();
                setCita(data);
                setCitaEstado(data.estadoCita)
                setNumeroDiaLunes(calcularNumeroDiaLunes(new Date(data.fecha)) + new Date().getDay())
                setDia(new Date(data.fecha).getDay());
                setSemanaCancelar([semanaConst.slice(new Date().getDay() - 6), semanaConst]);
                setSemanaConst(semanaConst.slice(new Date().getDay() - 7))
                setSelectEstado(data.estadoCita.id)
                setNumeroDia(new Date(data.fecha).getDate())
                setTipoCita(data.tipoCita)
                const response2 = await fetch(`https://projectppi-backend-production.up.railway.app/hora-semanal/profesor/${data.usuariocitaequipo.id}`);
                const data2 = await response2.json();
                setSalon(data2[0].salon)
                if (new Date().getDate() == new Date(data.fecha).getDate()) {
                    setHoraInicio(new Date().getHours() + 4)
                    setHoraFin(15 - new Date().getHours() + 4)
                } else {
                    setHoraInicio(6)
                    setHoraFin(15)
                }
                setEquipo(data.equipocita)
                setHoraConst(data.hora.split(':')[0])
                setHoraFija(data.hora.split(':')[0])
                setMinConst(data.hora.split(':')[1])
                setMinFija(data.hora.split(':')[1])
                setHora(formatTime(data.hora))
                setFecha(formatDate(data.fecha))
                if (new Date().getDate() > new Date(data.fecha).getDate()) {
                    setShowModificar(true)
                } else if (new Date().getDate() < new Date(data.fecha).getDate()) {
                    setShowModificar(false)
                } else {
                    const fecha = new Date();
                    /*fecha.setHours(15)
                    fecha.setMinutes(0)*/
                    const minHoraACtual = (fecha.getHours() + 4) * 60 + (fecha.getMinutes())
                    const minCita = (parseInt(data.hora.split(':')[0])) * 60 + ((parseInt(data.hora.split(':')[1])))
                    if (minHoraACtual - minCita <= 0) {

                        setShowModificar(false)
                    } else {
                        setShowModificar(true)

                    }
                }
                if (!response.ok) {
                    setShowAlert(true);
                    throw new Error('Respuesta no exitosa');
                }
            } catch (error) {
                setShowAlert(true);
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [params.id, setCita]);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        if (showACampos) {
            const timer = setTimeout(() => {
                setShowACampos(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showACampos]);
    useEffect(() => {
        if (new Date().getDate() == numeroDia) {
            setHoraInicio(new Date().getHours() + 4)
            setHoraFin(15 - new Date().getHours() + 4)
        } else {
            setHoraInicio(6)
            setHoraFin(15)
        }
    }, [numeroDia]);
    useEffect(() => {
    }, [listEquipos]);
    const listarEquipo = async () => {
        try {
            const response = await fetch(`https://projectppi-backend-production.up.railway.app/equipo-ppi`);
            const data = await response.json();
            if (response.ok) {
                setListEquipos(data)
            }
        } catch (error) {
            setShowAlert(true);
        }
    }
    useEffect(() => {



        const getEstudiantesXEquipo = async () => {
            try {
                const response = await fetch(`https://projectppi-backend-production.up.railway.app/equipo-usuarios/Estudiantes/${equipo.codigoEquipo}`);
                const data = await response.json();
                if (response.ok) {

                    setEstudiantesEquipo([])
                    data.forEach(item => {
                        setEstudiantesEquipo(prevEstudiantes => [...prevEstudiantes, item.usuario]);
                    });
                }
            } catch (error) {
                setShowAlert(true);
            }
        }
        if (citaEstado.id != 1) {
            getEstudiantesXEquipo();
        }
    }, [equipo]);

    const modificarCita = async () => {
        let datos = {}
        const fecha = new Date();
        if (parseInt(numeroDia) >= fecha.getDate()) {
            const horaMod = (horaConst * 60) + minConst;
            const horaActual = (parseInt(fecha.getHours() * 60) + parseInt(fecha.getMinutes()));
            if (parseInt(numeroDia) == fecha.getDate()) {
                if (horaActual - horaMod < 0) {
                    setShowACampos(true)
                }
            } else {
                fecha.setDate(numeroDia - 1)
                const fechaFormat = fecha.toISOString().split('T')[0];
                const hora = `${horaConst}:${minConst}`;
                if (selectEstado == 1) {
                    datos = {
                        "fecha": fechaFormat,
                        "hora": hora,
                    }
                } else {
                    datos = {
                        "fecha": fechaFormat,
                        "hora": hora,
                        "estadoCita": 2,
                        "equipocita": idEquipo
                    }
                }
            }
        } else {
            setShowACampos(true)
        }
        const response2 = await fetch(`https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/BuscarFechaHoraUsuario/${datos.fecha}/${hora}/1`);
        if (response2.ok) {
            const data2 = await response2.json();
            if (data2.length == 0) {
                setShowCorrecto(true)
                const requestOptions = {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                };
                const response = await fetch('https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/' + params.id, requestOptions);
                if (response.ok) {
                    setShowCorrecto(true)
                }
            } else {
                setShowOcupado(true)
            }
        }
    }

    const cancelarCita = async (id) => {
        const response = await fetch('https://projectppi-backend-production.up.railway.app/hora-semanal/profesor/1');
        const data = await response.json();
        let datos = {}
        const ids = cita.id
        if (response.ok) {
            if (data[0].horasPendientes.length == null) {
                datos = {
                    "horasPendientes": { ids: cita }
                };
            } else {
                const citaCanceladas = data[0].horasPendientes
                const nuevaCita = {
                    ...citaCanceladas,
                    [ids]: cita

                }
                datos = {
                    "horasPendientes": nuevaCita
                };
            }
            const dataCita = {
                "estadoCita": 4
            };
            const requestOptionsCita = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataCita)
            };
            const requestOptionsEquipo = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            };
            try {
                const [responseCita, responseEquipo] = await Promise.allSettled([
                    fetch('https://projectppi-backend-production.up.railway.app/citas-asesoria-ppi/' + id, requestOptionsCita),
                    fetch('https://projectppi-backend-production.up.railway.app/hora-semanal/' + data[0].id, requestOptionsEquipo)
                ]);

                if (responseCita.status === 'fulfilled' && responseEquipo.status === 'fulfilled') {
                    setShowCorrecto(true);
                    setTimeout(() => {
                        router.push('/asesorias/visualizar/asesor');
                    }, 2000);
                } else {
                    setShowAlert(true);
                }
            } catch (error) {
                setShowAlert(true);
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
    useEffect(() => {
        if (showOcupado) {
            const timer = setTimeout(() => {
                setShowOcupado(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showOcupado]);
    return (
        <><div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className=' md:h-22 lg:h-22 xl:h-16 sm:h-22  border-b-2 pl-8 pr-80 items-start w-full flex '>
                    <h1 className='text-4xl font-bold text-center text-gray-600'>Visualizar citas de asesorías</h1>
                </div>

                {citaEstado.id == 1 ? (

                    <div className='p-10  grid grid-cols-1 lg:grid-cols-2'>
                        <div className="xl:ml-0">
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                                </div>
                                <div className='-mt-2'>
                                    {estadoModificar ? (
                                        <select
                                            name="estado"
                                            id="estado"
                                            value={selectEstado}
                                            onChange={(e) => {
                                                if (e.target.value === "2") {
                                                    setGrupoTrue(true);
                                                    setSelectEstado(2);
                                                    listarEquipo();
                                                } else {
                                                    setSelectEstado(1)
                                                    setGrupoTrue(false);
                                                }
                                            }}
                                            className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                        >
                                            <option value="1">Disponible</option>
                                            <option value="2">Reservado</option>
                                        </select>
                                    ) :
                                        (
                                            <span className="inline-block mt-1 text-2xl sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-gray-500 text-white font-semibold rounded-full">
                                                {citaEstado.nombre}
                                            </span>
                                        )}
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                                </div>
                                <div>
                                    {estadoModificar ? (

                                        <select value={numeroDia} onChange={(e) => { setNumeroDia(e.target.value) }} className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                        >
                                            {semanaConst.map((dia, index) => (
                                                <option key={index} value={numeroDiaLunes + index}>{dia} {numeroDiaLunes + index}</option>
                                            ))}
                                        </select>
                                    ) :
                                        (<span className="inline-block font-semibold text-2xl text-gray-500  sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3  ">
                                            {fecha}
                                        </span>
                                        )}
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                </div>
                                <div className='flex'>
                                    {estadoModificar ? (

                                        <><select value={horaCancelar} onChange={(e) => { setHoraCancelar(e.target.value) }} id="hora" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                            <option value={horaFija} selected>{horaFija}</option>
                                            {Array.from({ length: horaFin }, (_, i) => i + horaInicio).map(hour => (
                                                <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                            <select value={minConst} onChange={(e) => { setMinConst(e.target.value) }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">

                                                <option value="00">00</option>
                                                <option value="20">20</option>
                                                <option value="40">40</option>
                                            </select></>
                                    ) : (
                                        <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                            {hora}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {grupoTrue ? (
                                <div className="grid grid-cols-2 m-4 sm:m-10">
                                    <div>
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Grupo:</h1>
                                    </div>
                                    <div>
                                        <select onChange={(e) => { setIdEquipo(e.target.value) }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                            <option selected disabled>Grupo</option>
                                            {listEquipos.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.codigoEquipo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>) : null}
                        </div>
                        <div className="justify-center  lg:mt-20 xl:mt-0">
                            {!showModificar ? (
                                !estadoModificar ? (
                                    <>
                                        <button onClick={() => { setEstadoModificar(true); }} className="text-white xl:mt-28 h-14 py-2 px-4 w-full rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Modificar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { modificarCita() }} className="text-white xl:mt-20 h-14 py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Confirmar</button>
                                        <button onClick={() => { setEstadoModificar(false) }} className="text-white xl:mt-7 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>
                                    </>
                                )
                            ) : null}

                        </div>
                    </div>
                ) : (

                    <div className={`p-10  grid grid-cols-1 lg:grid-cols-2  `}>
                        <div className={`xl:ml-0 `}>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estado:</h1>
                                </div>
                                <div className='-mt-2'>
                                    <span className={`inline-block mt-1 text-2xl sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 ${citaEstado.id == 2 ? (`bg-emerald-500`) : citaEstado.id == 1 ? (`bg-gray-500`) : citaEstado.id == 4 ? (`bg-red-500`) : citaEstado.id == 3 ? (`bg-indigo-500`) : (null)} bg-emerald-500 text-white font-semibold rounded-full`}>
                                        {citaEstado.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {fecha}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {hora}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Tipo:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {tipoCita.nombre}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    {tipoCita.id == 1 ? (
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Enlace:</h1>
                                    ) : (
                                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Ubicación:</h1>
                                    )}
                                </div><div>
                                    {tipoCita.id == 1 ? (
                                        <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                            {cita.link}       </span>
                                    ) : (
                                        <span className="inline-block sm:mt-2 ml-2 sm:ml-4 px-2 sm:px-3 py-1 font-semibold text-2xl text-gray-500 ">
                                            {salon}       </span>
                                    )}

                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Equipo:</h1>
                                </div>
                                <div>
                                    <span className="inline-block text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3   ">
                                        {equipo.codigoEquipo}
                                    </span>
                                </div>
                            </div>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Estudiantes:</h1>
                                </div>
                                <div className='block'>
                                    {estudiantesEquipo.map((item) => (
                                        <span key={item.id} className=" text-2xl text-gray-500 sm:mt-2 ml-2 sm:ml-4 font-semibold px-2 sm:px-3">
                                            {item.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {cancelar ? (<div className='justify-center  lg:mt-20 xl:mt-10'>
                            <span className='text-2xl sm:text-4xl font-bold text-gray-600'> Seleccione la nueva fecha para su agendamiento.</span>
                            <div className="m-4 sm:m-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Fecha:</h1>
                                </div>
                                <div>

                                    <select value={diaCancelar} onChange={(e) => { setDiaCancelar(e.target.value) }} className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                    > 
                                            {semanaCancelar.map((parte, index) => (
                                                <>
                                                    {index === 1 && <option disabled>--------- Siguiente semana ---------</option>}
                                                    {parte.map((dia, i) => (
                                                        index === 0 ? (
                                                            <option key={numeroDiaLunes + i+1} value={numeroDiaLunes + index}>{dia} {numeroDiaLunes + i+1}</option>
                                                        ) : (
                                                            <option key={numeroDiaLunes + i + (8-new Date().getDay())} value={numeroDiaLunes + index}>{dia} {numeroDiaLunes + i + (8-new Date().getDay())}</option>
                                                        )
                                                    ))}
                                                </>
                                            ))} 
                                    </select>

                                </div>
                            </div>
                            <div className="mx-4 sm:mx-10 grid grid-cols-2">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-600">Hora:</h1>
                                </div>
                                <div className='flex'>

                                    <><select value={horaConst} onChange={(e) => { setHoraCancelar(e.target.value) }} id="hora" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">
                                        <option value={horaFija} selected>{horaFija}</option>
                                        {Array.from({ length: horaFin }, (_, i) => i + horaInicio).map(hour => (
                                            <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                        <select value={minCancelar} onChange={(e) => { setMinCancelar(e.target.value) }} id="minutos" className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm">

                                            <option value="00">00</option>
                                            <option value="20">20</option>
                                            <option value="40">40</option>
                                        </select></>

                                </div>
                            </div>
                            <div className="justify-center  ">
                                <button onClick={() => { cancelarCita(cita.id) }} class="text-white xl:mt-4 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>
                                <button onClick={() => { setCancelar(false) }} class="text-white xl:mt-10 h-14 py-2 px-4 w-full rounded bg-emerald-400 hover:bg-emerald-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Atras</button>

                            </div>
                        </div>) : (
                            citaEstado.id == 2 ? (<div className="justify-center  lg:mt-20 xl:mt-10">
                                <button class="text-white xl:mt-40 h-14 py-2 px-4 w-full rounded bg-indigo-400 hover:bg-indigo-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Ver Bitácora</button>
                                <button onClick={() => { setCancelar(true)/*cancelarCita(cita.id)*/ }} class="text-white xl:mt-10 h-14 py-2 px-4 w-full rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">Cancelar</button>

                            </div>) : (null)
                        )}

                    </div>)}


            </div>
        </div > {showAlert && (
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
        )
            }
            {showCorrecto && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div class="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Modificado correctamente.</div>
                            <button onClick={() => { setShowCorrecto(!showCorrecto) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showACampos && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>Los campos ingresados son incorrectos, la fecha o la hora no son acordes.</div>
                            <button onClick={() => { setShowACampos(!showACampos) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current text-gray-700" viewBox="0 0 16 16" width="20" height="20">
                                    <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )} {showOcupado && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8">
                    <div className="flex w-96 shadow-lg rounded-lg">
                        <div className="bg-orange-600 py-4 px-6 rounded-l-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-current text-white" width="20" height="20">
                                <path fillRule="evenodd" d="M4.47.22A.75.75 0 015 0h6a.75.75 0 01.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 01-.22.53l-4.25 4.25A.75.75 0 0111 16H5a.75.75 0 01-.53-.22L.22 11.53A.75.75 0 010 11V5a.75.75 0 01.22-.53L4.47.22zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5H5.31zM8 4a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z"></path>
                            </svg>
                        </div>
                        <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
                            <div>La fecha y hora seleccionadas se encuentran ocupadas.</div>
                            <button onClick={() => { setShowOcupado(!showOcupado) }}>
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

export default page