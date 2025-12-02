'use client';

import { useState, useRef, useEffect } from 'react';
import '@/styles/home/compoments/videoPlayer.css';

const VideoPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const controlsTimeout = useRef(null);

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
        setProgress(0);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((currentTime / duration) * 100);
        }
    };

    const handleProgressClick = (e) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = clickPosition * videoRef.current.duration;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const handleMouseEnter = () => {
        setShowControls(true);
        if (controlsTimeout.current) {
            clearTimeout(controlsTimeout.current);
        }
    };

    const handleMouseLeave = () => {
        controlsTimeout.current = setTimeout(() => {
            if (!isPlaying) return; // Не скрываем контролы если видео на паузе
            setShowControls(false);
        }, 2000);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeout.current) {
            clearTimeout(controlsTimeout.current);
        }
        controlsTimeout.current = setTimeout(() => {
            if (!isPlaying) return;
            setShowControls(false);
        }, 2000);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        return () => {
            if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
            }
        };
    }, []);

    return (
        <div className="video_page_container">
            <div 
                className={`video_container ${isPlaying ? 'playing' : ''} ${showControls ? 'show-controls' : ''}`}
                ref={containerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {isLoading && (
                    <div className="loading_spinner">
                        <div className="spinner"></div>
                    </div>
                )}
                
                <video
                    ref={videoRef}
                    className="video_element"
                    onClick={togglePlay}
                    onLoadedData={handleVideoLoad}
                    onEnded={handleVideoEnd}
                    onTimeUpdate={handleTimeUpdate}
                    playsInline
                    preload="metadata"
                    loop
                >
                    <source src={src} type="video/mp4" />
                    Ваш браузер не поддерживает видео.
                </video>

                <div className="video_overlay">
                    {!isPlaying && !isLoading && (
                        <div className="play_button" onClick={togglePlay}>
                            <div className="play_icon"></div>
                        </div>
                    )}
                    
                    <div className="video_controls">
                        <div className="progress_container" onClick={handleProgressClick}>
                            <div className="progress_bar" style={{ width: `${progress}%` }}></div>
                            <div className="progress_thumb" style={{ left: `${progress}%` }}></div>
                        </div>
                        
                        <div className="controls_bottom">
                            <div className="controls_left">
                                <button className="control_btn play_pause_btn" onClick={togglePlay}>
                                    {isPlaying ? (
                                        <span className="pause_icon">❚❚</span>
                                    ) : (
                                        <span className="play_icon">▶</span>
                                    )}
                                </button>
                                
                                <div className="volume_control">
                                    <button className="control_btn volume_btn">
                                        <span className="volume_icon">🔊</span>
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="volume_slider"
                                    />
                                </div>
                                
                                <div className="time_display">
                                    {videoRef.current && (
                                        <>
                                            <span className="current_time">
                                                {formatTime(videoRef.current.currentTime)}
                                            </span>
                                            <span className="time_separator"> / </span>
                                            <span className="duration">
                                                {formatTime(videoRef.current.duration || 0)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <div className="controls_right">
                                <button className="control_btn fullscreen_btn" onClick={toggleFullscreen}>
                                    <span className="fullscreen_icon">⛶</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="instagram_watermark">
                        <span className="insta_logo">📱</span>
                        <span className="insta_text">Instagram Reels</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default VideoPlayer;