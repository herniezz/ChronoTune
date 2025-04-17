// src/components/VideoPlayer.js
import React, { forwardRef, useImperativeHandle } from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = forwardRef(({ video, onStateChange }, ref) => {
    if (!video) return null;

    const youtubeOpts = {
        height: '360',
        width: '640',
        playerVars: {
            autoplay: 1,
            start: 40,
            modestbranding: 1,
            controls: 1,
        },
    };

    const handleReady = (event) => {
        // Expose player methods through ref
        useImperativeHandle(ref, () => ({
            pauseVideo: () => event.target.pauseVideo(),
            playVideo: () => event.target.playVideo(),
            getCurrentTime: () => event.target.getCurrentTime(),
            getDuration: () => event.target.getDuration(),
        }));
    };

    const handleStateChange = (event) => {
        // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
        if (onStateChange) {
            const isPaused = event.data === 2;
            onStateChange(isPaused);
        }
    };

    return (
        <YouTube
            videoId={video.youtube_id}
            opts={youtubeOpts}
            onReady={handleReady}
            onStateChange={handleStateChange}
        />
    );
});

export default VideoPlayer;