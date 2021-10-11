import { useMediaQuery } from 'react-responsive';

export const useScreenType = () => {
  const is3Cols = useMediaQuery({ minWidth: 1200 });
  // const is1Cols = useMediaQuery({minWidth: 600})

  if (is3Cols) {
    return '3-cols';
  }

  return 'fullscreen';
};
