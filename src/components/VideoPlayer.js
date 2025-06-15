// src/components/VideoPlayer.js
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
    useEffect,
} from 'react';

const VideoPlayer = forwardRef(({ video, onStateChange, onError, onEnd, onReady }, ref) => {
    const playerRef = useRef(null);
    const [startTime, setStartTime] = useState(40);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);

    useImperativeHandle(ref, () => ({
        pauseVideo: () => {
            if (player && typeof player.pauseVideo === 'function') {
                try {
                    player.pauseVideo();
                } catch (e) {
                    console.error('Error pausing video:', e);
                }
            }
        },
        playVideo: () => {
            if (player && typeof player.playVideo === 'function') {
                try {
                    player.playVideo();
                } catch (e) {
                    console.error('Error playing video:', e);
                }
            }
        },
        getCurrentTime: () => {
            if (player && typeof player.getCurrentTime === 'function') {
                try {
                    return player.getCurrentTime();
                } catch (e) {
                    console.error('Error getting current time:', e);
                    return 0;
                }
            }
            return 0;
        },
        getDuration: () => {
            if (player && typeof player.getDuration === 'function') {
                try {
                    return player.getDuration();
                } catch (e) {
                    console.error('Error getting duration:', e);
                    return 0;
                }
            }
            return 0;
        },
        seekTo: (time) => {
            if (player && typeof player.seekTo === 'function') {
                try {
                    player.seekTo(time);
                } catch (e) {
                    console.error('Error seeking:', e);
                }
            }
        },
        mute: () => {
            if (player && typeof player.mute === 'function') {
                try {
                    player.mute();
                } catch (e) {
                    console.error('Error muting:', e);
                }
            }
        },
        unMute: () => {
            if (player && typeof player.unMute === 'function') {
                try {
                    player.unMute();
                } catch (e) {
                    console.error('Error unmuting:', e);
                }
            }
        }
    }));

    useEffect(() => {
        if (!video) return;

        let playerInstance = null;
        let isComponentMounted = true;

        const initPlayer = () => {
            try {
                if (!isComponentMounted || !playerRef.current || !window.YT || !window.YT.Player) {
                    return;
                }

                // Clean up existing player
                if (playerInstance) {
                    try {
                        playerInstance.destroy();
                    } catch (e) {
                        console.warn('Error destroying previous player:', e);
                    }
                }

                playerInstance = new window.YT.Player(playerRef.current, {
                    height: '506',
                    width: '900',
                    videoId: video.id,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        modestbranding: 1,
                        start: startTime,
                        showinfo: 0,
                        rel: 0,
                        iv_load_policy: 3,
                        cc_load_policy: 0,
                        disablekb: 1,
                        fs: 0,
                        playsinline: 1,
                        enablejsapi: 1,
                        origin: window.location.origin
                    },
                    events: {
                        onReady: (event) => {
                            if (!isComponentMounted) return;
                            
                            try {
                                setPlayer(event.target);
                                if (onReady) onReady();
                                
                                // Start muted, then unmute after delay
                                event.target.mute();
                                setTimeout(() => {
                                    if (isComponentMounted && event.target && typeof event.target.unMute === 'function') {
                                        try {
                                            event.target.unMute();
                                        } catch (e) {
                                            console.warn('Error unmuting:', e);
                                        }
                                    }
                                }, 1000);
                            } catch (e) {
                                console.error('Error in onReady:', e);
                            }
                        },
                        onStateChange: (event) => {
                            if (!isComponentMounted) return;
                            
                            try {
                                if (event.data === 1) { // Playing
                                    setIsPlaying(true);
                                    if (onStateChange) onStateChange(false);
                                } else if (event.data === 2) { // Paused
                                    setIsPlaying(false);
                                    if (onStateChange) onStateChange(true);
                                } else if (event.data === 0) { // Ended
                                    if (onEnd) onEnd();
                                }
                            } catch (e) {
                                console.error('Error in onStateChange:', e);
                            }
                        },
                        onError: (event) => {
                            if (!isComponentMounted) return;
                            
                            try {
                                console.error('YouTube player error:', event);
                                if (onError) onError(event);
                            } catch (e) {
                                console.error('Error in onError handler:', e);
                            }
                        }
                    }
                });
            } catch (e) {
                console.error('Error initializing YouTube player:', e);
                if (onError) {
                    try {
                        onError(e);
                    } catch (err) {
                        console.error('Error calling onError:', err);
                    }
                }
            }
        };

        // Load YouTube API if not already loaded
        if (!window.YT) {
            try {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                tag.onerror = (e) => {
                    console.error('Failed to load YouTube API:', e);
                };
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                
                window.onYouTubeIframeAPIReady = () => {
                    if (isComponentMounted) {
                        initPlayer();
                    }
                };
            } catch (e) {
                console.error('Error loading YouTube API:', e);
            }
        } else if (window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = () => {
                if (isComponentMounted) {
                    initPlayer();
                }
            };
        }

        // Cleanup function
        return () => {
            isComponentMounted = false;
            if (playerInstance) {
                try {
                    playerInstance.destroy();
                } catch (e) {
                    console.warn('Error destroying player on cleanup:', e);
                }
            }
            setPlayer(null);
        };
    }, [video, startTime, onReady, onStateChange, onEnd, onError]);

    if (!video) {
        return <div style={{ width: '900px', height: '506px', backgroundColor: '#000' }}>Video Unavailable</div>;
    }

    return (
        <div style={{ position: 'relative', width: '900px', height: '506px', overflow: 'hidden' }}>
            <style>
                {`
                    /* hide YouTube title and controls with CSS that targets the iframe content */
                    .video-container iframe {
                        position: relative;
                        top: -60px;
                        height: 566px !important;
                        width: 900px !important;
                    }
                    .video-container {
                        height: 506px;
                        overflow: hidden;
                    }
                `}
            </style>
            <div className="video-container">
                <div ref={playerRef} />
            </div>
        </div>
    );
});

export default VideoPlayer;