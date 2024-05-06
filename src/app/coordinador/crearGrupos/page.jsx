"use client"
import React, { useState, useEffect } from 'react';

function Page() {
    const [semester, setSemester] = useState('');
    const [users, setUsers] = useState([]);
    const [program, setProgram] = useState('');
    const [groupComponents, setGroupComponents] = useState([]);
    const [groupCounter, setGroupCounter] = useState(1);
    const [maxGroupCount, setMaxGroupCount] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [groupNumbersBySemester, setGroupNumbersBySemester] = useState({});
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [groupsJSON, setGroupsJSON] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [studentsWithoutGroup, setStudentsWithoutGroup] = useState([]);
    const [groupedStudents, setGroupedStudents] = useState({});

    useEffect(() => {
        const fetchUsersBySemester = async () => {
            setLoadingStudents(true);
            try {
                const response = await fetch('https://td-g-production.up.railway.app/usuario/StudentSemester');
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                const data = await response.json();
                const filteredUsers = data.filter(user => user.Usuario_Semestre === parseInt(semester));
                setUsers(filteredUsers);
                setMaxGroupCount(filteredUsers.length);
                setGroupCounter(1);
                setButtonDisabled(false);
                setSelectedStudents([]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingStudents(false);
            }
        };

        const fetchGroupsByFirstDigit = async () => {
            try {
                const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/GetGroupsByFirstDigit/' + semester);
                if (!response.ok) {
                    throw new Error('Error al obtener los grupos por primer dígito');
                }
                const data = await response.json();
                const grouped = {};
                data.forEach(student => {
                    if (!grouped[student.Codigo_Equipo]) {
                        grouped[student.Codigo_Equipo] = [];
                    }
                    grouped[student.Codigo_Equipo].push(student.Usuario_Nombre);
                });
                setGroupedStudents(grouped);
            } catch (error) {
                console.error(error);
            }
        };

        if (semester !== '') {
            fetchUsersBySemester();
            fetchGroupsByFirstDigit();
            if (parseInt(semester) >= 1 && parseInt(semester) <= 4) {
                setProgram('Técnica Profesional en Programación de Sistemas de Información');
            } else if (parseInt(semester) >= 5 && parseInt(semester) <= 6) {
                setProgram('Tecnología en Sistematización de Datos');
            }
        }
    }, [semester]);

    useEffect(() => {
        const allStudents = users.map(user => user.Usuario_Nombre);
        const studentsWithGroup = Object.values(groupedStudents).flat();
        const studentsWithoutGroup = allStudents.filter(student => !studentsWithGroup.includes(student));
        setStudentsWithoutGroup(studentsWithoutGroup);
    }, [users, groupedStudents]);

    const handleSemesterChange = (event) => {
        setSemester(event.target.value);
    };

    const handleCreateGroup = () => {
        const lastGroupNumber = groupNumbersBySemester[semester] || 0;
        const newGroupNumber = lastGroupNumber + 1;
        const updatedGroupNumbersBySemester = { ...groupNumbersBySemester, [semester]: newGroupNumber };
        setGroupNumbersBySemester(updatedGroupNumbersBySemester);

        if (newGroupNumber <= maxGroupCount) {
            const groupInfo = selectedStudents
                .filter(student => student.groupNumber === groupCounter)
                .map(student => student.student.Usuario_ID);

            const newGroup = {
                Codigo_Equipo: `${semester}${newGroupNumber < 10 ? `0${newGroupNumber}` : newGroupNumber}`,
                Usuario_ID: groupInfo
            };

            setGroupsJSON(prevGroupsJSON => [...prevGroupsJSON, newGroup]);

            setGroupComponents([
                ...groupComponents,
                <GroupSelector
                    key={groupCounter}
                    users={users}
                    semester={semester}
                    groupNumber={newGroupNumber}
                    selectedStudents={selectedStudents.filter(student => student.groupNumber !== newGroupNumber)}
                    setSelectedStudents={setSelectedStudents}
                    groupCounter={groupCounter}
                    setGroupsJSON={setGroupsJSON}
                />
            ]);
            setGroupCounter(groupCounter + 1);
        } else {
            setButtonDisabled(true);
        }
    };

    const handleLoadGroups = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://td-g-production.up.railway.app/equipo-usuarios/CreateGroups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(groupsJSON)
            });

            if (!response.ok) {
                throw new Error('Error al cargar los equipos');
            }

            setPopupMessage('¡Carga Lista! Los equipos han sido creados exitosamente');

            setTimeout(() => {
                setPopupMessage('');
                setLoading(false);
                window.location.reload(); // Refrescar la página después de mostrar el mensaje
            }, 1300);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full text-center'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Crear Equipos</h1>
                    </div>
                </div>
                <div className='p-10'>
                    <div>
                        <label className="text-lg font-medium text-gray-700">Seleccione un semestre:</label>
                        <select className="mt-1 block w-full rounded-md border-gray-200 shadow-sm sm:text-sm" onChange={handleSemesterChange} value={semester}>
                            <option disabled value=""></option>
                            <optgroup label="Técnica Profesional en Programación de Sistemas de Información">
                                <option value="1">Semestre 1</option>
                                <option value="2">Semestre 2</option>
                                <option value="3">Semestre 3</option>
                                <option value="4">Semestre 4</option>
                            </optgroup>
                            <optgroup label="Tecnología en Sistematización de Datos">
                                <option value="5">Semestre 5</option>
                                <option value="6">Semestre 6</option>
                            </optgroup>
                        </select>
                    </div>
                    <br />
                    {semester !== '' && (
                        <>
                            {loadingStudents ? (
                                <p>Cargando estudiantes...</p>
                            ) : (
                                <div>
                                    <br />
                                    <h2>Estudiantes de Semestre {semester} en {program}</h2>
                                    {studentsWithoutGroup.length > 0 && (
                                        <>
                                            <br /><h2 className="text-lg font-medium text-gray-700">Estudiantes sin Equipo</h2>
                                            <br />
                                            <ul>
                                                {studentsWithoutGroup.map((student, index) => (
                                                    <li key={index}>{`• ${student}`}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {Object.entries(groupedStudents).map(([group, students]) => (
                                            <div key={group} className="bg-white overflow-hidden shadow rounded-lg">
                                                <div className="px-4 py-5 sm:p-6">
                                                    <h3 className="bg-gray-100 text-lg font-medium text-gray-900">Equipo {group}</h3>
                                                    <ul>
                                                        {students.map((student, index) => (
                                                            <div key={index} className="rounded-lg p-4 flex items-center">
                                                                <span className="text-green-500 text-xl font-bold mr-2">•</span>
                                                                <span>{student}</span>
                                                            </div>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <br />
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleCreateGroup}
                                    disabled={buttonDisabled || semester === ''}
                                    style={{ cursor: buttonDisabled ? 'not-allowed' : 'pointer' }}
                                >
                                    Crear Equipo
                                </button>
                                {groupComponents.map(groupComponent => (
                                    <div key={groupComponent.key}>{groupComponent}</div>
                                ))}
                                {groupComponents.length > 0 && (
                                    <div>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                                            onClick={handleLoadGroups}
                                            disabled={loading}
                                            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                                        >
                                            {loading ? 'Creando equipos...' : 'Cargar Equipos'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {popupMessage && <Popup message={popupMessage} />}
        </div>
    )
}

const Popup = ({ message }) => {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    ¡Carga Exitosa!
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Los grupos se han conformado correctamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GroupSelector = ({ users, semester, groupNumber, selectedStudents, setSelectedStudents, setGroupsJSON }) => {
    const handleStudentSelect = (event, index) => {
        const selectedStudentId = parseInt(event.target.value);
        const selectedStudent = users.find(user => user.Usuario_ID === selectedStudentId);

        const otherSelectorsInGroup = document.querySelectorAll(`.group-${groupNumber} select`);
        otherSelectorsInGroup.forEach(selector => {
            if (selector !== event.target) {
                const options = selector.querySelectorAll('option');
                options.forEach(option => {
                    if (parseInt(option.value) === selectedStudentId) {
                        option.disabled = true;
                    }
                });
            }
        });

        setSelectedStudents(prevSelectedStudents => {
            const updatedSelectedStudents = prevSelectedStudents.filter(student => !(student.groupNumber > groupNumber && student.student.Usuario_ID === selectedStudentId));
            return [
                ...updatedSelectedStudents,
                { groupNumber, student: selectedStudent }
            ];
        });

        setGroupsJSON(prevGroupsJSON => {
            const updatedGroupsJSON = prevGroupsJSON.map(group => {
                if (group.Codigo_Equipo === `${semester}${groupNumber < 10 ? `0${groupNumber}` : groupNumber}`) {
                    return {
                        ...group,
                        Usuario_ID: [...group.Usuario_ID, selectedStudentId]
                    };
                }
                return group;
            });
            return updatedGroupsJSON;
        });
    };

    const availableStudents = users.filter(user => {
        const isSelected = selectedStudents.some(student => student.groupNumber === groupNumber && student.student.Usuario_ID === user.Usuario_ID);
        return !isSelected;
    });

    const isStudentSelectedInOtherGroup = (studentId) => {
        return selectedStudents.some(student => student.student.Usuario_ID === studentId && student.groupNumber !== groupNumber);
    };

    return (
        <div className={`group-${groupNumber}`}>
            <br />
            <h3 className="text-lg font-medium text-gray-700">Equipo {semester}{groupNumber < 10 ? `0${groupNumber}` : groupNumber}</h3>
            {[0, 1, 2].map(index => (
                <select key={index} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm sm:text-sm" onChange={(e) => handleStudentSelect(e, index)}>
                    <option value="" disabled={index !== 0 ? "disabled" : ""} selected hidden>Seleccionar estudiante</option>
                    {availableStudents.map(user => (
                        <option key={user.Usuario_ID} value={user.Usuario_ID} disabled={isStudentSelectedInOtherGroup(user.Usuario_ID)}>
                            {user.Usuario_Nombre}
                        </option>
                    ))}
                </select>
            ))}
        </div>
    );
};

export default Page;