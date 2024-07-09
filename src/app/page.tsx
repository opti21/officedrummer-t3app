"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const images = [
    {
      url: "https://utfs.io/f/e7847959-0eff-4072-aa77-2a6d320691af-c3o020.png",
      alt: "OTK group photo with most of the male members bald",
    },
    {
      url: "https://utfs.io/f/a89ac0e2-6da0-431b-a1f0-16a38c269ba4-8rde2r.png",
      alt: "OTK group photo now all male members have wigs on",
    },
  ];

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
      className={`relative flex items-center justify-center overflow-hidden bg-gray-900 ${
        isFullscreen ? "fixed inset-0 z-50" : "h-screen w-full"
      }`}
    >
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
    </div>
  );
};

export default ImageSlider;
