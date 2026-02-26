import React from 'react';
import { cn } from '@/utils/util';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Image({ src, alt, width, height, className, ...props }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('max-w-full h-auto', className)}
      {...props}
    />
  );
}
