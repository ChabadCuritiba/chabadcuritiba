import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Music, Play, Pause, 
  SkipForward, SkipBack, Sparkles, ChevronUp, ChevronDown, 
  Radio, Loader2, ListMusic
} from 'lucide-react';

export interface ChabadTrack {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  duration: string;
}

export const CHABAD_TRACKS: ChabadTrack[] = [
  {
    id: '1',
    title: "An'im Z'miros",
    subtitle: 'Niggunei Chassidei Chabad • Nichoach',
    url: 'https://archive.org/download/chabadnigunimsou00zalm/01_Anim_z_miros.mp3',
    duration: '2:53'
  },
  {
    id: '2',
    title: 'Niggun Simchá',
    subtitle: 'Melodia de Júbilo & Farbrengen',
    url: 'https://archive.org/download/chabadnigunimsou00zalm/02_Nigun_simcho.mp3',
    duration: '3:13'
  },
  {
    id: '3',
    title: "Ke'ayol Ta'arog (Salmo 42)",
    subtitle: 'Cântico Chassídico de Elevação',
    url: 'https://archive.org/download/chabadnigunimsou00zalm/03_Ke_ayol_ta_arog.mp3',
    duration: '2:26'
  },
  {
    id: '4',
    title: 'Hakofos March (Simchat Torá)',
    subtitle: 'Marcha Festiva Tradicional',
    url: 'https://archive.org/download/chabadnigunimsou00zalm/07_Hakofos_march.mp3',
    duration: '1:53'
  },
  {
    id: '5',
    title: 'Adir Hu',
    subtitle: 'Pessach & Grandes Festas',
    url: 'https://archive.org/download/chabadnigunimsou00zalm/09_Adir_hu.mp3',
    duration: '2:34'
  },
  {
    id: '6',
    title: "Kol Baya'ar",
    subtitle: 'Parábola Chassídica da Busca Divina',
    url: 'https://archive.org/download/chabadnigunimsou00zalm/11_Kol_baya_ar.mp3',
    duration: '2:09'
  }
];

export const AudioPlayerWidget: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = CHABAD_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const loadAndPlayTrack = (index: number, autoPlay: boolean = true) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    if (!audioRef.current) return;
    
    setIsLoading(true);
    audioRef.current.src = CHABAD_TRACKS[index].url;
    audioRef.current.load();

    if (autoPlay) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(err => {
          console.warn('Audio play error:', err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    } else {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '' || audioRef.current.src.endsWith('/')) {
        loadAndPlayTrack(currentTrackIndex, true);
      } else {
        setIsLoading(true);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(err => {
            console.warn('Audio play error:', err);
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % CHABAD_TRACKS.length;
    loadAndPlayTrack(nextIndex, isPlaying);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + CHABAD_TRACKS.length) % CHABAD_TRACKS.length;
    loadAndPlayTrack(prevIndex, isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setProgress((current / dur) * 100);
    }
  };

  return (
    <>
      {/* Native HTML5 Audio */}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => { setIsLoading(false); setIsPlaying(true); }}
        onPause={() => setIsPlaying(false)}
        onError={() => { setIsLoading(false); setIsPlaying(false); }}
      />

      {/* Floating Bottom Music Bar */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full sm:w-96">
        
        {/* Expanded Drawer Tracklist */}
        {isExpanded && (
          <div className="bg-slate-900/95 backdrop-blur-xl border border-chabad-gold/30 rounded-3xl p-4 shadow-2xl mb-3 animate-in slide-in-from-bottom-5 duration-300 text-white space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-chabad-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-chabad-gold">Niggunim Chabad</span>
              </div>
              
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Tracklist selection */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {CHABAD_TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => loadAndPlayTrack(idx, true)}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    currentTrackIndex === idx 
                      ? 'bg-chabad text-white font-bold' 
                      : 'hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="font-mono text-[11px] text-chabad-gold">{idx + 1}.</span>
                    <div className="truncate">
                      <div className="truncate font-semibold">{track.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{track.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 ml-2 shrink-0 font-mono">{track.duration}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Niggunei Chassidei Chabad</span>
              <div className="flex items-center space-x-2">
                <span>Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={e => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 accent-chabad-gold h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

          </div>
        )}

        {/* Minimized Player Bar */}
        <div className="bg-slate-950/90 hover:bg-slate-950 backdrop-blur-md border border-chabad-gold/40 text-white rounded-2xl p-3 shadow-luxury flex items-center justify-between transition-all duration-300">
          
          {/* Left: Icon & Info */}
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0 pr-2"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              isPlaying 
                ? 'bg-chabad text-chabad-gold shadow-gold animate-pulse' 
                : 'bg-white/10 text-slate-300'
            }`}>
              <Music className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-bold text-chabad-gold uppercase tracking-wider">Niggun</span>
                {isPlaying && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </div>
              <div className="font-serif text-xs font-bold text-white truncate">
                {currentTrack.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentTrack.subtitle}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1.5 shrink-0">
            
            {/* Prev Track */}
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Faixa anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-xl bg-chabad-gold hover:bg-yellow-400 text-chabad-dark flex items-center justify-center shadow-md transition-transform hover:scale-105"
              title={isPlaying ? 'Pausar' : 'Tocar'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Próxima faixa"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Expand Drawer Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Lista de faixas"
            >
              <ListMusic className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </>
  );
};
