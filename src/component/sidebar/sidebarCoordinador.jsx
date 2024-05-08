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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M12.5 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453365 18.0441 4.1628 16.324 5.57757 15.4816C7.67837 14.2307 10.1368 13.7719 12.5 14.1052C13.3575 14.2261 14.1926 14.4514 15 14.7809" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" stroke-width="1.5" />
                      <path d="M18.5 22L18.5 15M15 18.5H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Cargar Usuarios</span>
                </a>
              </li>

              <li>
                <a href="/coordinador/crearGrupos" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6" title={getTitleWithYear("Haz click aquí para asignar y agrupar a los estudiantes de todos los semestres del")}>
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M20.774 18C21.5233 18 22.1193 17.5285 22.6545 16.8691C23.7499 15.5194 21.9513 14.4408 21.2654 13.9126C20.568 13.3756 19.7894 13.0714 19 13M18 11C19.3807 11 20.5 9.88071 20.5 8.5C20.5 7.11929 19.3807 6 18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M3.22596 18C2.47666 18 1.88067 17.5285 1.34555 16.8691C0.250089 15.5194 2.04867 14.4408 2.73465 13.9126C3.43197 13.3756 4.21058 13.0714 5 13M5.5 11C4.11929 11 3 9.88071 3 8.5C3 7.11929 4.11929 6 5.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M8.0838 15.1112C7.06203 15.743 4.38299 17.0331 6.0147 18.6474C6.81178 19.436 7.69952 20 8.81563 20H15.1844C16.3005 20 17.1882 19.436 17.9853 18.6474C19.617 17.0331 16.938 15.743 15.9162 15.1112C13.5201 13.6296 10.4799 13.6296 8.0838 15.1112Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M15.5 7.5C15.5 9.433 13.933 11 12 11C10.067 11 8.5 9.433 8.5 7.5C8.5 5.567 10.067 4 12 4C13.933 4 15.5 5.567 15.5 7.5Z" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Crear Equipos</span>
                </a>
              </li>

              <li>
                <a href="/coordinador/asignarAsesor" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                  <span className="inline-flex justify-center items-center ml-4">
                    {/* Icono SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M12 22L10 16H2L4 22H12ZM12 22H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 13V12.5C12 10.6144 12 9.67157 11.4142 9.08579C10.8284 8.5 9.88562 8.5 8 8.5C6.11438 8.5 5.17157 8.5 4.58579 9.08579C4 9.67157 4 10.6144 4 12.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M19 13C19 14.1046 18.1046 15 17 15C15.8954 15 15 14.1046 15 13C15 11.8954 15.8954 11 17 11C18.1046 11 19 11.8954 19 13Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 4C10 5.10457 9.10457 6 8 6C6.89543 6 6 5.10457 6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M14 17.5H20C21.1046 17.5 22 18.3954 22 19.5V20C22 21.1046 21.1046 22 20 22H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Asignar Asesor</span>
                </a>

              </li>

              <li>
                <a href="/coordinador/configurarEntregas" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M8 16L16 8M10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8C9.55228 8 10 8.44772 10 9ZM16 14.8284C16 15.3807 15.5523 15.8284 15 15.8284C14.4477 15.8284 14 15.3807 14 14.8284C14 14.2761 14.4477 13.8284 15 13.8284C15.5523 13.8284 16 14.2761 16 14.8284Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Configurar Entregas</span>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M7 17L7 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M12 17L12 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M17 17L17 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Generar Reportes</span>
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