import React from 'react';
import styled from 'styled-components';

const Hearts = ({ count }) => {
    return (
        <HeartContainer>
            {[...Array(5)].map((_, index) => (
                <HeartWrapper key={index}>
                    <svg className="heart" viewBox="0 0 24 24">
                        <defs>
                            <clipPath id={`heartClip-${index}`}>
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </clipPath>
                        </defs>
                        <rect className="wave-bg" x="0" y="0" width="24" height="24" clipPath={`url(#heartClip-${index})`}></rect>
                        <rect className="wave" x="0" y={index < Math.floor(count) ? 0 : (index === Math.floor(count) && count % 1 !== 0) ? 12 : 24} width="24" height={index < Math.floor(count) ? 24 : (index === Math.floor(count) && count % 1 !== 0) ? 12 : 0} clipPath={`url(#heartClip-${index})`}></rect>
                    </svg>
                </HeartWrapper>
            ))}
        </HeartContainer>
    );
};

const HeartContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const HeartWrapper = styled.div`
    width: 24px;
    height: 24px;
    position: relative;

    .heart {
        width: 100%;
        height: 100%;
    }

    .wave-bg {
        fill: rgba(73, 115, 255, 0.3); /* semi-transparent background */
    }

    .wave {
        fill: #4973ff;
        transition: transform 0.5s, fill 0.5s;
    }
`;

export default Hearts;