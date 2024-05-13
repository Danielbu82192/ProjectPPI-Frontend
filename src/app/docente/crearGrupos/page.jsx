"use client";
import React, { useState, useEffect } from 'react';

function Page() {
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturasUnicas, setAsignaturasUnicas] = useState([]);
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [grupos, setGrupos] = useState([]);
    const [selectedGrupo, setSelectedGrupo] = useState('');
    const [studentSemester, setStudentSemester] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [estudiantesSinEquipo, setEstudiantesSinEquipo] = useState([]);
    const [errorMensaje, setErrorMensaje] = useState('');
    const [mostrarBoton, setMostrarBoton] = useState(false);
    const [ultimoCodigoEquipo, setUltimoCodigoEquipo] = useState(0); // Estado para almacenar el último código de equipo
    const [nuevoEquipoEstudiantes, setNuevoEquipoEstudiantes] = useState([]); // Estado para almacenar los estudiantes seleccionados para el nuevo equipo
    const [ultimoCodigoEquipoLocal, setUltimoCodigoEquipoLocal] = useState(0);
    const [ultimaAsignaturaSeleccionada, setUltimaAsignaturaSeleccionada] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response1 = await fetch('https://td-g-production.up.railway.app/usuario/StudentSemester');
                const response2 = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups');
                if (response1.ok && response2.ok) {
                    const data1 = await response1.json();
                    const data2 = await response2.json();
                    setStudentSemester(data1);
                    setEquipos(data2);
                } else {
                    console.error('Error al obtener datos');
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchAsignaturas() {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/usuario-asignatura/GroupsDocente/57642');
                if (response.ok) {
                    const data = await response.json();
                    setAsignaturas(data);
                    const nombresUnicos = [...new Set(data.map(asignatura => asignatura.Asignatura_Nombre))];
                    setAsignaturasUnicas(nombresUnicos);
                } else {
                    console.error('Error al obtener las asignaturas');
                }
            } catch (error) {
                console.error('Error al obtener las asignaturas:', error);
            }
        }

        fetchAsignaturas();
    }, []);

    useEffect(() => {
        if (selectedAsignatura) {
            const gruposAsignatura = asignaturas.filter(asignatura => asignatura.Asignatura_Nombre === selectedAsignatura);
            setGrupos(gruposAsignatura);
            setSelectedGrupo(''); // Resetear la opción del grupo
        }
    }, [selectedAsignatura, asignaturas]);

    useEffect(() => {
        if (selectedAsignatura && selectedGrupo) {
            const usuariosFiltrados = studentSemester.filter(usuario =>
                usuario.Asignatura_Nombre === selectedAsignatura && usuario.Grupo_Codigo === parseInt(selectedGrupo)
            );
            setUsuarios(usuariosFiltrados);
            if (usuariosFiltrados.length === 0) {
                setErrorMensaje('Este grupo no tiene estudiantes cargados, si consideras que es un error, por favor comunícate con el Coordinador del PPI.');
            } else {
                setErrorMensaje('');
            }
        } else {
            setUsuarios([]);
            setErrorMensaje('');
        }
    }, [selectedAsignatura, selectedGrupo, studentSemester]);

    useEffect(() => {
        if (selectedAsignatura && selectedGrupo) {
            const estudiantesEnEquipos = equipos.filter(equipo =>
                equipo.Asignatura_Nombre === selectedAsignatura && equipo.Grupo_Codigo === parseInt(selectedGrupo)
            ).map(equipo => equipo.Usuario_Nombre);

            const estudiantesSinEquipo = usuarios.filter(usuario =>
                usuario.Asignatura_Nombre === selectedAsignatura &&
                usuario.Grupo_Codigo === parseInt(selectedGrupo) &&
                !estudiantesEnEquipos.includes(usuario.Usuario_Nombre)
            );

            setEstudiantesSinEquipo(estudiantesSinEquipo);
            setMostrarBoton(estudiantesSinEquipo.length > 0);

            // Obtener el último código de equipo y almacenarlo en el estado
            const ultimoCodigo = Math.max(...equipos.map(equipo => parseInt(equipo.Codigo_Equipo.toString().slice(1))));
            setUltimoCodigoEquipo(ultimoCodigo);
        } else {
            setEstudiantesSinEquipo([]);
            setMostrarBoton(false);
        }
    }, [selectedAsignatura, selectedGrupo, usuarios, equipos]);

    const handleCrearEquipo = async () => {
        try {
            let nuevoCodigoEquipo;
            if (ultimoCodigoEquipoLocal === 0 || selectedAsignatura !== ultimaAsignaturaSeleccionada) {
                // Para el primer clic, utilizar la lógica original
                const response1 = await fetch('https://td-g-production.up.railway.app/usuario-asignatura/GroupsDocente/57642');
                const data1 = await response1.json();
                const asignaturaSemestre = data1.find(asignatura => asignatura.Asignatura_Nombre === selectedAsignatura)?.Asignatura_Semestre;
                const response2 = await fetch(`https://td-g-production.up.railway.app/equipo-usuarios/GetGroupsByFirstDigit/${asignaturaSemestre}`);
                const data2 = await response2.json();
                if (data2.length === 0) {
                    // Si el grupo de la asignatura no tiene equipos creados, el nuevo código será el primer número de ese semestre seguido de 1
                    nuevoCodigoEquipo = parseInt(asignaturaSemestre.toString().charAt(0) + '00');
                } else {
                    nuevoCodigoEquipo = Math.max(...data2.map(equipo => parseInt(equipo.Codigo_Equipo))) + 1;
                }
                setUltimaAsignaturaSeleccionada(selectedAsignatura);
            } else {
                // Después del primer clic, incrementar el último código de equipo local en 1
                nuevoCodigoEquipo = ultimoCodigoEquipoLocal + 1;
            }

            const nuevoEquipo = {
                Codigo_Equipo: nuevoCodigoEquipo,
                Usuario_Nombre: "Equipo " + nuevoCodigoEquipo,
                Asignatura_Nombre: selectedAsignatura,
                Grupo_Codigo: parseInt(selectedGrupo)
            };

            setEquipos([...equipos, nuevoEquipo]);
            setUltimoCodigoEquipoLocal(nuevoCodigoEquipo);
            // Actualizar los estudiantes sin equipo (en caso de que se hayan seleccionado estudiantes para el nuevo equipo)
            setEstudiantesSinEquipo(estudiantesSinEquipo.filter(estudiante => !nuevoEquipoEstudiantes.includes(estudiante)));

            // Aquí puedes realizar alguna acción con el nuevo código de equipo, por ejemplo, agregarlo a la lista de equipos
            console.log("Nuevo código de equipo:", nuevoCodigoEquipo);
        } catch (error) {
            console.error('Error al crear equipo:', error);
        }
    };

    const handleSeleccionarEstudiante = (estudiante) => {
        if (nuevoEquipoEstudiantes.length < 3) {
            setNuevoEquipoEstudiantes([...nuevoEquipoEstudiantes, estudiante]);
        } else {
            alert("Ya has seleccionado tres estudiantes para el nuevo equipo");
        }
    };

    const handleDeseleccionarEstudiante = (estudiante) => {
        setNuevoEquipoEstudiantes(nuevoEquipoEstudiantes.filter(e => e !== estudiante));
    };

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Crear Equipos</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div>
                        <label className="text-lg font-medium text-gray-700">Seleccione una asignatura:</label>
                    </div>
                    <br />
                    <select
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                        value={selectedAsignatura}
                        onChange={(e) => setSelectedAsignatura(e.target.value)}
                    >
                        <option value="" disabled></option>
                        {asignaturasUnicas.map((asignatura, index) => (
                            <option key={index} value={asignatura}>{asignatura}</option>
                        ))}
                    </select>
                    <br />
                    {selectedAsignatura && (
                        <div>
                            <label className="text-lg font-medium text-gray-700">Seleccione un grupo:</label>
                            <br />
                            <select
                                className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                                value={selectedGrupo}
                                onChange={(e) => setSelectedGrupo(e.target.value)}
                            >
                                <option value="" disabled></option>
                                {grupos.map((grupo, index) => (
                                    <option key={index} value={grupo.Grupo_Codigo}>{grupo.Grupo_Codigo}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <br />
                    {errorMensaje && <p>{errorMensaje}</p>}
                    {mostrarBoton && (
                        <div className="text-center">
                            <button
                                className="inline-block w-auto border border-gray-300 rounded-md py-2 px-3 bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:border-blue-700"
                                onClick={handleCrearEquipo}
                            >
                                Crear Equipo
                            </button><br /><br />
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {equipos
                            .filter(equipo =>
                                equipo.Asignatura_Nombre === selectedAsignatura &&
                                equipo.Grupo_Codigo === parseInt(selectedGrupo)
                            )
                            .map((equipo, index) => (
                                <div key={index} className="border border-gray-300 rounded p-4">
                                    <h2 className="text-lg font-medium text-gray-700">Equipo {equipo.Codigo_Equipo}</h2>
                                    <ul>
                                        {usuarios
                                            .filter(usuario =>
                                                usuario.Asignatura_Nombre === selectedAsignatura &&
                                                usuario.Grupo_Codigo === parseInt(selectedGrupo) &&
                                                usuario.Usuario_Nombre === equipo.Usuario_Nombre
                                            )
                                            .map((usuario, index) => (
                                                <li key={index}>● {usuario.Usuario_Nombre}</li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                    </div>
                    {selectedAsignatura && selectedGrupo && estudiantesSinEquipo.length > 0 && (
                        <>
                            <br />
                            <h2 className="text-lg font-medium text-gray-700">Estudiantes sin Equipo</h2>
                            <ul>
                                {estudiantesSinEquipo.map((estudiante, index) => (
                                    <li key={index}>
                                        {estudiante.Usuario_Nombre}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {nuevoEquipoEstudiantes.length > 0 && (
                        <>
                            <br />
                            <h2 className="text-lg font-medium text-gray-700">Estudiantes seleccionados para el nuevo equipo</h2>
                            <ul>
                                {nuevoEquipoEstudiantes.map((estudiante, index) => (
                                    <li key={index}>
                                        {estudiante.Usuario_Nombre}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Page;