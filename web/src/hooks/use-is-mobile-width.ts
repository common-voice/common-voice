import useWindowSize from './use-window-size';

const MAX_MOBILE_WIDTH = 768;

export default function useIsMobileWidth() {
  const { width } = useWindowSize();

  return width <= MAX_MOBILE_WIDTH;
}
