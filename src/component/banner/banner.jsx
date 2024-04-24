"use client"
import React, { useState } from "react"
import { Zoom } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"

const SlideBanner = () => {
    const images = [
        'Media/banner/b1.jpg',
        'Media/banner/b2.jpg',
        'Media/banner/b3.jpg',
        'Media/banner/b4.jpg',
        'Media/banner/b5.jpg'
    ]

    const zoomInPropieties = {
        indicators: true,
        scale: 1,
        duration: 5000,
        trasitionDuration: 300,
        infinite: true,
        pauseOnHover: true,
        prevArrow: (
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>

            </div>
        ),
        nextArrow: (
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>

            </div>
        ),
    }

    return (
        <Zoom {...zoomInPropieties}>
            {images.map((each, index) => (
                <div key={index} className="flex aling-center content-center justify-center pt-2 max-h-[300px] min-h-[300px] max-w-[100vw] min-w-[100vw]">
                    <img src={each} alt="" className="min-h-min max-h-min min-w-min max-w-min object-cover rounded-lg" />
                </div>
            ))}
        </Zoom>
    )
}

const NewModal = (newContent, newTitle, visible, onClose) => {
    if (!visible) return null
    return (
        <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-2 rounded">
                <h1 className="text-2xl font-bold">{newTitle}</h1>
                <p>{newContent}</p>
                <button onClick={onClose}>X</button>
            </div>
        </div>
    )
}

const NewCard = (key, newTitle, newContent, newImage) => {
    const [showNewModal, setShowNewModal] = useState(false)
    const handleOnClose = () => setShowNewModal(false)
    return (
        <div key={key} className="flex flex-col p-2 rounded-lg border border-solid border-gray-300 bg-slate-50">
            <div className="inset-0 bg-cover bg-center min-h-[100px] max-h-[100px] min-w-[200px] max-w-[200px]">
                <img className="rounded-lg object-cover max-h-[100%] min-h-[100%] max-w-[100%] min-w-[100%]"
                    src={newImage} loading="eager" quality={100} alt="" />
            </div>
            <h2 className="text-base text-ellipsis text-left overflow-y-auto min-h-[70px] max-h-[70px] min-w-[200px] max-w-[200px] my-2 px-1" style={{
                scrollbarColor: "whitegrey white",
                scrollbarWidth: "thin",
                msScrollbarShadowColor: "whitegrey",
                msScrollbarTrackShadowColor: "whitegrey",
                msScrollbarTrackColor: "whitegrey",
            }}>{newTitle}</h2>
            <button className="text-sm border-t border-gray-200" onClick={() => setShowNewModal(true)}>Ver mas</button>
            {NewModal(newContent, newTitle, showNewModal, handleOnClose)}
        </div>
    )
}

const SlideNewsCard = () => {
    const news = [
        {
            title: "Noticia 1",
            content: "Contenido 1",
            image: "/Media/banner/b1.jpg"
        }, {
            title: "Noticia 2",
            content: "Contenido 2",
            image: "/Media/banner/b2.jpg"
        },
        {
            title: "Noticia 3",
            content: "Contenido 3",
            image: "/Media/banner/b3.jpg"
        },
        {
            title: "Noticia 4",
            content: "Contenido 4",
            image: "/Media/banner/b4.jpg"
        }
        ,
        {
            title: "Noticia 5",
            content: "Contenido 5",
            image: "/Media/banner/b5.jpg"
        }
        ,
        {
            title: "Noticia 6: El poli avanza, demostrando presencia con sus deportistas para los juegos olimpicos",
            content: "Contenido 6",
            image: "/Media/banner/b1.jpg"
        }
    ]

    return (
        <div className="flex flex-row justify-center mx-4 px-12 mt-4">
            <div className="flex flex-row min-h-64 min-h-max justify-left overflow-x-auto gap-x-4"
                style={{
                    scrollbarColor: "whitegrey white",
                    msScrollbarShadowColor: "whitegrey",
                    msScrollbarTrackShadowColor: "whitegrey",
                    msScrollbarTrackColor: "whitegrey",
                }}
            >
                {news.map((each, index) => (
                    NewCard(index, each.title, each.content, each.image)
                ))}
            </div>
        </div>
    )
}

export { SlideBanner, SlideNewsCard }