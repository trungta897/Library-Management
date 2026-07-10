"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { MaterialIcon } from "@/components/base/material-icon";

interface BookImageFallbackProps extends ImageProps {
    fallbackIconSize?: number;
}

export default function BookImageFallback({ fallbackIconSize = 40, src, alt, className, ...props }: BookImageFallbackProps) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-primary-container transition-transform duration-300 group-hover:scale-105">
                <MaterialIcon name="menu_book" style={{ fontSize: fallbackIconSize }} className="text-on-primary-container" />
            </div>
        );
    }

    return <Image src={src} alt={alt} onError={() => setError(true)} className={className} {...props} />;
}
