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

  const title1 = getTitleWithYear("Haz click aquí para calificar las entregas de tus equipos a cargo en las asignaturas y los grupos del");
  const title2 = getTitleWithYear("Haz click aquí para crear los equipos en las asignaturas y los grupos que tienes a cargo en el");

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
                  <div className="text-sm font-light tracking-wide text-gray-500">Docente</div>
                </div>
              </li>

              <li>
                <a href="/docente/crearGrupos" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6" title={getTitleWithYear("Haz click aquí para crear los equipos en las asignaturas y los grupos que tienes a cargo en el")}>
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
                <a href="/docente/calificarEntregas" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6" title={getTitleWithYear("Haz click aquí para calificar las entregas de tus equipos a cargo en las asignaturas y los grupos del")}>
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M11.0215 6.78662V19.7866" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M11 19.5C10.7777 19.5 10.3235 19.2579 9.41526 18.7738C8.4921 18.2818 7.2167 17.7922 5.5825 17.4849C3.74929 17.1401 2.83268 16.9678 2.41634 16.4588C2 15.9499 2 15.1347 2 13.5044V7.09655C2 5.31353 2 4.42202 2.6487 3.87302C3.29741 3.32401 4.05911 3.46725 5.5825 3.75372C8.58958 4.3192 10.3818 5.50205 11 6.18114C11.6182 5.50205 13.4104 4.3192 16.4175 3.75372C17.9409 3.46725 18.7026 3.32401 19.3513 3.87302C20 4.42202 20 5.31353 20 7.09655V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M20.8638 12.9393L21.5589 13.6317C22.147 14.2174 22.147 15.1672 21.5589 15.7529L17.9171 19.4485C17.6306 19.7338 17.2642 19.9262 16.8659 20.0003L14.6088 20.4883C14.2524 20.5653 13.9351 20.2502 14.0114 19.895L14.4919 17.6598C14.5663 17.2631 14.7594 16.8981 15.0459 16.6128L18.734 12.9393C19.3222 12.3536 20.2757 12.3536 20.8638 12.9393Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Calificar Entregas</span>
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