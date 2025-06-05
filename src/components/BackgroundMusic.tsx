"use client";
import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0.3;
    audio.loop = true;

    audio.play().catch((err) => {
      console.warn("Autoplay bloqueado, esperando interação:", err);
    });
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music.mp3"
      preload="auto"
      loop
    />
  );
}
