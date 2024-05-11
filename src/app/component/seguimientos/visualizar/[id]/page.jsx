/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect, useState } from 'react'

function page({ params }) {

  const [seguimiento, setSeguimiento] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    const traerEstado = async () => {
      const response = await fetch('http://localhost:3002/seguimiento-ppi/id/' + params.id);
      const data = await response.json();
      if (response.ok) {
        setSeguimiento(data[0]);
        const estudiantesSet = new Set();
        const nuevosEstudiantes = [];
        for (let index = 1; index <= 3; index++) {
          setEstudiantes([])
          const name = "estudiante" + index;
          const name2 = "asistenciaEstudiante" + index;
          const id = data[0][name];
          if (id != null && !estudiantesSet.has(id)) {
            const response2 = await fetch('http://localhost:3002/usuario/' + id);
            const data2 = await response2.json();
            estudiantesSet.add(id);
            nuevosEstudiantes.push([data2, data[0][name2]]);
          }
        }
        setEstudiantes(prev => [...prev, ...nuevosEstudiantes]);
      }
    };
    traerEstado();
  }, [params]);


  return (
    <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
      <div className='pt-8  pb-8 w-full'>
        <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
          <div>
            <h1 className='text-4xl font-bold text-gray-600'>Visualizar asesoría</h1>
          </div>
        </div>
        <div className='p-10 '>
          <div className='text-center grid grid-cols-2'>
            <div>
              <h1 className='text-2xl text-gray-600 font-bold'>Compromisos:</h1>
              <div className='text-xl text-gray-500 font-semibold'>{seguimiento.compromiso}</div>
            </div>
            <div>
              <h1 className='text-2xl text-gray-600 font-bold'>Observaciones:</h1>
              <div className='text-xl text-gray-500 font-semibold'>{seguimiento.observacion}</div>
            </div>
          </div>
          <div>

            <div className='pt-5 text-center'>
              <h1 className='text-2xl text-gray-600 font-bold'>Asistencias:</h1>
              <div>
                {estudiantes.map((item) => (
                  <div className='grid grid-cols-2 mt-3' key={item[0].id}>
                    <div>
                      <span className='text-xl text-gray-500 font-semibold'>
                        {item[0].nombre}
                      </span>
                    </div>
                    <div>
                      <span className={item[1] == 0 ? ('text-xl px-5 py-1 rounded-xl bg-red-500 text-white font-semibold') : ('text-xl px-5 py-1 rounded-xl bg-emerald-500 text-white font-semibold')}>
                        {item[1] == 0 ? (<>No asistió.</>) : (<>asistió.</>)}
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page