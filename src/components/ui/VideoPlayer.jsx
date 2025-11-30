'use client';

import { useState, useRef } from 'react';
import '@/styles/home/compoments/videoPlayer.css';


const VideoPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoLoad = () => {
        setIsLoading(false);
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
    };

    return (
        <div className="video_page_container">
            <div className={`video_container ${isPlaying ? 'playing' : ''}`}>
              
                
                <video
                    ref={videoRef}
                    className="video_element"
                    onClick={togglePlay}
                    onLoadedData={handleVideoLoad}
                    onEnded={handleVideoEnd}
                    playsInline
                    preload="metadata"
                >
                    <source src={src} type="video/mp4" />
                    Ваш браузер не поддерживает видео.
                </video>

                {!isPlaying && !isLoading && (
                    <div className="play_button" onClick={togglePlay}>
                        <div className="play_icon"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;