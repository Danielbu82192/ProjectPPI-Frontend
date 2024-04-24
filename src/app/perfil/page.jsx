"use client"
import React, { useState } from 'react'


function page() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showContr, setShowContr] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showMod, setShowMod] = useState(false);

    return (
        <><div className="p-16">
            <div className="p-8 bg-white shadow mt-24">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                        <div>
                            <p className="font-bold text-gray-700 text-xl">101</p>
                            <p className="text-gray-400">Grupo</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-700 text-xl">8</p>
                            <p className="text-gray-400">Horas</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-700 text-xl">p13-101</p>
                            <p className="text-gray-400">Oficina</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                            </svg>
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
                    <h1 className="text-4xl font-medium text-gray-700">Jessica Jones</h1>
                    <p className="font-light text-gray-600 mt-3"><span className='font-bold'>Documento: </span>jessica_jones82192@elpoli.edu.co</p>
                    <p className="font-light text-gray-600"><span className='font-bold'>Documento: </span>1035878825</p>
                </div>
                {showMod ? (
                    <div className=" text-center mt-5 ">
                        <div className='grid grid-cols-4 '>
                            <div class="">
                                <label for="hora" class="block text-xs font-medium text-gray-700"> Contraseña </label>

                                <div class="relative mt-1">
                                    <input
                                        type={showContr ? ('text') : ('password')}
                                        id="hora"
                                        class="pr-4 py-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    />
                                    <div onClick={() => { setShowContr(!showContr) }} class="border-l cursor-pointer absolute inset-y-0 right-2 flex items-center pl-2">
                                        {showContr ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>) :
                                            (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>)
                                        }


                                    </div>
                                </div>
                            </div>
                            <div class="mx-5">
                                <label for="hora" class="block text-xs font-medium text-gray-700">Confirmar Contraseña </label>
                                <div class="relative mt-1">
                                    <input
                                        type={showContr ? ('text') : ('password')}
                                        id="hora"
                                        class="pr-4 py-2 w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                    />
                                    <div onClick={() => { setShowContr(!showContr) }} class="border-l cursor-pointer absolute inset-y-0 right-2 flex items-center pl-2">
                                        {showContr ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>) :
                                            (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>)
                                        }


                                    </div>
                                </div>
                            </div>
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