import { CSSProperties, useState } from 'react';

interface CSSProps {
  thumbnail: CSSProperties;
  fullSize: CSSProperties;
}

interface ImageOnLoadType {
  handleImageOnLoad: () => void;
  css: CSSProps;
  isLoaded: boolean;
}

export function useImageOnLoad(): ImageOnLoadType {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Triggered when full image will be loaded.
  const handleImageOnLoad = () => {
    setIsLoaded(true);
  };

  const css: CSSProps = {
    // Thumbnail style.
    thumbnail: {
      visibility: isLoaded ? 'hidden' : 'visible',
      transition: 'visibility 0ms ease-out 500ms',
      width: isLoaded ? 0 : undefined,
    },
    fullSize: {
      visibility: isLoaded ? 'visible' : 'hidden',
      opacity: isLoaded ? 1 : 0,
      width: !isLoaded ? 0 : undefined,
      height: !isLoaded ? 0 : undefined,
    },
    // Full image style.
  };

  return { handleImageOnLoad, css, isLoaded };
}
