'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/** Portrait campaign film. Plays muted on loop only while on screen. */
const CampaignVideo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setUserPaused(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused) {
          v.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play();
      setPlaying(true);
    } else {
      setUserPaused(true);
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-paper-2 ${className}`}>
      <video
        ref={ref}
        src="/img/hero.mp4"
        poster="/img/hero-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Endlezz — The Revival, campaign film"
        className="absolute inset-0 w-full h-full object-cover object-[50%_40%]"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between bg-gradient-to-t from-ink/50 to-transparent text-white">
        <span className="label">The Revival — film</span>
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="w-10 h-10 flex items-center justify-center bg-paper/90 text-ink hover:bg-paper transition-colors"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default CampaignVideo;
