import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Set a modest default volume when the component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Audio playback failed (browser may require interaction):", err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="flex items-center justify-center">
      {/* 
        The 'src' path assumes you placed the mp3 inside frontend/public/audio/bgm.mp3 
        Change the name if your mp3 file is named differently.
      */}
      <audio ref={audioRef} src="/audio/bgm.mp3" loop preload="auto" />
      <button
        onClick={togglePlay}
        className="text-on-surface-variant hover:text-primary transition-all duration-300 p-2 rounded-sm hover:bg-primary/10 border border-transparent hover:border-primary/30 flex items-center justify-center"
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        style={{ fontFamily: "var(--font-label)" }}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
    </div>
  );
}
