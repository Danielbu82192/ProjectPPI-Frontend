"use client";

"use client";
import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

function Page() {
    const [asignaturas, setAsignaturas] = useState([]);
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const asignaturasResponse = await fetch('https://td-g-production.up.railway.app/usuario-asignatura/GroupsDocente/61560').then(res => res.json());
                setAsignaturas(asignaturasResponse);
                setLoading(false);

                console.log(asignaturasResponse);

            } catch (error) {
                console.error('Error al obtener datos:', error);
                setError('Error al obtener datos.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    if (loading) {
        return <div className="p-6">Cargando...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    if (selectedGrupo) {
        return <GrupoDetail grupo={selectedGrupo} setSelectedGrupo={setSelectedGrupo} />;
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Grupos de asignaturas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {asignaturas.map((asignatura, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 shadow-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedGrupo(asignatura)}
                    >
                        <h2 className="text-lg font-semibold">{asignatura.Asignatura_Nombre}</h2>
                        <p className="text-gray-600">Grupo: {asignatura.Grupo_Codigo}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GrupoDetail({ grupo, setSelectedGrupo }) {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [repeatedTeams, setRepeatedTeams] = useState({});
    const [teamList, setTeamList] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/usuario/StudentSemester');
                const data = await response.json();

                const filteredStudents = data.filter(student =>
                    student.Asignatura_Nombre === grupo.Asignatura_Nombre && student.Grupo_Codigo === grupo.Grupo_Codigo
                ).map(student => ({
                    ...student,
                    Usuario_Nombre: formatStudentName(student.Usuario_Nombre)
                }));
                setStudents(filteredStudents);
            } catch (error) {
                console.error('Error al obtener estudiantes:', error);
                setError('Error al obtener estudiantes.');
            }
        };
        fetchStudents();
    }, [grupo]);

    const handleSort = () => {
        const sortedStudents = [...students].sort((a, b) => {
            const equipoA = isNaN(parseInt(a.equipo)) ? Infinity : parseInt(a.equipo);
            const equipoB = isNaN(parseInt(b.equipo)) ? Infinity : parseInt(b.equipo);

            if (equipoA === Infinity && equipoB === Infinity) {
                return 0;
            }
            if (equipoA === Infinity) {
                return 1;
            }
            if (equipoB === Infinity) {
                return -1;
            }
            return equipoA - equipoB;
        });
        setStudents(sortedStudents);
    };

    const handleEquipoChange = (index, value) => {
        if (value !== '' && parseInt(value) === 0) {
            alert('El número de equipo no puede ser 0.');
            return;
        }

        const newStudents = [...students];
        newStudents[index].equipo = value === '' ? null : value;
        setStudents(newStudents);

        const equipoCounts = newStudents.reduce((acc, student) => {
            if (student.equipo !== null && student.equipo !== '' && !isNaN(student.equipo)) {
                acc[student.equipo] = (acc[student.equipo] || 0) + 1;
            }
            return acc;
        }, {});

        const newRepeatedTeams = {};
        for (const [equipo, count] of Object.entries(equipoCounts)) {
            if (count > 3) {
                newRepeatedTeams[equipo] = true;
            }
        }
        setRepeatedTeams(newRepeatedTeams);
    };

    const validateTeams = () => {
        for (const student of students) {
            if (!student.equipo || parseInt(student.equipo) === 0) {
                alert('Todos los campos de equipo deben estar llenos y no pueden ser 0.');
                return false;
            }
        }

        const equipoCounts = students.reduce((acc, student) => {
            if (student.equipo !== null && student.equipo !== '' && !isNaN(student.equipo)) {
                acc[student.equipo] = (acc[student.equipo] || 0) + 1;
            }
            return acc;
        }, {});
        for (const count of Object.values(equipoCounts)) {
            if (count > 3) {
                alert('Un número de equipo no puede repetirse más de 3 veces.');
                return false;
            }
        }

        return true;
    };

    const handleReportTeams = () => {
        setShowPopup(true);
    };

    async function handleConfirm(confirmed) {
        setShowPopup(false);
        if (confirmed) {
            if (validateTeams()) {
                try {
                    const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetAllGroups');
                    const data = await response.json();

                    let maxEquipoCodigo = 0;
                    // Buscar el mayor Codigo_Equipo que comience con el número de Asignatura_Semestre
                    const asignaturaSemestrePrefix = parseInt(grupo.Asignatura_Semestre);
                    for (const team of data) {
                        const codigoEquipo = parseInt(team.Codigo_Equipo);
                        if (codigoEquipo.toString().startsWith(asignaturaSemestrePrefix.toString())) {
                            if (codigoEquipo > maxEquipoCodigo) {
                                maxEquipoCodigo = codigoEquipo;
                            }
                        }
                    }

                    let newEquipoCodigo;
                    if (maxEquipoCodigo === 0) {
                        // Si no se encontró ningún equipo con el prefijo de Asignatura_Semestre, se crea un nuevo equipo con el formato correcto
                        newEquipoCodigo = asignaturaSemestrePrefix * 100;
                    } else {
                        // Si se encontró algún equipo con el prefijo de Asignatura_Semestre, se crea un nuevo equipo con el siguiente número después del mayor existente
                        newEquipoCodigo = maxEquipoCodigo + 1;
                    }

                    const equiposList = {};
                    students.forEach(student => {
                        if (student.equipo) {
                            if (!equiposList[student.equipo]) {
                                equiposList[student.equipo] = [];
                            }
                            equiposList[student.equipo].push(student.Usuario_ID);
                        }
                    });

                    const newTeams = Object.entries(equiposList).map(([codigoEquipo, usuarios]) => ({
                        Codigo_Equipo: newEquipoCodigo++,
                        Usuario_ID: usuarios
                    }));

                    const createResponse = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/CreateGroups', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newTeams)
                    });

                    if (createResponse.ok) {
                        setTeamList(newTeams);
                    } else {
                        alert('Error al crear los equipos:', error);
                    }
                } catch (error) {
                    console.error('Error al crear los equipos:', error);
                    alert('Error al crear los equipos.');
                }
            }
        } else {
            console.log("No se confirmaron los equipos");
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-4">
                <button onClick={() => setSelectedGrupo(null)} className="p-2 bg-red-500 text-white rounded mr-2">
                    <FiArrowLeft />
                </button>
                <h1 className="text-xl font-bold text-gray-800">
                    Grupo {grupo.Grupo_Codigo} - {grupo.Asignatura_Nombre}
                </h1>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <table className="min-w-full bg-white border border-collapse">
                <thead>
                    <tr>
                        <th className="py-1 px-2 border">Cédula</th>
                        <th className="py-1 px-2 border">Nombre</th>
                        <th className="py-1 px-2 border" style={{ width: '20%' }}>Equipo
                            <svg onClick={handleSort} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" className="cursor-pointer inline-block ml-1">
                                <path d="M3 9L14 9.00008" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 15H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 3H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.521V9M18.5 21C17.7998 21 16.4915 19.0057 16 18.5M18.5 21C19.2002 21 20.5085 19.0057 21 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.Usuario_ID}>
                            <td className="py-1 text-xs px-2 border text-center">{student.Usuario_Documento}</td>
                            <td className="py-1 text-xs px-2 border" style={{ width: '60%' }}>{student.Usuario_Nombre}</td>
                            <td className={`py-1 text-xs px-2 border ${repeatedTeams[student.equipo] ? 'bg-red-200' : ''}`}>
                                <input
                                    type="number"
                                    value={student.equipo || ''}
                                    onChange={(e) => handleEquipoChange(index, e.target.value)}
                                    className="border rounded p-1 text-xs w-full text-center"
                                    min="1"
                                    style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                <button className="bg-green-500 text-white py-2 px-4 rounded mr-2">Guardar tabla</button>
                <button onClick={handleReportTeams} className="bg-red-800 text-white py-2 px-4 rounded">Reportar equipos</button>
            </div>
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <p className="mb-4">¿Estás seguro de tener los equipos listos?</p>
                        <div className="flex justify-center">
                            <button onClick={() => handleConfirm(true)} className="bg-green-500 text-white py-2 px-4 rounded mr-2">Sí</button>
                            <button onClick={() => handleConfirm(false)} className="bg-red-500 text-white py-2 px-4 rounded">No</button>
                        </div>
                    </div>
                </div>
            )}
            {teamList.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-2">Equipos Creados:</h2>
                    <ul>
                        {teamList.map((team, index) => (
                            <li key={index}>
                                <strong>Código de Equipo:</strong> {team.Codigo_Equipo}<br />
                                <strong>Usuarios:</strong> {team.Usuario_ID.join(', ')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function formatStudentName(name) {
    const nameParts = name.trim().split(' ');
    const formattedNameParts = nameParts.map(part => capitalizeFirstLetter(part));
    return formattedNameParts.join(' ');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default Page;
