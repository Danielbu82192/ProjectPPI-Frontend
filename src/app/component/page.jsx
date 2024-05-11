/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { SlideBanner, SlideNewsCard } from '@/component/banner/banner'
import React, { useEffect } from 'react'

function page() {

    useEffect(() => {
        const traerSesion = async() => {
            const response = await fetch('http://localhost:3002/usuario/ExisteSesion');
            if(response.ok){ 
                const data = await response.json();
                console.log(data)
            }
        }
    }, []);
    return (
        <div className='bg-white justify-center  flex flex-col px-5 py-20 '><SlideBanner /><SlideNewsCard /></div>

    )
}

export default page