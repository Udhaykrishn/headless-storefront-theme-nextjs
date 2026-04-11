"use client";

import { ChevronLeft, ChevronRight, Package, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState, useRef, MouseEvent, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useEmblaCarousel from "embla-carousel-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

function ImageZoom({ src, alt, className, priority }: ImageZoomProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden cursor-zoom-in h-full w-full", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 ease-out",
          isHovering ? "scale-[2]" : "scale-100"
        )}
        style={{
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-6"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

interface ProductGalleryProps {
  images: {
    url: string;
    altText?: string | null;
  }[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Main Carousel API
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
  });

  // Modal Carousel API
  const [modalEmblaRef, modalEmblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
  });

  const onSelect = useCallback((api: any) => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => onSelect(emblaApi));
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!modalEmblaApi) return;
    modalEmblaApi.on("select", () => onSelect(modalEmblaApi));
  }, [modalEmblaApi, onSelect]);

  // Handle thumbnail clicks
  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
    modalEmblaApi?.scrollTo(index);
  }, [emblaApi, modalEmblaApi]);

  // Sync modal with main gallery when opening
  useEffect(() => {
    if (isModalOpen && modalEmblaApi) {
      modalEmblaApi.scrollTo(activeIndex, true);
    }
  }, [isModalOpen, modalEmblaApi, activeIndex]);

  if (!images.length) {
    return (
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-300">
        <Package className="w-24 h-24" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg group">
          <div className="h-full w-full overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {images.map((img, i) => (
                <div key={`${img.url}-main-${i}`} className="relative flex-[0_0_100%] min-w-0 h-full">
                  <DialogTrigger asChild>
                    <button className="h-full w-full text-left" type="button">
                      <ImageZoom
                        src={img.url}
                        alt={img.altText || title}
                        priority={i === 0}
                      />
                      <div className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <Maximize2 className="w-4 h-4 text-slate-600" />
                      </div>
                    </button>
                  </DialogTrigger>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows (Desktop Only) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-200 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-200 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full z-10">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        <DialogContent className="max-w-[95vw] lg:max-w-[85vw] h-[90vh] p-0 overflow-hidden border-none bg-white rounded-3xl shadow-2xl flex flex-col sm:max-w-none">
          <div className="relative flex-1 bg-white flex items-center justify-center overflow-hidden">
             {/* Modal Carousel */}
            <div className="h-full w-full overflow-hidden" ref={modalEmblaRef}>
              <div className="flex h-full">
                {images.map((img, i) => (
                  <div key={`${img.url}-modal-${i}`} className="relative flex-[0_0_100%] min-w-0 h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-h-[80vh]">
                      <Image
                        src={img.url}
                        alt={img.altText || title}
                        fill
                        className="object-contain p-4 lg:p-12"
                        sizes="90vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => modalEmblaApi?.scrollPrev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-100 flex items-center justify-center transition-all hover:bg-white hover:scale-105 active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-800" />
                </button>
                <button
                  type="button"
                  onClick={() => modalEmblaApi?.scrollNext()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-100 flex items-center justify-center transition-all hover:bg-white hover:scale-105 active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-slate-800" />
                </button>
              </>
            )}
          </div>
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex flex-col gap-0.5 max-w-[70%]">
              <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
              <p className="text-xs text-slate-500">Image {activeIndex + 1} of {images.length}</p>
            </div>
            
            {/* Modal Thumbnails */}
            <div className="hidden sm:flex gap-2">
              {images.map((img, i) => (
                <button
                  key={`${img.url}-modal-thumb-${i}`}
                  onClick={() => modalEmblaApi?.scrollTo(i)}
                  className={cn(
                    "w-10 h-10 rounded-md overflow-hidden border-2 transition-all",
                    i === activeIndex ? "border-indigo-600 scale-110" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <Image src={img.url} alt="" width={40} height={40} className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={`${img.url}-thumb-${i}`}
              type="button"
              onClick={() => scrollTo(i)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                i === activeIndex
                  ? "border-indigo-600 shadow-md shadow-indigo-100"
                  : "border-slate-200 hover:border-slate-400"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText || `Thumbnail ${i + 1}`}
                fill
                className="object-contain p-1.5 bg-white"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
