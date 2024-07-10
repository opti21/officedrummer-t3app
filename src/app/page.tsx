"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const images = [
    {
      url: "https://utfs.io/f/89e1be5a-d2fe-4264-b921-2e15768cb784-qkuk5f.png",
      alt: "OTK group photo",
    },
    {
      url: "https://utfs.io/f/2ca95ff4-8a78-4e4a-85cd-da0cc180690c-bio0yg.png",
      alt: "OTK group photo with most of the male members bald",
    },
    {
      url: "https://utfs.io/f/1d03d5dc-15d0-4b41-8eb2-df40383bb6de-b6x8c2.jpg",
      alt: "A bald officedrummer in space wearing a star trek uniform",
    },
  ];

  const preloadImages = useCallback(() => {
    const imagePromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image.url;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch((error) => console.error("Failed to load images", error));
  }, [images]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-black ${
        isFullscreen ? "fixed inset-0 z-50" : "h-screen w-full"
      }`}
    >
      {!imagesLoaded ? (
        <>
          {/* Loading state background */}
          <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
          <div className="relative z-10 text-2xl font-bold text-white">
            🔥🔥🔥 Loading awesomeness 🔥🔥🔥
          </div>
        </>
      ) : (
        <>
          {/* Projector screen background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/fire-bg.jpg')",
              filter: "brightness(0.3)",
            }}
          ></div>
          {/* Slider container */}
          <div
            className={`relative overflow-hidden rounded-lg bg-white bg-opacity-10 shadow-lg ${
              isFullscreen ? "h-full w-full" : "h-3/4 w-4/5"
            }`}
          >
            {/* Current image */}
            <img
              src={images[currentIndex]?.url}
              alt={images[currentIndex]?.alt}
              className="h-full w-full object-contain"
            />
            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2 text-white"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black bg-opacity-50 p-2 text-white"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
            {/* Fullscreen toggle button */}
            <button
              onClick={toggleFullscreen}
              className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-2 text-white"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                  role="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setCurrentIndex(index)}
                ></div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
