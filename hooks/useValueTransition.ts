import { useEffect, useState } from "react";

const linear = (timePassed: number, totalDuration: number) => {
  return timePassed / totalDuration;
};

interface useValueTransitionOptions {
  inputValue: number;
  duration: number;
  easing?: (timePassed: number, totalDuration: number) => number;
}

/**
 * hook that transitions between numerical values, comes in handy when animating
 * @param inputValue value that should transition
 * @param duration duration of the transition in ms default 1000
 * @param easing easing functions
 * @returns
 */
export const useValueTransition = ({
  inputValue,
  duration = 1000,
  easing = linear,
}: useValueTransitionOptions) => {
  const [value, setValue] = useState(inputValue);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    const startTime = new Date();
    const distance = inputValue - value;
    const oldValue = value;
    const transitionTo = () => {
      const timePassed = Math.max(
        new Date().getTime() - startTime.getTime(),
        1,
      );
      if (timePassed >= duration) {
        setValue(inputValue);
        setIsTransitioning(false);
        return;
      }
      const fragment = easing(timePassed, duration);
      const increase = distance * fragment;
      const tmpValue = oldValue + increase;
      setValue(tmpValue);
      requestAnimationFrame(transitionTo);
    };
    if (value !== inputValue && !isTransitioning) {
      setIsTransitioning(true);
      transitionTo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);
  return value;
};
