import useWindowSize from './use-window-size';

const MAX_MOBILE_WIDTH = 768;

export default function useIsMaxWindowWidth(
  defaultWindowWidth = MAX_MOBILE_WIDTH
) {
  const { width } = useWindowSize();

  return width <= defaultWindowWidth;
}
