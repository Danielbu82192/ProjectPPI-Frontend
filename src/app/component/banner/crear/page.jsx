// import React from 'react'

// function page() {
//     return (
//         <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
//             <div className='pt-8 pb-8 w-full'>
//                 <div className=' md:h-22 lg:h-16 xl:h-22 sm:h-22  border-b-2 pl-8 items-start w-full flex '>
//                     <h2 className='text-4xl font-bold text-center text-gray-600'>Crear: Contenido informativo</h2>
//                 </div>
//                 <div className='p-5'>
//                     <div className='flex flex-row flex-wrap justify-evenly w-[100%]'>
//                         <div className='flex flex-col w-[95%] lg:w-[45%] gap-y-4'>
//                             <div className='flex flex-col'>
//                                 <label className='mx-1' htmlFor='titulo'>Titulo</label>
//                                 <input type='text' placeholder='Titulo' id='titulo'></input>
//                             </div>
//                             <div className='flex flex-col'>
//                                 <label for="contenido" class="form-label">Contenido</label>
//                                 <textarea className="h-[40vh]" name="" id="contenido" rows=""></textarea>
//                             </div>
//                         </div>
//                         <div className='flex flex-col w-[95%] lg:w-[45%] gap-y-4'>
//                             <div className='flex flex-col'>
//                                 <label className='mx-1' htmlFor='fechaInicio'>Inicio de publicación</label>
//                                 <input type='Date' id='fechaInicio'></input>
//                             </div>
//                             <div className='flex flex-col'>
//                                 <label className='mx-1' htmlFor='fechaFin'>Fin de publicación</label>
//                                 <input type='Date' id='fechaFin'></input>
//                             </div>
//                             <div className='flex flex-col'>
//                                 <label className='mx-1' htmlFor='visible'>Imagen</label>
//                                 <input type='file'></input>
//                             </div>

//                             <div className='flex flex-row flex-wrap justify-between'>
//                                 <div className='flex flex-row w-[35%] justify-left'>
//                                     <h2>Tipo:</h2>
//                                     <div className='flex flex-col w-[60%]'>
//                                         <div className='flex flex-row items-center justify-between'>
//                                             <label className='mx-1' htmlFor='banner'>Banner</label>
//                                             <input type='checkbox' id='banner' className='rounded-full'></input>
//                                         </div>
//                                         <div className='flex flex-row items-center justify-between'>
//                                             <label className='mx-1' htmlFor='noticia'>Noticia</label>
//                                             <input type='checkbox' id='noticia' className='rounded-full'></input>
//                                         </div>
//                                     </div>

//                                 </div>
//                                 <div className='flex flex-row w-[35%] justify-left'>
//                                     <h2>Visibilidad:</h2>
//                                     <div className='flex flex-col w-[50%]'>
//                                         <div className='flex flex-row items-center justify-between'>
//                                             <label className='mx-1' htmlFor='visible'>Visible</label>
//                                             <input type='checkbox' id='visible' className='rounded-full' defaultChecked ></input>
//                                         </div>
//                                         <div className='flex flex-row items-center justify-between'>
//                                             <label className='mx-1' htmlFor='oculto'>Oculto</label>
//                                             <input type='checkbox' id='oculto' className='rounded-full' ></input>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <button className='text-white py-2 px-4 w-full rounded bg-green-400 hover:bg-green-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5'>Crear</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div >
//     )
// }

// export default page

import React from 'react'
import BannerForm from '@/component/banner/bannerForm'

function Page() {
    return (
        <div className="ml-6 mr-6 mt-6 border bg-white border-b flex justify-between">
            <div className='pt-8 pb-8 w-full'>
                <div className=' md:h-22 lg:h-16 xl:h-22 sm:h-22  border-b-2 pl-8 items-start w-full flex '>
                    <h2 className='text-4xl font-bold text-center text-gray-600'>Crear: Contenido informativo</h2>
                </div>
                <div className='p-5'>
                    <BannerForm type={1}/>
                </div>
            </div>
        </div >
    );
}

export default Page;