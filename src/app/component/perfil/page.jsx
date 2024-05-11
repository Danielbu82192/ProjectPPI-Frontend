/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js';


function page() {
    const [showContr, setShowContr] = useState(false);
    const [showMod, setShowMod] = useState(false);
    const [usuarioNest, setUsuarioNest] = useState(false);
    const [usuarioGoogle, setUsuarioGoogle] = useState(false);
    const [rol, setRol] = useState(false);

    const [imagen, setImagen] = useState()
    useEffect(() => {

        const validarSesion = async () => {
            const usuarioNest = localStorage.getItem('U2FsdGVkX1');
            const bytes = CryptoJS.AES.decrypt(usuarioNest, 'PPIITYTPIJC');
            const usuarioN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            const usuarioGoogle = localStorage.getItem('U2FsdGVkX2');
            const bytes2 = CryptoJS.AES.decrypt(usuarioGoogle, 'PPIITYTPIJC');
            const usuarioG = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8)) 
            console.log(usuarioG.picture)
            setImagen(usuarioG.picture)
            setUsuarioGoogle(usuarioG)
            setUsuarioNest(usuarioN) 
            setRol(usuarioN.rol)
        }

        validarSesion()
    }, []);
    return (
        <><div className="p-16">
            <div className="p-8 bg-white shadow mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">

                        {rol.id == 1 ? (
                            <div>
                                <p className="font-bold text-gray-700 text-xl">101</p>
                                <p className="text-gray-400">Grupo</p>
                            </div>
                        ) : rol.id == 3 ? (
                            <>
                                <div>
                                    <p className="font-bold text-gray-700 text-xl">{usuarioNest.hora[0].horasAsignadas}</p>
                                    <p className="text-gray-400">Horas</p>
                                </div><div>
                                    <p className="font-bold text-gray-700 text-xl">{usuarioNest.hora[0].salon}</p>
                                    <p className="text-gray-400">Oficina</p>
                                </div>
                            </>) : null}

                    </div>
                    <div className="relative">
                        <div className=" w-28 h-28 shadow-2xl shadow-gray-600 bg-indigo-100 mx-auto rounded-full   absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                            <img src={imagen} className='w-28 h-28 rounded-full ' />
                        </div>
                    </div>

                    <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                        {showMod ? null : (
                            <button
                                onClick={() => { setShowMod(!showMod) }}
                                className="text-white py-2 px-4 rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                            >
                                Modificar
                            </button>)
                        }
                    </div>
                </div>

                <div className="mt-20 text-center  border-b  pb-12">
                    <h1 className="text-4xl font-medium text-gray-700">{usuarioNest.nombre}</h1>
                    <p className="font-light text-gray-600 mt-3"><span className='font-bold'>Correo: </span>{usuarioNest.correo}</p>
                    <p className="font-light text-gray-600"><span className='font-bold'>Documento: </span>{usuarioNest.documento}</p>
                </div>
                {showMod ? (
                    <div className=" text-center mt-5 ">
                        <div className='grid grid-cols-4 '>
                            <div className=''>
                                <label for="hora" class="block text-xs font-medium text-gray-700"> Oficina </label>

                                <input
                                    type="text"
                                    id="hora"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                />
                            </div>
                            <div className='mt-4'>
                                <button
                                    onClick={() => { setShowMod(!showMod) }}
                                    className="text-white py-2 px-4 rounded bg-orange-400 hover:bg-orange-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => { setShowMod(!showMod) }}
                                    className="text-white ml-4 py-2 px-4 rounded bg-red-400 hover:bg-red-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>

                    </div>
                ) : null}
            </div>

        </div>

        </>
    )
}

export default page