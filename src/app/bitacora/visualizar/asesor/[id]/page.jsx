import React from 'react'

function page({ param }) {
    return (
        <div className="ml-6 mr-6 mt-6 border   bg-white border-b flex justify-between">
            <div className='pt-8  pb-8 w-full'>
                <div className='md:h-22 lg:h-22 xl:h-22 sm:h-22 border-b-2 pl-8 pb-5 pr-52 flex justify-between items-center'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-600'>Nombre proyecto </h1>
                    </div>
                    <div><span className='text-3xl text-gray-600 font-bold'>Equipo: </span><span className='text-3xl text-gray-500 font-semibold'>101</span></div>

                </div>
                <div className='p-10'>
                    <div className=' flex pb-5'>
                        <span className='ml-5 text-4xl font-bold text-gray-600'>Estudiantes:</span>
                        <div className='ml-10 -mt-2'>
                            nombre del estudiante numero 1 <br />
                            nombre del estudiante numero 2<br />
                            nombre del estudiante numero 3
                        </div>
                    </div>
                    <div>
                        <span className='ml-5 text-4xl font-bold text-gray-600'>Descripción:</span>
                        <div className='ml-10 mt-2'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                        </div>
                    </div>
                    <div className='mt-2'>
                        <span className='ml-5 text-4xl font-bold text-gray-600'>Alcance:</span>
                        <div className='ml-10 mt-2'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                        </div>
                    </div>
                    <div className='mt-2'>
                        <div className='grid grid-cols-2'>
                            <div>
                                <span className='ml-5 text-4xl font-bold text-gray-600'>Alcance Socialización 1:</span>
                                <div className='ml-10 mt-2'>
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                                </div>
                            </div>
                            <div>
                                <span className='ml-5 text-4xl font-bold text-gray-600'>Alcance Socialización 2:</span>
                                <div className='ml-10 mt-2'>
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium ea magni exercitationem minima adipisci voluptates, distinctio esse. Repellat ea delectus laborum tempora harum vel vero, porro ex doloremque consectetur perferendis.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full h-ful border-t border-gray-400'>
                    <div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                <thead class="ltr:text-left rtl:text-right">
                                    <tr>
                                        <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Numero</th>
                                        <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Fecha</th>
                                        <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Compromisos</th>
                                        <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Observaciones</th>
                                        <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Asistencias</th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-200">
                                    <tr>
                                        <td class="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">1</td>
                                        <td class="whitespace-nowrap px-4 py-2 text-center text-gray-700">24/05/1995</td>
                                        <td class="whitespace-normal text-center px-4 py-2   text-gray-700">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo labore eius nulla? Atque pariatur quam ab, possimus amet ea rem, aspernatur quo impedit reiciendis nostrum, quos tempore. Necessitatibus, dolorum hic! </td>

                                        <td class="whitespace-normal px-4 py-2 text-center text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam aliquid officiis commodi id, explicabo veritatis minima voluptates distinctio, et deleniti necessitatibus ipsa fugit, nulla magni magnam ad ducimus quidem fuga. </td>   
                                        <td class="whitespace-nowrap px-4 py-2  text-gray-700 text-center">Estudiante numero 1<br/>  Estudiante numero 1<br/>   Estudiante numero 1</td>
                                    </tr>

                                    <tr>
                                        <td class="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">1</td>
                                        <td class="whitespace-nowrap px-4 py-2 text-center text-gray-700">24/05/1995</td>
                                        <td class="whitespace-normal text-center px-4 py-2   text-gray-700">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo labore eius nulla? Atque pariatur quam ab, possimus amet ea rem, aspernatur quo impedit reiciendis nostrum, quos tempore. Necessitatibus, dolorum hic! </td>

                                        <td class="whitespace-normal px-4 py-2 text-center text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam aliquid officiis commodi id, explicabo veritatis minima voluptates distinctio, et deleniti necessitatibus ipsa fugit, nulla magni magnam ad ducimus quidem fuga. </td>   
                                        <td class="whitespace-nowrap px-4 py-2  text-gray-700 text-center">Estudiante numero 1<br/>  Estudiante numero 1<br/>   Estudiante numero 1</td>
                                    </tr>       <tr>
                                        <td class="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">1</td>
                                        <td class="whitespace-nowrap px-4 py-2 text-center text-gray-700">24/05/1995</td>
                                        <td class="whitespace-normal text-center px-4 py-2   text-gray-700">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo labore eius nulla? Atque pariatur quam ab, possimus amet ea rem, aspernatur quo impedit reiciendis nostrum, quos tempore. Necessitatibus, dolorum hic! </td>

                                        <td class="whitespace-normal px-4 py-2 text-center text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam aliquid officiis commodi id, explicabo veritatis minima voluptates distinctio, et deleniti necessitatibus ipsa fugit, nulla magni magnam ad ducimus quidem fuga. </td>   
                                        <td class="whitespace-nowrap px-4 py-2  text-gray-700 text-center">Estudiante numero 1<br/>  Estudiante numero 1<br/>   Estudiante numero 1</td>
                                    </tr>       <tr>
                                        <td class="whitespace-nowrap px-4 py-2 font-medium text-center text-gray-900">1</td>
                                        <td class="whitespace-nowrap px-4 py-2 text-center text-gray-700">24/05/1995</td>
                                        <td class="whitespace-normal text-center px-4 py-2   text-gray-700">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo labore eius nulla? Atque pariatur quam ab, possimus amet ea rem, aspernatur quo impedit reiciendis nostrum, quos tempore. Necessitatibus, dolorum hic! </td>

                                        <td class="whitespace-normal px-4 py-2 text-center text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam aliquid officiis commodi id, explicabo veritatis minima voluptates distinctio, et deleniti necessitatibus ipsa fugit, nulla magni magnam ad ducimus quidem fuga. </td>   
                                        <td class="whitespace-nowrap px-4 py-2  text-gray-700 text-center">Estudiante numero 1<br/>  Estudiante numero 1<br/>   Estudiante numero 1</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page