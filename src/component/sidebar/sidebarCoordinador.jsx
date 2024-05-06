"use client"
import React, { useState } from 'react'
import './css/sidebar.css'

function sidebar({ children }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [click, setClick] = useState(false);

  const showSidebar = () => {
    let slidebar = document.getElementById("slidebar");
    let acorSlidebar = document.getElementById("AcorSlidebar");
    let contSlidebar = document.getElementById("contSlidebar");
    slidebar.classList.toggle("mostrar");
    acorSlidebar.classList.toggle("ocultar");
    contSlidebar.classList.toggle("inactive");
    setClick(true);
  }

  const hiddenSidebar = () => {
    let slidebar = document.getElementById("slidebar");
    let acorSlidebar = document.getElementById("AcorSlidebar");
    let contSlidebar = document.getElementById("contSlidebar");
    slidebar.classList.toggle("mostrar");
    acorSlidebar.classList.toggle("ocultar");
    contSlidebar.classList.toggle("inactive");
    setClick(false);
  }

  const getTitleWithYear = (originalText) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11 en JavaScript

    let year;
    if (currentMonth >= 1 && currentMonth <= 6) {
      year = (currentDate.getFullYear()).toString() + " - 1";
    } else {
      year = (currentDate.getFullYear()).toString() + " - 2";
    }

    return `${originalText} ${year}.`;
  };

  // Uso de la función
  const title1 = getTitleWithYear("Haz click aquí para cargar los archivos y crear los estudiantes, docentes y asesores del");
  const title2 = getTitleWithYear("Haz click aquí para asignar y agrupar a los estudiantes de todos los semestres del");

  return (
    <>
      <div>
        <div id='AcorSlidebar' className="min-h-screen flex flex-col antialiased bg-gray-50 text-gray-800">
          <div className="fixed top-0 left-0 h-16 bg-white w-full border-b flex justify-between items-center">
            <div id='iconAcorSlidebar' onClick={showSidebar} className="ml-4 border rounded-md w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 ">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <div className="mr-4">
              <img src="https://www.politecnicojic.edu.co/images/logo/logo-negro.png" className="h-10 w-auto marg" alt="Logo" />
            </div>
          </div>
        </div>

        <div id="slidebar" className={`fixed w-64 bg-white h-full border-r ${click ? 'mostrar' : ''}`}>

          <a href="../">
            <div className="flex items-center justify-center h-14 border-b">
              <div style={{ margin: "20px" }}><img src="https://www.politecnicojic.edu.co/images/logo/logo-negro.png" /></div>
            </div>
          </a>

          <div className="overflow-y-auto overflow-x-hidden flex-grow max-h-screen">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">Coordinador</div>
                </div>
              </li>
              <li>
                <a href="/coordinador/usuarios" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6" title={getTitleWithYear("Haz click aquí para cargar los archivos y crear los estudiantes, docentes y asesores del")}>
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Cargar Usuarios</span>
                </a>
              </li>

              <li>
                <a href="/coordinador/crearGrupos" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6" title={getTitleWithYear("Haz click aquí para asignar y agrupar a los estudiantes de todos los semestres del")}>
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Crear Equipos</span>
                </a>
              </li>

              <li>
                <a href="/coordinador/asignarAsesor" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Asignar Asesor</span>
                </a>
              </li>

              <li>
                <a href="/asesorias/visualizar/estudiante" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Visualizar Estudiante</span>
                </a>
              </li>

              <li>
                <a href="/coordinador/horasAsesores" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Horas profesores</span>
                </a>
              </li>

              <li>
                <a href="/coordinador/semanas" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Semanas</span>
                </a>
              </li>

              <li>
                <a href="/asesorias/visualizar/agendar" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Agendar</span>
                </a>
              </li>

            </ul>
          </div>
        </div>
        <div className='h-screen w-screen bg-gray-50' onClick={click ? hiddenSidebar : null}>
          <div id='contSlidebar' className={`ml-40 min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800 ${click ? 'hidden' : 'flex'}`}>
            {children}
          </div>
        </div>


      </div ></>
  )
}

export default sidebar