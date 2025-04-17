// src/utils/errorHandlers.js
import { useState, useCallback, createContext, useContext } from 'react';

const VideoErrorContext = createContext();

const useVideoError = () => {
    return useContext(VideoErrorContext);
};

const VideoErrorProvider = ({ children }) => {
    const [videoError, setVideoError] = useState(false);

    const handlePlayerError = useCallback((event) => {
        const errorCodes = {
            1: "parametry kurwAAAAAA",
            5: "html 5 error.",
            100: "prywatny filmik",
            101: "embedding prywatny.",
        };

        const errorMessage = errorCodes[event.data] || "nowy error co takiego jeszcze nie znasz.";
        console.error(`YouTube Player Error: ${errorMessage}`, event);
    }, []);

    const value = {
        videoError,
        setVideoError,
        handlePlayerError,
    };

    return (
        <VideoErrorContext.Provider value={value}>
            {children}
        </VideoErrorContext.Provider>
    );
};

export function checkForUnreachableCode(component) {
    try {
        const funcStr = component.toString();
        const returnPattern = /return[\s\S]*?;[\s\S]*?(?![\s}]|\/\/|\/\*)/g;
        const matches = funcStr.match(returnPattern);

        if (matches) {
            console.warn('tutaj cos moze nie dzialac:', {
                component: component.name,
                matches
            });
            return matches;
        }

        // Check for unreachable code after break/continue
        const otherPatterns = /(break|continue)[\s\S]*?;[\s\S]*?(?![\s}]|\/\/|\/\*)/g;
        const otherMatches = funcStr.match(otherPatterns);

        if (otherMatches) {
            console.warn('tutaj cos moze nie dzialac po break/continue:', {
                component: component.name,
                matches: otherMatches
            });
            return otherMatches;
        }

        return null;
    } catch (error) {
        console.error('error error houston:', error);
        return null;
    }
}

export { VideoErrorProvider, useVideoError };
// import { checkForUnreachableCode } from '../utils/errorHandlers';
// checkForUnreachableCode(GameScreen);

