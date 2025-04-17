// src/components/VideoPlayer.js
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = forwardRef(({ video, onStateChange, onError }, ref) => {
    const playerRef = useRef(null);
    const [startTime, setStartTime] = useState(40);

    useImperativeHandle(ref, () => ({
        pauseVideo: () => {
            playerRef.current?.pauseVideo();
        },
        playVideo: () => {
            playerRef.current?.playVideo();
        },
        getCurrentTime: () => {
            return playerRef.current ? playerRef.current.getCurrentTime() : 0;
        },
        getDuration: () => {
            return playerRef.current ? playerRef.current.getDuration() : 0;
        },
    }));

    const youtubeOpts = {
        height: '380',
        width: '640',
        playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            start: startTime,
            showinfo: 0,
        },
    };

    const handleReady = (event) => {
        playerRef.current = event.target;
    };

    const handleStateChange = (event) => {
        if (onStateChange) {
            const isPaused = event.data === 2;
            onStateChange(isPaused);
        }
    };

    return (
        <YouTube
            videoId={video?.id}
            opts={youtubeOpts}
            onReady={handleReady}
            onStateChange={handleStateChange}
            onError={onError}
        />
    );
});

export default VideoPlayer;