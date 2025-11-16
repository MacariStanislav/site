'use client';

import { useRef, useState } from 'react';
import '@/styles/home/compoments/videoPlayer.css';
import { Play } from 'lucide-react';

export default function VideoPlayer({ src }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className={`video_container ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
            <video ref={videoRef} className="video_element" src={src} />
            <div className="play_button">
                <Play size={48} />
            </div>
        </div>
    );
}
