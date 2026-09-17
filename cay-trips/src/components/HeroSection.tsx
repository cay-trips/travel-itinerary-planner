import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ScrambleIn } from './ScrambleIn';
import { ScreenType } from '../types';

interface HeroSectionProps {
  onNavigate: (screen: ScreenType) => void;
  videoUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  videoUrl = '/hero-bg.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [entranceComplete, setEntranceComplete] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>(videoUrl);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const lastMouseX = useRef<number | null>(null);
  const isSeeking = useRef<boolean>(false);
  const pendingTime = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Check if user has uploaded a custom video in previous sessions
  useEffect(() => {
    try {
      const cached = localStorage.getItem('cay_custom_hero_video_url');
      if (cached) {
        setActiveVideoSrc(cached);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Mouse-scrubbing for video + parallax for static frame
  useEffect(() => {
    const video = videoRef.current;

    const handleSeeked = () => {
      isSeeking.current = false;
      if (pendingTime.current !== null && video) {
        const nextTime = pendingTime.current;
        pendingTime.current = null;
        isSeeking.current = true;
        video.currentTime = nextTime;
      }
    };

    if (video) {
      video.addEventListener('seeked', handleSeeked);
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Relative normalized mouse position (-1 to 1) for 3D aerial tilt
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x: normX, y: normY });

      if (!video) return;

      if (lastMouseX.current === null) {
        lastMouseX.current = e.clientX;
        return;
      }

      const deltaX = e.clientX - lastMouseX.current;
      lastMouseX.current = e.clientX;

      if (!video.duration || isNaN(video.duration)) return;

      const sensitivity = 0.005;
      let targetTime = video.currentTime + deltaX * sensitivity;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));

      if (isSeeking.current) {
        pendingTime.current = targetTime;
      } else {
        isSeeking.current = true;
        video.currentTime = targetTime;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (video) video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [videoLoaded]);

  // Handle direct file upload or drag & drop for the video
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) return;
    const blobUrl = URL.createObjectURL(file);
    setActiveVideoSrc(blobUrl);
    setVideoLoaded(true);
    try {
      localStorage.setItem('cay_custom_hero_video_url', blobUrl);
    } catch (e) {
      // Ignore
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <section
      ref={containerRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative w-full h-screen h-[100dvh] overflow-hidden bg-black flex flex-col justify-between select-none"
    >
      {/* Hidden file input for uploading custom video directly */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Background Layer: Video with Fallback to Aerial Ascent Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Video Player */}
        <video
          ref={videoRef}
          src={activeVideoSrc}
          playsInline
          muted
          loop
          autoPlay
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => {
            // If /hero-bg.mp4 isn't on disk, fallback gracefully to image
            setVideoLoaded(false);
          }}
          className={`w-full h-full object-cover filter contrast-110 brightness-95 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-70' : 'opacity-0'
          }`}
        />

        {/* Photorealistic Aircraft Ascent Fallback with Interactive 3D Cursor Parallax */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-85'
          }`}
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg) scale(${
              1.04 + Math.abs(mousePos.x) * 0.02
            }) translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <img
            src="/hero-bg.jpg"
            alt="Aircraft ascending into twilight sky"
            className="w-full h-full object-cover filter contrast-115 brightness-95"
          />
        </div>

        {/* Deep cinematic vignette & flight gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* Atmospheric Dot Grid Matrix */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Large Background Watermark Text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-['Anton_SC',sans-serif] uppercase font-bold tracking-[-4px] text-white opacity-[0.05] text-[clamp(110px,24vw,440px)] select-none translate-y-12"
          style={{
            background: 'radial-gradient(circle, rgba(227,160,8,0.3) 0%, rgba(255,255,255,0.02) 75%)',
            WebkitBackgroundClip: 'text',
          }}
        >
          DEPARTURE
        </span>
      </div>

      {/* Background Telemetry Badge & Quick Switcher */}
      <div className="absolute top-28 right-6 z-30 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/15 rounded-full font-mono text-[10px] text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E3A008] animate-pulse" />
          <span>ASCENT TELEMETRY // INTERACTIVE</span>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Drag & drop or select an MP4 to load as background"
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full font-mono text-[10px] text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          {videoLoaded ? '⟳ Replace Video' : '⭳ Load MP4'}
        </button>
      </div>

      {/* Content push down spacer */}
      <div className="relative z-20 flex-1" />

      {/* Hero Bottom Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1.0 }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pb-8 sm:pb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
      >
        {/* Left Column */}
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E3A008] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E3A008] animate-ping" />
            <span>FLIGHT LEVEL 380 · CLIMB VECTOR ACTIVE</span>
          </div>

          <h1 className="text-white font-mono font-normal leading-[0.92] tracking-[-0.03em] text-[clamp(38px,8vw,86px)] uppercase">
            <ScrambleIn text="GLOBAL" delay={200} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="HORIZONS" delay={500} triggered={entranceComplete} />
          </h1>

          <motion.p
            initial={{ y: 25, opacity: 0 }}
            animate={entranceComplete ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: [0.215, 0.61, 0.355, 1],
            }}
            className="text-white/60 font-mono text-[13px] sm:text-[14px] leading-relaxed max-w-md"
          >
            Built at the convergence of global meteorological telemetry and algorithmic budget modeling.
            CAY Trips scores destinations, splits group expenses automatically, and guarantees zero hidden platform markups.
          </motion.p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 md:items-end text-left md:text-right">
          <h1 className="text-white font-mono font-normal leading-[0.92] tracking-[-0.03em] text-[clamp(38px,8vw,86px)] uppercase">
            <ScrambleIn text="ZERO" delay={700} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="FRICTION" delay={1000} triggered={entranceComplete} />
          </h1>

          {/* Quick Launch Control Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('recommend')}
              className="px-5 py-3 bg-[#E3A008] hover:bg-[#f4c85f] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(227,160,8,0.25)] active:scale-95"
            >
              RECOMMEND DESTINATION →
            </button>

            <button
              type="button"
              onClick={() => onNavigate('exploreGlobal')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs tracking-wider rounded-xl backdrop-blur-md border border-white/15 transition-all cursor-pointer active:scale-95"
            >
              EXPLORE CITY WEATHER
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
