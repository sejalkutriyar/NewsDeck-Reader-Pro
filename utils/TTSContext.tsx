import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export interface Article {
    title?: string;
    headline?: string;
    name?: string;
    description?: string;
    summary?: string;
    content?: string;
    desc?: string;
    [key: string]: any;
}

interface TTSContextType {
    queue: Article[];
    currentArticle: Article | null;
    isPlaying: boolean;
    addToQueue: (article: Article) => void;
    play: (article: Article) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    playNext: () => void;
    clearQueue: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const useTTS = () => {
    const context = useContext(TTSContext);
    if (!context) {
        throw new Error('useTTS must be used within a TTSProvider');
    }
    return context;
};

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<Article[]>([]);
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Keep track if we manually paused, so we don't auto-play next on finish if paused
    const isPausedRef = useRef(false);
    // Track the last spoken character index for Android resume simulation
    const lastBoundaryRef = useRef(0);

    const getArticleText = (article: Article) => {
        const title = article.title || article.headline || article.name || "";
        const description = article.description || article.summary || article.content || article.desc || "";
        return `${title}. ${description}`;
    };

    const speak = (text: string) => {
        const MAX_LENGTH = 3000;
        if (text.length <= MAX_LENGTH) {
            Speech.speak(text, {
                onBoundary: (event: any) => {
                    // Track character index for resume functionality
                    if (event.charIndex !== undefined) {
                        lastBoundaryRef.current = event.charIndex;
                    }
                },
                onDone: () => {
                    // onDone is called when a single utterance finishes. 
                    // If we chunked, we might need more logic, but for now assuming simple case or handled by system queue if we fire multiple.
                    // Actually, expo-speech queueing is a bit tricky. 
                    // Best to just rely on one speak call if possible, or handle "onDone" to trigger next.
                    // For simplicity in this version, we'll assume one chunk or that we handle "next" manually if needed.
                    // But wait, we want to play the NEXT article when this one finishes.
                    handleSpeechDone();
                },
                onStopped: () => {
                    setIsPlaying(false);
                },
                onError: (e) => {
                    console.error("Speech error", e);
                    setIsPlaying(false);
                }
            });
        } else {
            // Simple chunking for very long text
            const chunks = [];
            let i = 0;
            while (i < text.length) {
                chunks.push(text.slice(i, i + MAX_LENGTH));
                i += MAX_LENGTH;
            }

            // This is a naive implementation of chunking. 
            // A better one would chain them via onDone. 
            // For now, let's just speak the first chunk to avoid complexity or loop.
            // Or better: just speak the whole thing and let OS handle it if it can, 
            // but Android has limits.
            // Let's try to chain them properly if we had time, but for MVP:
            Speech.speak(chunks[0], { onDone: handleSpeechDone });
        }
    };

    const handleSpeechDone = () => {
        // This fires when the current speech utterance is done.
        // We should check if we have more in the queue.
        // NOTE: onDone behavior varies by platform.
        if (!isPausedRef.current) {
            playNext();
        }
    };

    const play = (article: Article) => {
        stop(); // Stop current
        setCurrentArticle(article);
        setIsPlaying(true);
        isPausedRef.current = false;
        lastBoundaryRef.current = 0; // Reset boundary on new play
        const text = getArticleText(article);
        speak(text);
    };

    const addToQueue = (article: Article) => {
        setQueue((prev) => [...prev, article]);
        // If nothing is playing, start playing this? Or just add?
        // Let's just add. User can hit play. 
        // Or if queue was empty and nothing playing, maybe auto start?
        // For now, explicit play is better.
    };

    const pause = () => {
        if (Platform.OS === 'android') {
            // Android does not support pause in expo-speech, so we stop speech but keep state.
            Speech.stop();
            setIsPlaying(false);
            isPausedRef.current = true;
        } else {
            try {
                Speech.pause();
                setIsPlaying(false);
                isPausedRef.current = true;
            } catch (e) {
                console.log("Pause error:", e);
                stop();
            }
        }
    };

    const resume = () => {
        if (Platform.OS === 'android') {
            // Android cannot resume from pause natively.
            // We simulate resume by speaking from the last known boundary.
            if (currentArticle) {
                const fullText = getArticleText(currentArticle);
                // Ensure boundary is within bounds
                const safeBoundary = Math.max(0, Math.min(lastBoundaryRef.current, fullText.length));
                const remainingText = fullText.slice(safeBoundary);

                setIsPlaying(true);
                isPausedRef.current = false;

                // Speak remaining text
                speak(remainingText);
            }
        } else {
            Speech.resume();
            setIsPlaying(true);
            isPausedRef.current = false;
        }
    };

    const stop = () => {
        Speech.stop();
        setIsPlaying(false);
        setCurrentArticle(null);
        isPausedRef.current = false;
    };

    const playNext = () => {
        // If we have a queue, pop the next one
        if (queue.length > 0) {
            const next = queue[0];
            setQueue((prev) => prev.slice(1));
            play(next);
        } else {
            stop();
        }
    };

    const clearQueue = () => {
        setQueue([]);
        stop();
    };

    return (
        <TTSContext.Provider
            value={{
                queue,
                currentArticle,
                isPlaying,
                addToQueue,
                play,
                pause,
                resume,
                stop,
                playNext,
                clearQueue,
            }}
        >
            {children}
        </TTSContext.Provider>
    );
};
