/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState, useEffect } from 'react'
import './css/sidebar.css'
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';

function sidebar({ children }) {
  const [click, setClick] = useState(false);
  const [notificacionesPendientes, setNotificacionesPendientes] = useState([]);
  const [controlador, setControlador] = useState(0)
  const [rol, SetRol] = useState(0)
  const [imagen, setImagen] = useState()
  const [sesion, setSesion] = useState(false)
  const router = useRouter();
  const btnTextSize = 'text-lg';
  const btnIconSize = 'min-w-7 max-w-7 min-h-7 max-h-7';
  const profileImgSize = 'min-w-8 max-w-8 min-h-8 max-h-8';

  const showSidebar = () => {
    let slidebar = document.getElementById("slidebar");
    let acorSlidebar = document.getElementById("AcorSlidebar");
    let contSlidebar = document.getElementById("contSlidebar");
    slidebar.classList.toggle("mostrar");
    acorSlidebar.classList.toggle("ocultar");
    contSlidebar.classList.toggle("inactive");
    setClick(true);
  }
  useEffect(() => {

    const validarSesion = async () => {
      const usuarioNest = localStorage.getItem('U2FsdGVkX1');
      const usuarioGoogle = localStorage.getItem('U2FsdGVkX2');
      if (usuarioNest == null || usuarioGoogle == null) {
        router.push('/login')
      } else {
        const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
        const NestOriginal = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        const bytes2 = CryptoJS.AES.decrypt(usuarioGoogle, 'PPIITYTPIJC');
        const Googleoriginal = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));
        setSesion(true)
        SetRol(NestOriginal.rol.id)
        setImagen(Googleoriginal.picture)
      }
    }

    const estadoConeccionGoogle = async () => {
      const response = await fetch(`http://localhost:3002/google/check-session`);
      const data = await response.json()
      if (data.isSessionActive) {
        obtenerNotifications();
        validarSesion()
      } else {
        cerrarSesion()
      }
    }
    estadoConeccionGoogle()
  }, []);

  const hiddenSidebar = () => {
    let slidebar = document.getElementById("slidebar");
    let acorSlidebar = document.getElementById("AcorSlidebar");
    let contSlidebar = document.getElementById("contSlidebar");
    slidebar.classList.toggle("mostrar");
    acorSlidebar.classList.toggle("ocultar");
    contSlidebar.classList.toggle("inactive");
    setClick(false);
  }

  const obtenerNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:3002/notificaciones/Pendientes`);
      if (response.ok) {
        const data = await response.json();
        setNotificacionesPendientes(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const cerrarSesion = async () => {
    const response2 = await fetch(`http://localhost:3002/google/logout`);
    localStorage.removeItem('U2FsdGVkX1');
    localStorage.removeItem('U2FsdGVkX2');
    router.push('/login')
  }

  return (
    sesion ? (
      <>
        <div>

          {/*Control del acortador del slidebar*/}
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
            <div className="flex items-center justify-center h-14 border-b">
              <div style={{ margin: "20px" }}><img src="https://www.politecnicojic.edu.co/images/logo/logo-negro.png" /></div>
            </div>
            <div className="overflow-y-auto overflow-x-hidden flex-grow max-h-screen">
              <ul className="flex flex-col py-4 space-y-1 ">
                {controlador == 0 ? (
                  <>
                    {rol != 2 ? (<li>
                      <div
                        onClick={() => {
                          setControlador(1);
                        }}
                        className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primary pr-6 "
                      >
                        <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                          </svg>
                        </span>
                        <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Asesorías</span>
                      </div>
                    </li>) : (null)}

                    <li>
                      <div onClick={() => { setControlador(2) }} className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                        <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                        </span>
                        <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Bitácoras</span>
                      </div>
                    </li>
                    {rol == 4 ? (
                      <>
                        <li>
                          <div onClick={() => { setControlador(3); }} className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Administrar</span>
                          </div>
                        </li>
                        <li>
                          <div onClick={() => { setControlador(3); }} className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Notificaciones</span>
                            {notificacionesPendientes && notificacionesPendientes.length != 0 ? (
                              <span class="px-3 py-1 ml-auto text-lg font-medium tracking-wide text-green-500 bg-green-50 rounded-full">{notificacionesPendientes.length}</span>
                            ) : (
                              null
                            )}
                          </div>
                        </li>
                      </>
                    ) : (null)}
                    <li>
                      <a href="/component/perfil" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 " >
                        <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                          <img src={imagen} className={`${profileImgSize} rounded-full`} />
                        </span>
                        <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Perfil</span>
                      </a>
                    </li>
                    <li>
                      <div
                        onClick={() => { cerrarSesion() }}
                        className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                        <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                          </svg>
                        </span>
                        <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Cerrar sesión</span>
                      </div>
                    </li></>
                ) : controlador == 1 ?
                  (rol == 1 ? (
                    <><li className="px-5">
                      <div className="flex flex-row items-center h-8">
                        <div className="text-sm font-light tracking-wide text-gray-500">
                          Asesorías
                        </div>
                      </div>
                    </li><li >
                        <div onClick={() => { setControlador(0); }} className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                        </div>
                      </li>
                      <li>
                        <a href="/component/asesorias/visualizar/estudiante" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(E)Visualizar Asesorías</span>
                        </a>
                      </li>
                      <li>
                        <a href="/component/asesorias/visualizar/agendar" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(E)Agendar Asesorías</span>
                        </a>
                      </li>
                    </>
                  ) :
                    rol == 3 ? (
                      <>
                        <li className="px-5">
                          <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-500">
                              Asesorías
                            </div>
                          </div>
                        </li><li >
                          <div onClick={() => { setControlador(0); }} className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                          </div>
                        </li>
                        <li>
                          <a href="/component/asesorias/crear" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Crear Asesorías</span>
                          </a>
                        </li>
                        <li>
                          <a href="/component/asesorias/visualizar/asesor" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(A)Visualizar Asesorías</span>
                          </a>
                        </li>
                      </>) :
                      rol == 4 ? (
                        <>
                          <li className="px-5">
                            <div className="flex flex-row items-center h-8">
                              <div className="text-sm font-light tracking-wide text-gray-500">
                                Asesorías
                              </div>
                            </div>
                          </li><li >
                            <div onClick={() => { setControlador(0); }} className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                            </div>
                          </li>
                          <li>
                            <a href="/component/asesorias/visualizar/coordinador" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6 ">
                              <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                              </span>
                              <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(C)Visualizar Asesorías</span>
                            </a>
                          </li>
                        </>) : (null)
                  )
                  : controlador == 2 ? (
                    rol == 1 ? (
                      <><li className="px-5">
                        <div className="flex flex-row items-center h-8">
                          <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                        </div>
                      </li><li onClick={() => { setControlador(0); }}>
                          <div className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>

                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                          </div>
                        </li>
                        <li>
                          <a href="/component/bitacora/visualizar/estudiante" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(E)Visualizar Bitacora</span>
                          </a>
                        </li></>
                    ) : rol == 2 ? (
                      <><li className="px-5">
                        <div className="flex flex-row items-center h-8">
                          <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                        </div>
                      </li><li onClick={() => { setControlador(0); }}>
                          <div className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>

                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                          </div>
                        </li>
                        <li>
                          <a href="/component/bitacora/visualizar/modSol" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(M)Crear Bitácora</span>
                          </a>
                        </li>
                      </>
                    ) : rol == 3 ? (
                      <><li className="px-5">
                        <div className="flex flex-row items-center h-8">
                          <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                        </div>
                      </li><li onClick={() => { setControlador(0); }}>
                          <div className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>

                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                          </div>
                        </li>

                        <li>
                          <a href="/component/bitacora/visualizar/asesor" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(A)Visualizar Bitacora</span>
                          </a>
                        </li>
                      </>
                    ) : rol == 4 ? (
                      <><li className="px-5">
                        <div className="flex flex-row items-center h-8">
                          <div className="text-sm font-light tracking-wide text-gray-500">Bitácoras</div>
                        </div>
                      </li><li onClick={() => { setControlador(0); }}>
                          <div className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>

                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                          </div>
                        </li>
                        <li>
                          <a href="/component/bitacora/visualizar/asesor" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                            <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                            </span>
                            <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>(C)Visualizar Bitacora</span>
                          </a>
                        </li>
                      </>
                    ) : (null)
                  ) : controlador == 3 ? (
                    <><li className="px-5">
                      <div className="flex flex-row items-center h-8">
                        <div className="text-sm font-light tracking-wide text-gray-500">Administrar</div>
                      </div>
                    </li>
                      <li onClick={() => { setControlador(0) }}>
                        <div className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>

                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Atrás</span>
                        </div>
                      </li>
                      <li>
                        <a href="/component/coordinador/horasAsesores" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Horas asesores</span>
                        </a>
                      </li>
                      <li>
                        <a href="/component/coordinador/semanas" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Semanas</span>
                        </a>
                      </li>
                      <li>
                        <a href="/component/banner/administrar" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Contenido</span>
                        </a>
                      </li>
                      <li>
                        <a href="/component/bitacora/visualizar/coordinador/exportar" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" class="w-8 h-8 text-gray-600" viewBox="0 0 50 50">
                              <path d="M 28.875 0 C 28.855469 0.0078125 28.832031 0.0195313 28.8125 0.03125 L 0.8125 5.34375 C 0.335938 5.433594 -0.0078125 5.855469 0 6.34375 L 0 43.65625 C -0.0078125 44.144531 0.335938 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 29.101563 50.023438 29.402344 49.949219 29.632813 49.761719 C 29.859375 49.574219 29.996094 49.296875 30 49 L 30 44 L 47 44 C 48.09375 44 49 43.09375 49 42 L 49 8 C 49 6.90625 48.09375 6 47 6 L 30 6 L 30 1 C 30.003906 0.710938 29.878906 0.4375 29.664063 0.246094 C 29.449219 0.0546875 29.160156 -0.0351563 28.875 0 Z M 28 2.1875 L 28 6.53125 C 27.867188 6.808594 27.867188 7.128906 28 7.40625 L 28 42.8125 C 27.972656 42.945313 27.972656 43.085938 28 43.21875 L 28 47.8125 L 2 42.84375 L 2 7.15625 Z M 30 8 L 47 8 L 47 42 L 30 42 L 30 37 L 34 37 L 34 35 L 30 35 L 30 29 L 34 29 L 34 27 L 30 27 L 30 22 L 34 22 L 34 20 L 30 20 L 30 15 L 34 15 L 34 13 L 30 13 Z M 36 13 L 36 15 L 44 15 L 44 13 Z M 6.6875 15.6875 L 12.15625 25.03125 L 6.1875 34.375 L 11.1875 34.375 L 14.4375 28.34375 C 14.664063 27.761719 14.8125 27.316406 14.875 27.03125 L 14.90625 27.03125 C 15.035156 27.640625 15.160156 28.054688 15.28125 28.28125 L 18.53125 34.375 L 23.5 34.375 L 17.75 24.9375 L 23.34375 15.6875 L 18.65625 15.6875 L 15.6875 21.21875 C 15.402344 21.941406 15.199219 22.511719 15.09375 22.875 L 15.0625 22.875 C 14.898438 22.265625 14.710938 21.722656 14.5 21.28125 L 11.8125 15.6875 Z M 36 20 L 36 22 L 44 22 L 44 20 Z M 36 27 L 36 29 L 44 29 L 44 27 Z M 36 35 L 36 37 L 44 37 L 44 35 Z"></path>
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Exportar</span>
                        </a>
                      </li>
                      <li>
                        <a href="/component/coordinador/semanas" className="cursor-pointer relative flex flex-row items-center h-16 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-primari pr-6">
                          <span className={`inline-flex justify-center items-center ml-4 ${btnIconSize}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </span>
                          <span className={`ml-2 ${btnTextSize} tracking-wide truncate`}>Limpiar sistema</span>
                        </a>
                      </li>
                    </>
                  ) : (null)}
              </ul>
            </div>
          </div>
          <div className='h-screen w-screen bg-gray-50' onClick={click ? hiddenSidebar : null}>
            <div id='contSlidebar' className={`ml-40 min-h-full flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800 ${click ? 'hidden' : 'flex'}`}>
              {/* <div id='contSlidebar' className={`ml-40 min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800 ${click ? 'hidden' : 'flex'}`}> */}
              {children}
            </div>
          </div>
        </div ></>
    ) : (null)
  )
}

export default sidebar