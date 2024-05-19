"use client"
import React, { useState, useEffect } from "react"
import { Zoom } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"

const NewModal = (newContent, newTitle, newImg, visible, onClose) => {
    if (!visible) return null
    return (
        <div className="fixed inset-0 z-10 bg-grey bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
            <div className="flex flex-col bg-white p-2 rounded-lg h-[80vh] w-[80vw] border border-solid border-gray-300">
                <div className="flex flex-row min-w-[100%] max-w-[100%] gap-x-2 justify-between items-start">
                    <h1 className="text-2xl font-bold p-2">{newTitle}</h1>
                    <button className="p-2" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>

                </div>
                <div className='flex flex-col gap-2 overflow-x-auto'>
                    <div className="flex w-[100%] justify-center">
                        <img src={newImg} alt="" className="w-[78vw] object-cover rounded-lg" />
                    </div>
                    <p>{newContent}</p>
                </div>
            </div>
        </div>
    )
}

const NewCard = ({ key, newTitle, newContent, newImage }) => {
    const [showNewModal, setShowNewModal] = useState(false);

    const handleOnClose = () => setShowNewModal(false);

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
            {showNewModal && NewModal(newContent, newTitle, newImage, showNewModal, handleOnClose)}
        </div>
    )
};

const SlideBanner = () => {
    const [banners, setBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch('http://localhost:3002/banner/tipo/1');
                const data = await response.json();
                setBanners(data);
            } catch (error) {
                return `Error en la consulta de banners: ${error}`;
            }
        };

        fetchBanners();
    }, []);

    const zoomInPropieties = {
        indicators: true,
        scale: 1,
        duration: 8000,
        trasitionDuration: 10,
        infinite: true,
        pauseOnHover: true,
        prevArrow: (
            <div className="flex items-center content-center justify-center min-w-[30px] min-h-[30px] rounded-full bg-slate-100 m-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>

            </div>
        ),
        nextArrow: (
            <div className="flex items-center content-center justify-center min-w-[30px] min-h-[30px] rounded-full bg-slate-100 m-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            </div>
        ),
    };

    const openModal = (banner) => {
        setSelectedBanner(banner);
    };

    const closeModal = () => {
        setSelectedBanner(null);
    };

    if (banners.length > 0) {
        if (banners.length === 1) {
            return (
                <>
                    <img src={`http://localhost:3002${banners[0].urlImagen}`} className="object-cover min-w-[100%] rounded-lg" loading="eager" alt="" onClick={() => openModal(banners[0])} />
                    {selectedBanner && NewModal(selectedBanner.contenidoBanner, selectedBanner.nombre, `http://localhost:3002${selectedBanner.urlImagen}`, true, closeModal)}
                </>
            )
        }
        return (
            <>
                <Zoom {...zoomInPropieties}>
                    {banners.map((banner, index) => (
                        <img key={index} src={`http://localhost:3002${banner.urlImagen}`} className="object-cover min-w-[100%]" loading="eager" alt="" onClick={() => openModal(banner)} />
                    ))}
                </Zoom>
                {selectedBanner && NewModal(selectedBanner.contenidoBanner, selectedBanner.nombre, `http://localhost:3002${selectedBanner.urlImagen}`, true, closeModal)}
            </>
        );
    } else {
        return (
            <img className='w-[100%] m-4 rounded-lg' src="https://www.politecnicojic.edu.co/images/logo/logo-negro.png" alt="" />
        )
    }
};


const SlideNewsCard = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:3002/banner/tipo/2');
                const data = await response.json();
                setNews(data);
            } catch (error) {
                console.error('Error en la consulta de noticias:', error);
            }
        };

        fetchNews();
    }, []);

    if (news.length > 0) {
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
                        <NewCard key={index} newTitle={each.contenidoBanner} newContent={each.nombre} newImage={`http://localhost:3002${each.urlImagen}`} />
                    ))}
                </div>
            </div>
        )
    } else {
        return (
            <div className="">
                No hay novedades en el momento!
            </div>
        )
    }

}

export { SlideBanner, SlideNewsCard }
