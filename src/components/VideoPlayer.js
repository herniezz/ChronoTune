// src/components/VideoPlayer.js
import React from 'react';


const VideoPlayer = ({ video }) => {
    if (!video) return null;
    const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&start=40&controls=0`;

    return (
        <iframe
            width="640"
            height="360"
            src={embedUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="video"
        ></iframe>
    );
};

export default VideoPlayer;