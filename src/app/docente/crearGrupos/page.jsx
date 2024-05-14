"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [equiposAgrupados, setEquiposAgrupados] = useState({}); // Estado para almacenar los equipos agrupados por Codigo_Equipo
    const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]); // Estado para almacenar los estudiantes seleccionados en el popup

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
                    //console.log("Equipos:", data2)
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

            // Agrupar equipos por Codigo_Equipo
            const equiposAgrupados = equipos.filter(equipo =>
                equipo.Asignatura_Nombre === selectedAsignatura && equipo.Grupo_Codigo === parseInt(selectedGrupo)
            ).reduce((groups, equipo) => {
                if (!groups[equipo.Codigo_Equipo]) {
                    groups[equipo.Codigo_Equipo] = [];
                }
                groups[equipo.Codigo_Equipo].push(equipo);
                return groups;
            }, {});

            setEstudiantesSinEquipo(estudiantesSinEquipo);
            setMostrarBoton(estudiantesSinEquipo.length > 0);
            setEquiposAgrupados(equiposAgrupados); // Nuevo estado para los equipos agrupados
        } else {
            setEstudiantesSinEquipo([]);
            setMostrarBoton(false);
            setEquiposAgrupados({});
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

            //console.log("Estudiantes seleccionados:", estudiantesSeleccionados);

            const nuevosEquipos = estudiantesSeleccionados.map((estudiante) => ({
                Usuario_ID: estudiante.Usuario_ID,
                Codigo_Equipo: nuevoCodigoEquipo,
                Usuario_Nombre: estudiante.Usuario_Nombre,
                Asignatura_Nombre: selectedAsignatura,
                Grupo_Codigo: parseInt(selectedGrupo)
            }));

            //console.log("Nuevos equipos:", nuevosEquipos); // Verifiquemos los nuevos equipos antes de agregarlos

            setEquipos([...equipos, ...nuevosEquipos]);

            // Mapear nuevosEquipos y formatear los datos como se espera para enviar al servidor
            // Convertir objetos a formato requerido
            const datosParaEnviar = nuevosEquipos.map(equipo => ({
                Codigo_Equipo: equipo.Codigo_Equipo,
                Usuario_ID: [equipo.Usuario_ID] // Convertir a un array de un solo elemento
            }));

            // Realizar la solicitud POST al endpoint con los datos formateados
            axios.post('https://td-g-production.up.railway.app/equipo-usuarios/CreateGroups', datosParaEnviar, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    //console.log('Respuesta del servidor:', response.data);
                    // Si necesitas hacer algo con la respuesta del servidor, puedes hacerlo aquí
                })
                .catch(error => {
                    console.error('Error al enviar datos al servidor:', error);
                });

            // Limpiar la lista de estudiantes seleccionados
            setEstudiantesSeleccionados([]);

            // Actualizar los equipos con el nuevo equipo
            setUltimoCodigoEquipoLocal(nuevoCodigoEquipo);

            // Filtrar los estudiantes sin equipo para excluir los seleccionados
            const nuevosEstudiantesSinEquipo = estudiantesSinEquipo.filter(estudiante => !nuevoEquipoEstudiantes.includes(estudiante));

            // Actualizar los estudiantes sin equipo con la nueva lista filtrada
            setEstudiantesSinEquipo(nuevosEstudiantesSinEquipo);

            // Limpiar la lista de estudiantes seleccionados
            setNuevoEquipoEstudiantes([]);

            // Aquí puedes realizar alguna acción con el nuevo código de equipo, por ejemplo, agregarlo a la lista de equipos
            //console.log("Nuevo código de equipo:", nuevoCodigoEquipo);
        } catch (error) {
            console.error('Error al crear equipo:', error);
        }
    };

    const toggleEstudianteSeleccionado = (estudiante) => {
        // Verificar si el estudiante ya está seleccionado
        const index = estudiantesSeleccionados.indexOf(estudiante);
        if (index === -1) {
            // Si no está seleccionado, agregarlo si el límite de 3 no se ha alcanzado
            if (estudiantesSeleccionados.length < 3) {
                setEstudiantesSeleccionados([...estudiantesSeleccionados, estudiante]);
            }
        } else {
            // Si ya está seleccionado, quitarlo
            const updatedSelection = [...estudiantesSeleccionados];
            updatedSelection.splice(index, 1);
            setEstudiantesSeleccionados(updatedSelection);
        }
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
                    <br />
                    <div className="bg-gray-100 p-4">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Estudiantes sin Equipo</h2>
                        <hr />
                        <ul className="m-4 flex flex-col gap-2">
                            {estudiantesSinEquipo.map((estudiante, index) => (
                                <li key={index} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={estudiantesSeleccionados.includes(estudiante)}
                                        onChange={() => toggleEstudianteSeleccionado(estudiante)}
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                    />
                                    <label className="ml-2">{estudiante.Usuario_Nombre}</label>
                                </li>
                            ))}
                        </ul>
                        <br />
                        {mostrarBoton && estudiantesSeleccionados.length > 0 && (
                            <div className="text-center">
                                <button
                                    className="inline-block w-auto border border-gray-300 rounded-md py-2 px-3 bg-green-500 text-white font-semibold hover:bg-green-600 focus:outline-none focus:border-green-700"
                                    onClick={handleCrearEquipo}
                                >
                                    Crear Equipo
                                </button><br /><br />
                            </div>
                        )}

                    </div>
                    <br />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.keys(equiposAgrupados).map((codigoEquipo, index) => (
                            <div key={index} className="border border-gray-300 rounded p-4">
                                <h2 className="text-lg font-medium text-gray-700">Equipo {codigoEquipo}</h2>
                                <ul>
                                    {equiposAgrupados[codigoEquipo].map((equipo, index) => (
                                        <li key={index}> - {equipo.Usuario_Nombre}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
