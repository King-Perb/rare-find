"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';
import { cn } from '../../lib/utils'; // Changed to relative path for safety

interface LoadingScreenProps {
    /**
     * The URL to the Lottie animation file (json or .lottie).
     * Defaults to the 'pulse purble' animation in public folder.
     */
    src?: string;
    className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    src = "/pulse_purple.lottie",
    className,
}) => {
    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black",
                className
            )}
        >
            <div className="h-64 w-64">
                <DotLottieReact
                    src={src}
                    loop
                    autoplay
                />
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};
