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
                  <div className="text-sm font-light tracking-wide text-gray-500">Asesor</div>
                </div>
              </li>

              <li>
                <a href="/asesor/calificarEntregas" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6" title={getTitleWithYear("Haz click aquí para crear los equipos en las asignaturas y los grupos que tienes a cargo en el")}>
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

              <li>
                <a href="/asesor/calificarAsesoria" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6" title={getTitleWithYear("Haz click aquí para crear los equipos en las asignaturas y los grupos que tienes a cargo en el")}>
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                      <path d="M14.5995 20.4737L7.63427 21.7672C6.2983 22.0153 5.63031 22.1393 5.24549 21.7545C4.86067 21.3697 4.98471 20.7016 5.2328 19.3656L6.52621 12.4001C6.73362 11.2831 6.83732 10.7246 7.20549 10.3872C7.57365 10.0497 8.24697 9.98389 9.59359 9.85218C10.8915 9.72524 12.1197 9.28032 13.4 8L19 13.6005C17.7197 14.8808 17.2746 16.1083 17.1474 17.4062C17.0155 18.753 16.9495 19.4264 16.6121 19.7945C16.2747 20.1626 15.7163 20.2663 14.5995 20.4737Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                      <path d="M13 16.2105C12.4405 16.1197 11.9289 15.8763 11.5263 15.4737M11.5263 15.4737C11.1237 15.0711 10.8803 14.5595 10.7895 14M11.5263 15.4737L6 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                      <path d="M13.5 8C14.1332 7.06586 15.4907 5.16107 16.7613 5.00976C17.6287 4.90648 18.3472 5.62499 19.7842 7.06202L19.938 7.2158C21.375 8.65283 22.0935 9.37135 21.9902 10.2387C21.8389 11.5092 19.9341 12.8668 19 13.5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                      <path d="M5 8L5 2M2 5H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">Calificar Asesoría</span>
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