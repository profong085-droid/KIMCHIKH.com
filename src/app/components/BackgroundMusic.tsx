import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import backgroundMusic from "../../assets/victory_lap_anthem.mp3";

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // Default 30% volume
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Initialize audio
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      
      // Enable play on first user interaction (click anywhere on page)
      const enableAutoplay = () => {
        if (audioRef.current && !isPlaying) {
          audioRef.current.play().catch(err => console.log('Audio play failed:', err));
          setIsPlaying(true);
        }
        // Remove the event listener after first interaction
        document.removeEventListener('click', enableAutoplay);
      };
      
      document.addEventListener('click', enableAutoplay);
      
      return () => {
        document.removeEventListener('click', enableAutoplay);
      };
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    // Unmute if volume is adjusted
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src={backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Fixed Music Control Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {/* Volume Slider (shows on hover) */}
        <div className="group relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute bottom-12 right-0 w-32 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer accent-red-500"
            style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
          />
          
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-black/80 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-red-500 hover:border-red-500 transition-all mb-2"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-12 h-12 backdrop-blur border rounded-full flex items-center justify-center transition-all shadow-lg ${
            isPlaying
              ? 'bg-red-600 border-red-500 text-white shadow-red-500/30'
              : 'bg-black/80 border-white/20 text-white/80 hover:text-red-500 hover:border-red-500'
          }`}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause size={20} className="animate-pulse" />
          ) : (
            <Play size={20} />
          )}
        </button>
      </div>
    </>
  );
}
