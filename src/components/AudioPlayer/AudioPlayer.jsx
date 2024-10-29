import { Storage } from '@aws-amplify/storage';
import { useState, useEffect, useRef } from 'react';

const AudioPlayer = ({ songKey }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const getAudioUrl = async () => {
      try {
        // Get a signed URL that's valid for 1 hour
        const url = await Storage.get(songKey, {
          expires: 3600,
        });
        setAudioUrl(url);
      } catch (error) {
        console.error('Error fetching audio URL:', error);
      }
    };

    getAudioUrl();
  }, [songKey]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-md">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <span className="text-sm text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;